import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JwelleryCard from "../../components/card/jwellerycard.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";

const Wishlist = () => {
  const navigate = useNavigate();
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
          height: "max-content",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/productList bg.jpg"}
          style={{ width: "100%" }}
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
            marginLeft: "100px",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.4rem",
            marginTop: "10px",
            marginBottom: '10px'
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
                  key={item?.id}
                  id={item?.id}
                  hash={item?.hash}
                  image={item?.images ? item?.images[0]?.file : ""}
                  name={item?.name}
                  price={item?.price}
                  clickHandler={handleCardClick}
                  isWishlisted={true}
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
