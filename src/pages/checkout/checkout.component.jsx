import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.component";
import CartItem from "../cart/cartItem.component";
import CartTotal from "./cartTotal.component";
import CheckoutForm from "./checkoutForm.component";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [refreshCart, setRefreshCart] = useState(1);
  const [coinsRedeem, setCoinsRedeem] = useState(0);

  const matches = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // if (!sessionStorage.getItem("cart")) {
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/wallet.php?type=wallet&user_id=${localStorage.getItem(
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
        setCoinsRedeem(response?.data?.response[0].balance);
      })
      .catch((error) => console.log("Error while fetching wallet info", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
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
      .catch((error) => console.log("Error while fetching cart items", error));
  }, [refreshCart]);

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Navbar />
      <Box style={{ width: !matches ? "90%" : "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={!matches ? 12 : 6}>
            <CheckoutForm cartItems={cartItems} />
          </Grid>
          <Grid item xs={!matches ? 12 : 5}>
            <Box
              style={{
                padding: "3%",
                paddingRight: 0,
                height: "100%",
                backgroundColor: "#f8f8f8",
              }}
            >
              <Typography
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "3%",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
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
  );
};
export default Checkout;
