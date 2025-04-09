import Button from "@mui/joy/Button";
import {
  Divider,
  Grid,
  InputAdornment,
  TextField
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";

import "../signin/signin.styles.scss";

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isSignUp = window.location.pathname === "/signup";
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
    localStorage.removeItem("cart");
  };

  const handleRegister = () => {
    const formData = new FormData();
    formData.append("mobile", mobile);
    localStorage.setItem("mobile", mobile);
    navigate("/user-details");
  };

  const sendOTPHandler = () => {
    const formData = new FormData();
    setotpSent(true);
    formData.append("type", "generate_otp");
    formData.append("mobile", mobile);
    localStorage.setItem("mobile", mobile);

    //call API for OTP verification
    axios
      .post(`${process.env.REACT_APP_API_URL}/v1.0.0/user/otp.php`, formData, {
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
    //call API for OTP verification
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/otp.php?type=verify_otp&otp=${otp}&mobile=${mobile}`
      )
      .then((response) => {
        if (
          response.data.success === 1 &&
          response?.data?.response?.user_details
        ) {
          if (response.data.response.user_details.user_exists) {
            localStorage.setItem(
              "user_id",
              response.data.response.user_details.user_details.id
            );
            localStorage.setItem(
              "token",
              response.data.response.user_details.user_details.token
            );
            localStorage.setItem(
              "user_name",
              response.data.response.user_details.user_details.name
            );
            localStorage.setItem(
              "user_email",
              response.data.response.user_details.user_details.email
            );
            localStorage.setItem(
              "user_data",
              response.data.response.user_details.user_details
            );
            if (queryParams.get("redirect_to") == null) {
              navigate("/");
            } else {
              navigate(`${queryParams.get("redirect_to")}?drawer=open`);
            }
          } else {
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
        <div
          className="register-form"
          style={{
            width: "500px",
          }}
        >
          <div className="head">
            {isSignUp ? "Sign Up" : "Login"} to <br />
            Sadāshrī Jewelkart
          </div>
          <div className="text">
            Unlock Best prices and become an insider for our exclusive launches
            & offers.
          </div>
          <Divider />
          <Grid container className="register-grid" spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Enter Your Mobile Number"
                required
                value={mobile}
                onChange={(e) => {
                  if (Number.isInteger(Number(e.target.value)))
                    if (e.target.value.length <= 10) setMobile(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && mobile?.length === 10) {
                    sendOTPHandler();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{
                        marginLeft: "-13px",
                      }}
                    >
                      <Button
                        variant="solid"
                        type="submit"
                        style={{
                          borderTopLeftRadius: "5px",
                          borderBottomLeftRadius: "5px",
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          backgroundColor: "#a36e29",
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                        }}
                      >
                        +91
                      </Button>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{
                        marginRight: "-13px",
                      }}
                    >
                      {mobile?.length > 9 ? (
                        <Button
                          variant="solid"
                          loading={optSent}
                          type="submit"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            backgroundColor: "#a36e29",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "0.8rem",
                          }}
                          onClick={() => sendOTPHandler()}
                        >
                          Send OTP
                        </Button>
                      ) : (
                        <Button
                          variant="solid"
                          color="neutral"
                          type="submit"
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: "0.8rem",
                          }}
                          disabled={true}
                        >
                          Send OTP
                        </Button>
                      )}
                    </InputAdornment>
                  ),
                }}
                e
                sx={{
                  width: "100%",
                  height: "22px",
                  "& input": {
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size="small"
                sx={{
                  width: "100%",
                  height: "22px",
                  "& input": {
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
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
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => {
                  setOTP(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && otp?.length === 4) {
                    verifyOTPHandler();
                  }
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
                    background:
                      "linear-gradient(to right, #d4a76a, #a36e29)",
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
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
                  }}
                >
                  Continue
                </Button>
              )}
            </Grid>
          </Grid>
          <p className="signup-text text">
            {isSignUp ? "Already have an account?" : "Need a new account?"}
          </p>
          <p
            style={{
              color: "#a36e29",
              textDecoration: "underline",
              cursor: "pointer",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
              marginTop: "-12px",
            }}
            onClick={() => {
              navigate(isSignUp ? "/signin" : "/signup");
            }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
