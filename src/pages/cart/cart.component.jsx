import React, { useEffect, useState } from "react";
import "./cart.styles.scss";
import Navbar from "../../components/navbar/navbar.component";
import { Grid, Box, Divider, Typography } from "@mui/material";
import CartItem from "./cartItem.component";
import CartTotal from "./cartTotal.component";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [refreshCart, setRefreshCart] = useState(1);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCartItems(response.data.response);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, [refreshCart]);

  const removeCartItemHandler = (cartId) => {
    const token = localStorage.getItem("token");

    console.log(cartId, "to delete");
    axios
      .delete(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { id: cartId },
        }
      )
      .then((response) => {
        setRefreshCart(refreshCart + 1);
      })
      .catch((error) => console.log("Error while removing  card items", error));
  };
  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <Navbar />
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#f5f5f5",
        }}
      >
        {cartItems?.length > 0 ? (
          <Box style={{ width: "70%" }}>
            <Grid container spacing={6}>
              <Grid item xs={8}>
                <Box style={{ height: "60%", marginTop: "6.8%" }}>
                  {cartItems?.map((item) => (
                    <CartItem
                      key={item.cart_id}
                      item={item}
                      removeHandler={removeCartItemHandler}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={4}>
                <CartTotal items={cartItems} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Typography
              variant="h2"
              style={{ fontWeight: "bold", color: "lightgray" }}
            >
              Nothing In the Cart yet !!!
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Cart;
