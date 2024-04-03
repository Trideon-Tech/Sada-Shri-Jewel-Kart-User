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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import CheckoutProgressBar from "../../../components/progressbar/progressbar.component";
import Close from "@mui/icons-material/Close";
import { Edit } from "@mui/icons-material";

const Checkout = () => {
  let navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(1);
  const [cartItems, setCartItems] = useState([]);
  const isLoggedIn = () => Boolean(localStorage.getItem("token"));
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [add1, setAdd1] = useState("");
  const [add2, setAdd2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const toggleAddAddressForm = () => {
    setShowAddAddressForm((prevShowAddAddressForm) => !prevShowAddAddressForm);
  };

  const handleAddressSubmit = () => {
    let name = `${firstName} ${lastName}`;
    console.log(name);
    const formData = new FormData();

    formData.append("key", "address");
    formData.append("mobile", mobile);
    formData.append("add_line_1", add1);
    formData.append("add_line_2", add2);
    formData.append("name", name);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("pincode", pincode);

    axios
      .post("https://api.sadashrijewelkart.com/v1.0.0/user/add.php", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("address added successfully");
        console.log(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (isLoggedIn()) {
      axios
        .get(
          "https://api.sadashrijewelkart.com/v1.0.0/user/details.php?key=address",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log("addresses fetched successfully");
          console.log(response);
          setAddresses(response.data.response);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      navigate("/login");
    }
  });

  const handleSelectAddress = (addressId) => {
    setSelectedAddress(addressId);
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
          console.log(response);
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
        itemPrice = Number(item.price.replace(/,/g, "")) || 0;
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
            <h2 style={{ marginBottom: "20px" }}>Shipping Addresses</h2>
            <Grid container spacing={2}>
              {addresses.map((address) => (
                <Grid item xs={12} sm={6} key={address.id}>
                  <Card
                    key={address.id}
                    className={`address-card ${
                      selectedAddress === address.id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectAddress(address.id)}
                  >
                    <div
                      className="address-content"
                      style={{ textAlign: "left" }}
                    >
                      <p>
                        <strong>{address.name}</strong>
                      </p>
                      <p>{address.add_line_1}</p>
                      <p>{address.add_line_2}</p>
                      <p>{`${address.city}, ${address.state} - ${address.pincode}`}</p>
                      <p>
                        <strong>Phone:</strong> {address.mobile}
                      </p>
                    </div>
                    <IconButton className="delete-icon">
                      <Close />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={toggleAddAddressForm}
              style={{ margin: "20px 0" }}
            >
              Add New Shipping Address
            </Button>
            {showAddAddressForm && (
              <Grid container className="modal-grid" spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="First Name"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Street & House Number"
                    fullWidth
                    margin="normal"
                    value={add1}
                    onChange={(e) => {
                      setAdd1(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    optional
                    label="Additional Information"
                    fullWidth
                    margin="normal"
                    value={add2}
                    onChange={(e) => {
                      setAdd2(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Pincode"
                    fullWidth
                    margin="normal"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="City"
                    fullWidth
                    margin="normal"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="State"
                    fullWidth
                    margin="normal"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Country"
                    fullWidth
                    margin="normal"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Mobile Number"
                    fullWidth
                    margin="normal"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={(e) => {
                      navigate("/cart");
                    }}
                    style={{
                      color: "#a36e29",
                      padding: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderColor: "#a36e29",
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={handleAddressSubmit}
                    variant="contained"
                    fullWidth
                    style={{
                      backgroundColor: "#a36e29",
                      padding: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            )}
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
