import React, { useEffect, useState } from "react";
import { Button, Typography, IconButton, Card, Box } from "@mui/material";
import axios from "axios";
import { Close as CloseIcon } from "@mui/icons-material";
import Navbar from "../../components/navbar/navbar.component";
import "./cart.styles.scss";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  let navigate = useNavigate();
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
      if (typeof item.price === "string") {
        itemPrice = Number(item.price.replace(/,/g, "")) || 0; // Remove commas using regex
      } else {
        itemPrice = Number(item.price) || 0; // Convert to number, default to 0 if NaN
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
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Box key={item.id} className="cart-item-box">
                <Card className="cart-item-card">
                  <div className="cart-item-image-div">
                    <img
                      src={`https://api.sadashrijewelkart.com/assets/${item.images[0].file}`}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="cart-item-details">
                    <Typography variant="h5" className="cart-item-name">
                      {item.name}
                    </Typography>
                    <Typography className="cart-item-meta">{`Size: ${item.size} - Quantity :${item.quantity}`}</Typography>
                    <Typography className="cart-item-price">
                      Price: ₹
                      <strong>{item.price.toLocaleString("en-IN")}</strong>
                    </Typography>
                    <Typography className="cart-item-save">{`Save ₹${item.discount}`}</Typography>
                    <Typography className="cart-item-delivery">{`Delivery by - ${item.deliveryDate}`}</Typography>
                  </div>
                  <IconButton
                    onClick={() => handleRemoveItem(item.id)}
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
          )}
        </div>
        <Box className="cart-summary">
          <Typography variant="h6" className="summary-title">
            Order Summary
          </Typography>
          <div className="summary-details">
            <Typography>Subtotal</Typography>
            <Typography>{calculateSubtotal()}</Typography>
          </div>
          <div className="summary-details">
            <Typography>You Saved</Typography>
            <Typography>₹0</Typography>
          </div>
          <div className="summary-details">
            <Typography>Total Cost</Typography>
            <Typography>{calculateSubtotal()}</Typography>
          </div>
          <Button
            variant="contained"
            className="place-order-btn"
            onClick={()=>{navigate("/checkout")}}
          >
            Place Order
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Cart;
