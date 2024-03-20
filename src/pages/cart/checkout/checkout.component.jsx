import React, { useState, useEffect } from "react";
import Navbar from "../../../components/navbar/navbar.component";
import "./checkout.styles.scss";
import axios from "axios";
import {
  Button,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Card,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CheckoutProgressBar from "../../../components/progressbar/progressbar.component";

const Checkout = () => {
  let navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(1);
  const [cartItems, setCartItems] = useState([]);
  const isLoggedIn = () => Boolean(localStorage.getItem("token"));
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressType, setAddressType] = useState("Home");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const addAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
  };

  const handleSubmitNewAddress = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAddress = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    };
    addAddress(newAddress);
    handleCloseAddressModal();
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

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
          console.log(cartItems);
        })
        .catch((error) => console.error("Error fetching cart items:", error));
    } else {
      navigate("/login");
    }
  }, []);

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressTypeChange = (event) => {
    setAddressType(event.target.value);
  };

  return (
    <div className="checkout">
      <Navbar />
      <div className="checkout-div-main">
        <div className="checkout-left">
          <div className="progress-bar">
            <CheckoutProgressBar activeStep={activeStep} />
          </div>
          <div
            className="address-component"
            style={{
              paddingLeft: "100px",
              paddingRight: "100px",
              paddingTop: "20px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Add Shipping Address</h2>
            <form onSubmit={handleSubmitNewAddress}>
              <Grid container className="modal-grid" spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="First Name"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Last Name"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Street & House Number"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    optional
                    label="Additional Information"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Pincode"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField required label="City" fullWidth margin="normal" />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="address-type-label">
                      Select Address Type
                    </InputLabel>
                    <Select
                      labelId="address-type-label"
                      id="address-type"
                      value={addressType}
                      label="Address Type"
                      onChange={handleAddressTypeChange}
                    >
                      <MenuItem value="Home">Home (7am-10pm delivery)</MenuItem>
                      <MenuItem value="Office">
                        Office (10am-7pm delivery)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField required label="State" fullWidth margin="normal" />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Country"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Mobile Number"
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={handleCloseAddressModal}
                    style={{ color: "#a36e29", padding:"20px",textAlign:"center", fontWeight:"bold", borderColor:"#a36e29" }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  </Grid>
                  <Grid item xs={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#a36e29", padding:"20px", textAlign:"center", fontWeight:"bold" }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
            {/* <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenAddressModal}
            >
              Add a New Address
            </Button> */}

            {/* <Modal
              open={isAddressModalOpen}
              onClose={handleCloseAddressModal}
              aria-labelledby="add-new-address-title"
              aria-describedby="add-new-address-description"
            >
              {addressModalBody}
            </Modal> */}
          </div>
        </div>
        <div className="checkout-right">
          <h4>Order Summary</h4>
          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <Box key={item.id} className="cart-item-box">
                  <Card className="cart-item-card">
                    <div className="cart-item-image-div">
                      <img
                        src={`https://api.sadashrijewelkart.com/assets/${item.images}`}
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
                    {/* <IconButton
                      onClick={() => handleRemoveItem(item.id)}
                      className="cart-item-remove"
                    >
                      <CloseIcon />
                    </IconButton> */}
                  </Card>
                </Box>
              ))
            ) : (
              <p>No items in cart</p>
            )}
          </div>
          <Divider style={{ marginTop: "10px", height: "5px" }} />
          <Box className="cart-summary">
            <div className="summary-details">
              <Typography>Subtotal</Typography>
              <Typography>{calculateSubtotal()}</Typography>
            </div>
            <div className="summary-details">
              <Typography>You Saved</Typography>
              <Typography>₹0</Typography>
            </div>
            <Divider style={{ marginBottom: "10px", height: "5px" }} />
            <div className="summary-details">
              <Typography>
                <strong>Total Cost</strong>
              </Typography>
              <Typography>
                <strong>{calculateSubtotal()}</strong>
              </Typography>
            </div>
            <Divider />
          </Box>
          <div className="buttons">
            <Button
              variant="outlined"
              className="go-back-btn"
              onClick={() => {
                navigate("/cart");
              }}
            >
              Go to Cart
            </Button>
            <Button
              variant="contained"
              className="place-order-btn"
              //   onClick={() => {
              //     navigate("/checkout");
              //   }}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

// {addresses.map((address, index) => (
//     <Card key={index} className="address-card">
//       <div className="address-content">
//         {/* Display address fields here */}
//         <Typography>{`${address.firstName} ${address.lastName}`}</Typography>
//         {/* ... display other fields ... */}
//       </div>
//       <Button
//         variant={
//           selectedAddress === address ? "contained" : "outlined"
//         }
//         color="primary"
//         onClick={() => handleSelectAddress(address)}
//       >
//         {selectedAddress === address ? "Selected" : "Select"}
//       </Button>
//     </Card>
//   ))}
