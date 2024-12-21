import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../../RefreshContent";
import JwelleryCard from "../../components/card/jwellerycard.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";

const Wishlist = () => {
  const navigate = useNavigate();
  const { triggerRefresh } = useRefresh();
  const mediaQuery = useMediaQuery("(min-width:600px)");
  const [wishlistItems, setWishListItems] = useState([]);

  const getWishListItemsNonAuth = async () => {
    const wishListExists = localStorage.getItem("wish_list");
    if (wishListExists && wishListExists.length > 0) {
      const wishListItems = wishListExists.split(",");
      const detailsList = [];
      for (let item of wishListItems) {
        const { data } = await axios.get(
          `https://api.sadashrijewelkart.com/v1.0.0/user/products/details.php?type=product_details_on_id&user_id=-1&product_id=${item}`
        );
        console.log(data);
        detailsList.push(data?.response);
      }
      setWishListItems(detailsList);
    }
  };

  const addToCartHandlerForRecommendations = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      let existingList = localStorage.getItem("cart_list") || "";
      existingList = existingList.split(",");
      existingList.push(id);
      existingList = Array.from(new Set(existingList));
      localStorage.setItem("cart_list", existingList.join(","));
      triggerRefresh();
      return;
    }

    axios
      .put(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
        {
          product: id,
          customization:
            wishlistItems.find((item) => item.product_id === id)?.customizations
              ?.variants?.options[0]?.id || -1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        console.log(`Product with ID ${id} sent to API`);
        navigate("/cart");
      })
      .catch((error) => {
        console.error(`Error sending product with ID ${id} to API`, error);
      });
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        await getWishListItemsNonAuth();
        return;
      }
      console.log("calling from wishlist comp");
      const { data } = await axios.get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php?type=wishlist_items&wishlist_id=${localStorage.getItem(
          "default_wishlist"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("wishlist", data);
      setWishListItems(data?.response);
    })();
  }, []);

  const handleCardClick = (productName, hash, menuItemName) => {
    console.log(hash);
    console.log(`/item/${menuItemName}/${productName}-${hash}`);
    navigate(`/item/${menuItemName}/${productName}-${hash}`);
  };

  return (
    <div>
      <Navbar />
      <Box
        style={{
          width: "100vw",
          height: "40vh",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/25.webp"}
          style={{
            width: "100%",
            height: "40vh",
            objectFit: "cover",
          }}
        />
      </Box>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
        }}
      >
        <Typography
          style={{
            fontWeight: "bold",
            marginLeft: mediaQuery ? "100px" : "20px",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.4rem",
            marginTop: mediaQuery ? "10px" : "calc(60px + 4vh)",
            marginBottom: "10px",
            marginTop: "30px",
          }}
        >
          Your Wishlist
        </Typography>
      </div>
      <Box
        style={{
          width: "100%",
          paddingTop: "1%",
          paddingBottom: "5%",
          height: "max-content",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box style={{ width: "90%" }}>
          <Grid
            container
            spacing={mediaQuery ? 5 : 1}
            style={{ width: "100%" }}
          >
            {wishlistItems?.map((item) => (
              <Grid item xs={mediaQuery ? 12 / 5 : 6}>
                <JwelleryCard
                  id={item?.product_id}
                  key={item?.product_id}
                  image={item?.images ? item?.images[0]?.file : ""}
                  name={item?.name}
                  hash={item?.hash}
                  price={item?.customizations?.variants?.options[0]?.price}
                  isWishlisted={true}
                  isInCart={item?.exists_in_cart}
                  clickHandler={handleCardClick}
                  addToCartClick={addToCartHandlerForRecommendations}
                  wishlistItem={{ id: item?.id }}
                  quantity={item.quantity}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default Wishlist;
