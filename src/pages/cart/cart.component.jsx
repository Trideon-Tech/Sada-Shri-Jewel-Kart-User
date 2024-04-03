import React, { useEffect, useState } from "react";
import { Button, Typography, IconButton, Card, Box } from "@mui/material";
import axios from "axios";
import { Close as CloseIcon } from "@mui/icons-material";
import Navbar from "../../components/navbar/navbar.component";
import "./cart.styles.scss";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  let token = localStorage.getItem("token");
  let navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState("");
  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  const getAllCartItems = () => {
    if (isLoggedIn()) {
      axios
        .get(
          "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setCartItems(response.data.response);
          setCartId(response.data.response.cart_id);
          console.log(response.data.response);
        })
        .catch((error) => console.error("Error fetching cart items:", error));
    } else {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(items);
    }
  };

  useEffect(() => {
    getAllCartItems();
  }, []);

  const handleRemoveItem = (id) => {
    //console.log(id);
    //console.log(token);
    if (isLoggedIn) {
      axios
        .delete(
          "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: {
              id,
            },
          }
        )
        .then((response) => {
          console.log(response.data.response);
          getAllCartItems();
        })
        .catch((error) => console.error("Error fetching cart items:", error));
    } else {
      const updatedCartItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCartItems);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }
  };

  const handleQuantityChange = (id, amount) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        const updatedQuantity = item.quantity + amount;
        return {
          ...item,
          quantity: updatedQuantity > 0 ? updatedQuantity : 1,
          price: item.price * updatedQuantity, // Update price based on quantity
        };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const calculateSubtotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      let itemPrice = 0;
      let price = item.customization_applied
        ? item.customization.variant[0].price
        : item.price;
      if (typeof item.price === "string") {
        itemPrice = Number(price.replace(/,/g, "")) || 0; // Remove commas using regex
      } else {
        itemPrice = Number(price) || 0; // Convert to number, default to 0 if NaN
      }
      const itemQuantity = item.quantity || 1; // Default to 1 if quantity is not provided
      const itemTotal = itemPrice * itemQuantity;
      return total + itemTotal;
    }, 0);

    return subtotal.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    });
  };

  return (
    <div className="cart">
      <Navbar />
      <div className="cart-container">
        <div className="cart-items">
          {cartItems ? (
            cartItems.length > 0 ? (
              cartItems.map((item) => (
                <Box key={item.id} className="cart-item-box">
                  <Card className="cart-item-card">
                    <div className="cart-item-image-div">
                      {isLoggedIn ? (
                        <img
                          src={`https://api.sadashrijewelkart.com/assets/${item.images[0].file}`}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      ) : (
                        <img
                          src={`https://api.sadashrijewelkart.com/assets/${item.images}`}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      )}
                    </div>
                    <div className="cart-item-details">
                      <Typography variant="h5" className="cart-item-name">
                        {item.name}
                      </Typography>
                      <Typography className="cart-item-meta">{`Size: ${item.size} - Quantity :${item.quantity}`}</Typography>
                      <Typography className="cart-item-price">
                        Price: ₹
                        <strong>
                          {item.customization_applied
                            ? item.customization.variant[0].price
                            : item.price.toLocaleString("en-IN")}
                        </strong>
                      </Typography>
                      <Typography className="cart-item-save">{`Save ₹${item.discount}`}</Typography>
                      <Typography className="cart-item-delivery">{`Delivery by - ${item.deliveryDate}`}</Typography>
                    </div>
                    <IconButton
                      onClick={() =>
                        handleRemoveItem(isLoggedIn ? item.cart_id : item.id)
                      }
                      className="cart-item-remove"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Card>
                </Box>
              ))
            ) : (
              <Typography className="empty-cart-message">
                Your cart is empty
              </Typography>
            )
          ) : (
            <Typography className="empty-cart-message">
              Your cart is empty
            </Typography>
          )}
        </div>
        <Box className="cart-summary">
          <Typography variant="h6" className="summary-title">
            Order Summary
          </Typography>
          <div className="summary-details">
            <Typography>Subtotal</Typography>
            <Typography>{cartItems ? calculateSubtotal() : <>₹0</>}</Typography>
          </div>
          <div className="summary-details">
            <Typography>You Saved</Typography>
            <Typography>₹0</Typography>
          </div>
          <div className="summary-details">
            <Typography>Total Cost</Typography>
            <Typography>{cartItems ? calculateSubtotal() : <>₹0</>}</Typography>
          </div>
          <Button
            variant="contained"
            className="place-order-btn"
            onClick={() => {
              navigate("/checkout");
            }}
          >
            Place Order
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Cart;
