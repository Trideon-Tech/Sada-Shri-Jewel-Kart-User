import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.component";
import { Divider, Grid, IconButton, TextField } from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import { useEffect, useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import "./register.styles.scss";
import axios from "axios";

const Register = () => {
  let navigate = useNavigate();
  const [mobile, setMobile] = useState();
  const [otp, setOTP] = useState();
  const [optSent, setotpSent] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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

  const handleRegister = () => {
    const formData = new FormData();
    formData.append("mobile", mobile);
    localStorage.setItem("mobile", mobile);
    navigate("/user-details");

    //call API for OTP verification
    // axios
    // .post(
    //   "https://api.sadashrijewelkart.com/v1.0.0/user/auth.php",
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // )
    // .then((response) => {
    //   console.log(
    //     "User registered successfully:",
    //     response.data.response.token
    //   );
    //   const token = response.data.response.token;
    //   localStorage.setItem("token", token);
    //   sendCartToAPI(token);
    //   navigate("/");
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    // });
  };

  const sendOTPHandler = () => {
    const formData = new FormData();
    setotpSent(true);
    formData.append("type", "generate_otp");
    formData.append("mobile", mobile);
    localStorage.setItem("mobile", mobile);

    //call API for OTP verification
    axios
      .post("https://api.sadashrijewelkart.com/v1.0.0/user/otp.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.success === 1) {
          setotpSent(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const verifyOTPHandler = () => {
    const formData = new FormData();
    setotpSent(true);
    formData.append("type", "verify_otp");
    formData.append("mobile", mobile);
    formData.append("otp", otp);

    //call API for OTP verification
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/otp.php?type=verify_otp&otp=${otp}&mobile=${mobile}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.success === 1) {
          if (response.data.response.type === "success") {
            navigate("/user-details");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="register">
      <Navbar />
      <div className="register-container">
        <div className="register-form">
          <h2>
            Signup to <br />
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
            <Grid item xs={12}>
              <Input
                sx={{ "--Input-decoratorChildHeight": "45px" }}
                placeholder="Enter Your Mobile Number"
                type="text"
                variant="outlined"
                required
                value={mobile}
                size="lg"
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
                // error={data.status === "failure"}
                endDecorator={
                  mobile?.length > 9 ? (
                    <Button
                      variant="solid"
                      loading={optSent}
                      type="submit"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        backgroundColor: "#a36e29",
                      }}
                      onClick={() => sendOTPHandler()}
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <Button
                      variant="solid"
                      color="neutral"
                      // loading={data.status === "loading"}
                      type="submit"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      disabled={true}
                    >
                      Send OTP
                    </Button>
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                placeholder="Enter OTP"
                type="text"
                variant="outlined"
                required
                value={otp}
                size="lg"
                onChange={(e) => {
                  setOTP(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {otp?.length > 3 ? (
                <Button
                  fullWidth
                  variant="solid"
                  color="primary"
                  size="lg"
                  onClick={() => verifyOTPHandler()}
                  style={{
                    color: "white",
                    backgroundColor: "#a36e29",
                  }}
                  disabled={false}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="solid"
                  color="primary"
                  size="lg"
                  onClick={handleRegister}
                  disabled={true}
                >
                  Continue
                </Button>
              )}{" "}
            </Grid>
          </Grid>
          <p className="signup-text">
            Already Have a account?{" "}
            <p
              style={{ color: "#a36e29", textDecoration: "underline" }}
              onClick={() => {
                navigate("/signin");
              }}
            >
              Signin
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
