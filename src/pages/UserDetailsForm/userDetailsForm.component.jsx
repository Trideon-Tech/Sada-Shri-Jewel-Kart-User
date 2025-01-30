import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Button, Divider, Grid, TextField } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../../components/navbar/navbar.component";
import { generalToastStyle } from "../../utils/toast.styles";

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

  // useEffect(() => {
  //   let items = localStorage.getItem("cart_list") || "";
  //   items = items.split(",");
  //   sendCartToAPI(items);
  // }, []);

  const sendCartToAPI = (items) => {
    const token = localStorage.getItem("token");
    items.forEach((item) => {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/cart.php`,
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

    localStorage.removeItem("cart_list");
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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/auth.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("token", userData.response.token);
      localStorage.setItem("user_id", userData.response.id);
      localStorage.setItem("user_name", `${firstName} ${lastName}`);
      localStorage.setItem("user_email", email);
      localStorage.setItem("mobile", localStorage.getItem("mobile"));

      const wishlistData = new FormData();
      wishlistData.append("type", "create");
      wishlistData.append("user_id", localStorage.getItem("user_id"));
      wishlistData.append("wishlist_name", `default`);
      wishlistData.append("wishlist_items", "[]");

      await axios.post(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/wishlist.php`,
        wishlistData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { data: defaultWishlists } = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/wishlist.php?type=wishlist&user_id=${localStorage.getItem(
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
      toast.error(error.response.data.message, generalToastStyle);
      setSnackBarMessage(error.response.data.message);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <ToastContainer />
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            Complete Sign Up to <br />
            Sadāshrī Jewelkart
          </h2>
          <Divider style={{ margin: "20px 0" }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Enter First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                sx={{
                  '& label.Mui-focused': {
                    color: '#a36e29',
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a36e29",
                    },
                    
                  },
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
                sx={{
                  '& label.Mui-focused': {
                    color: '#a36e29',
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a36e29",
                    },
                  },
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
                sx={{
                  '& label.Mui-focused': {
                    color: '#a36e29',
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a36e29",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                placeholder="Select Gender"
                size="lg"
                sx={{
                  height: "76%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#a36e29",
                    },
                  },
                }}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              gap: "5px",
            }}
          >
            <p style={{ margin: 0 }}>Don't Have an account?</p>
            <p
              style={{
                color: "#a36e29",
                textDecoration: "underline",
                cursor: "pointer",
                margin: 0,
              }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              SignUp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
