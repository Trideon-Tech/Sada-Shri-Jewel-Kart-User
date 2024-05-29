import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import Navbar from "../../components/navbar/navbar.component";
import Snackbar from "@mui/joy/Snackbar";
import {
  Divider,
  Grid,
  IconButton,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import { useEffect, useState } from "react";
import "./userDetailsForm.styles.scss";
import CustomSnackbar from "../../components/customSnackbar/customSnackBar.component";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import axios from "axios";

const UserDetailsForm = () => {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const sendCartToAPI = (token) => {
    console.log(token);
    cartItems.forEach((item) => {
      axios
        .put(
          "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: {
              product: item.id,
              customization: -1,
            },
          }
        )
        .then(() => {
          console.log(`Product with ID ${item.id} sent to API`);
        })
        .catch((error) => {
          console.error(
            `Error sending product with ID ${item.id} to API`,
            error
          );
        });
    });

    localStorage.removeItem("cart");
  };

  const handleUserRegistration = async () => {
    const formData = new FormData();
    formData.append("type", "register");
    formData.append("mobile", localStorage.getItem("mobile"));
    formData.append("name", `${firstName} ${lastName}`);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("gender", gender);
    formData.append("email", email);
    try {
      const { data: userData } = await axios.post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/auth.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("token", userData.response.token);
      localStorage.setItem("user_id", userData.response.id);

      const wishlistData = new FormData();
      wishlistData.append("type", "create");
      wishlistData.append("user_id", localStorage.getItem("user_id"));
      wishlistData.append("wishlist_name", `default`);
      wishlistData.append("wishlist_items", "[]");

      await axios.post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php",
        wishlistData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data: defaultWishlists } = await axios.get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php?type=wishlist&user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem(
        "default_wishlist",
        defaultWishlists?.response[0]?.id
      );
      navigate("/");
    } catch (error) {
      setSnackBarMessage(error.response.data.message);
    }
  };

  return (
    <div className="register">
      <Navbar />
      <Snackbar
        autoHideDuration={5000}
        variant="soft"
        color="primary"
        size="lg"
        invertedColors
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={(theme) => ({
          backgroundColor: "#fff2e0",
          maxWidth: 360,
        })}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "max-content",
            padding: "2%",
          }}
        >
          <Typography variant="body">{snackBarMessage}</Typography>
          <Button
            variant="solid"
            style={{
              marginTop: "5%",
              color: "white",
              backgroundColor: "#a36e29",
            }}
            component={Link}
            to="/signin"
          >
            Login
          </Button>
        </div>
      </Snackbar>
      <div className="register-container">
        <div className="register-form">
          <h2>
            Complete Sign Up to <br />
            Sada Shri Jewel Kart
          </h2>
          <p>
            Unlock Best prices and become an insider for our exclusive launches
            & offers. Complete your profile and get ₹250 worth of xCLusive
            Points.
          </p>
          <IconButton className="google-button" style={{ color: "#a36e29" }}>
            <Google style={{ fontSize: "3rem" }} />
          </IconButton>
          <IconButton className="facebook-button" style={{ color: "#a36e29" }}>
            <Facebook style={{ fontSize: "3rem" }} />
          </IconButton>
          <p>Or</p>
          <Divider />
          <Grid container className="register-grid" spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Enter First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Enter Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Enter Email Address"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                placeholder="Select Gender"
                size="lg"
                sx={{ height: "76%" }}
                name="foo"
                onChange={(newValue) => {
                  setGender(newValue);
                }}
              >
                <Option value="female">Female</Option>
                <Option value="male">Male</Option>
                <Option value="other">Other</Option>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#a36e29" }}
                onClick={(e) => handleUserRegistration()}
              >
                Complete
              </Button>
            </Grid>
          </Grid>
          <p className="signup-text">
            Don't Have an account?{" "}
            <p
              style={{ color: "#a36e29", textDecoration: "underline" }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              SignUp
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
