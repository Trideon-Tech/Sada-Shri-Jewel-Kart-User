import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import CartItem from "../cart/cartItem.component";
import CartTotal from "./cartTotal.component";
import CheckoutForm from "./checkoutForm.component";

const Checkout = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [refreshCart, setRefreshCart] = useState(1);
  const [coinsRedeem, setCoinsRedeem] = useState(0);

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    let params = new URLSearchParams(location.search);

    if (params.get("action") === "buy-now") {
      let product = params.get("prod");
      let hash = params.get("hash");
      let customization = params.get("customization");

      const userId = localStorage.getItem("user_id")
        ? localStorage.getItem("user_id")
        : -1;
      axios
        .get(
          `https://api.sadashrijewelkart.com/v1.0.0/user/products/details.php?name=${product}&hash=${hash}&user_id=${userId}`
        )
        .then((response) => {
          if (customization == -1)
            setCartItems(() => [
              {
                ...response.data?.response,
                customization_applied: false,
                customization: "-1",
              },
            ]);
          else {
            let cartItem = {
              ...response.data?.response,
              customization_applied: true,
              customization: {
                fields: response.data?.response["customizations"]["fields"],
                variant: [
                  {
                    ...response.data?.response["customizations"]["variants"][
                      "options"
                    ].find((val) => val["id"] == customization),
                  },
                ],
              },
            };

            setCartItems(() => [cartItem]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(
          `https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php?user_id=${localStorage.getItem(
            "user_id"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setCartItems(response.data?.response);
        })
        .catch((error) =>
          console.log("Error while fetching cart items", error)
        );
    }
  }, [refreshCart]);

  return (
    <>
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "white",
          marginTop: matches ? "" : "6rem",
        }}
      >
        <Navbar />
        <Box
          style={{
            width: !matches ? "90%" : "100%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={!matches ? 12 : 6}>
              <CheckoutForm cartItems={cartItems} />
            </Grid>
            <Grid item xs={!matches ? 12 : 5}>
              <Box
                style={{
                  padding: !matches ? "0%" : "3%",
                  paddingRight: 0,
                  backgroundColor: !matches ? "white" : "#f8f8f8",
                }}
              >
                <Typography
                  style={{
                    textAlign: !matches ? "left" : "center",
                    fontWeight: "bold",
                    color: "black",
                    marginBottom: "3%",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1rem",
                    paddingTop: "50px",
                  }}
                >
                  Order Summary
                </Typography>
                {cartItems?.map((item) => (
                  <CartItem
                    key={item.cart_id}
                    item={item}
                    itemName={item.name}
                    weight={item.weight}
                    price={item.price}
                    readOnly={true}
                  />
                ))}
                <Divider />
                <CartTotal
                  items={cartItems}
                  coinValueDiscount={Number(coinsRedeem)}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};
export default Checkout;
