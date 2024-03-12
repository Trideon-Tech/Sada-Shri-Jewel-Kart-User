import React, { useEffect, useState } from "react";
import { Button, Typography, IconButton, Card, Box } from "@mui/material";
import axios from "axios";
import { Close as CloseIcon } from '@mui/icons-material';
import Navbar from "../../components/navbar/navbar.component";
import "./cart.styles.scss";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  useEffect(() => {
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
        })
        .catch((error) => console.error("Error fetching cart items:", error));
    } else {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(items);
    }
  }, []);

  const handleRemoveItem = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const handleQuantityChange = (id, amount) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === id) {
        const updatedQuantity = item.quantity + amount;
        return { ...item, quantity: updatedQuantity > 0 ? updatedQuantity : 1 };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  return (
    <div>
      <Navbar />
      <div className="cart-container">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Box key={item.id} className="cart-item-box">
              <Card className="cart-item-card">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <Typography variant="h5" className="cart-item-name">
                    {item.name}
                  </Typography>
                  <Typography className="cart-item-meta">{`Size:${item.size} - Quantity:${item.quantity}`}</Typography>
                  <Typography className="cart-item-price">
                    ₹{item.price}
                  </Typography>
                  <Typography className="cart-item-save">{`Save ₹${item.discount}`}</Typography>
                  <Typography className="cart-item-delivery">{`Delivery by - ${item.deliveryDate}`}</Typography>
                  <IconButton
                    onClick={() => handleRemoveItem(item.id)}
                    className="cart-item-remove"
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Card>
            </Box>
          ))
        ) : (
          <Typography className="empty-cart-message">
            Your cart is empty
          </Typography>
        )}
        <Box className="cart-summary">
          <Typography variant="h6" className="summary-title">
            Order Summary
          </Typography>
          <div className="summary-details">
            <Typography>Subtotal</Typography>
            <Typography>₹ 13000</Typography>
          </div>
          <div className="summary-details">
            <Typography>You Saved</Typography>
            <Typography>₹ 1000</Typography>
          </div>
          <div className="summary-details">
            <Typography>Total Cost</Typography>
            <Typography>₹ 12000</Typography> 
          </div>
          <Button
            variant="contained"
            className="place-order-btn"
            //onClick={handleCheckout}
          >
            Place Order
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Cart;

//{calculateTotal()}
//{calculateSavings()}
//{calculateSubtotal()}

function calculateSubtotal() {
    // Calculation based on cart items
  }
  
  function calculateSavings() {
    // Calculation based on cart items
  }
  
  function calculateTotal() {
    // Calculation based on cart items
  }