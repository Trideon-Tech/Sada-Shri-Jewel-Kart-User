import { Facebook, Google } from "@mui/icons-material";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import { Divider, Grid, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.component";
import "./signin.styles.scss";

const SignIn = () => {
  let navigate = useNavigate();
  const [mobile, setMobile] = useState();
  const [otp, setOTP] = useState();
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
    console.log("hello");
    const formData = new FormData();

    formData.append("type", "login");
    formData.append("mobile", mobile);
    localStorage.setItem("mobile", mobile);
    navigate("/");

    //call API for OTP verification
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/auth.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(
          "User registered successfully:",
          response.data.response.token
        );
        const token = response.data.response.token;
        localStorage.setItem("token", token);
        sendCartToAPI(token);
        navigate("/");
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
            SignIn to <br />
            Sadāshrī Jewelkart
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
                      // loading={data.status === "loading"}
                      type="submit"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        backgroundColor: "#a36e29",
                      }}
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
                  onClick={handleRegister}
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
                  color="neutral"
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

export default SignIn;
