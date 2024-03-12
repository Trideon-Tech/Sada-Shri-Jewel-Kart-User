import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import "./login.styles.scss";
import Navbar from "../../components/navbar/navbar.component";
import { AddBox, Done, Facebook, Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  let navigate = useNavigate();
  const [mobile, setMobile] = useState();
  const [otp, setOtp] = useState();
  const [otpSent, setOTPSent] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);
  const [sendOTPAdornment, activateSendOTPAdornment] = useState(false);
  const [verifyOTPAdornment, activateVerifyOTPAdornment] = useState(false);
  const [nextStepLoading, activateNextStepLoading] = useState(false);

  const sendOTP = () => {
    // API to send OTP
    //toast("OTP Sent Successfully!", generalToastStyle);
    activateSendOTPAdornment(false);
    setOTPSent(true);
  };

  const verifyOTP = () => {
    // API to verify OTP
    //toast("OTP Verified Successfully!", generalToastStyle);
    activateVerifyOTPAdornment(false);
    setOTPVerified(true);
  };

  const handleLogin = () => {
    const formData = new FormData();
    formData.append("type", "login");
    formData.append("mobile", "1234567890");

    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/auth.php",
        formData,
        {
          headers: {
            Authorization:
              "Bearer CWcyi9M3OIIi17umJNZi5YlXTnHrmsDhYbAP3N0BuZuzNwIQNpRcUvdeiJjPlVxy",
          },
        }
      )
      .then((response) => {
        const token = response.data.response.token;
        const loginUser = response.data.response;
        console.log("login successful");
        localStorage.setItem("loginUser", JSON.stringify(loginUser)); //
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        //activateNextStepLoading(false);
        //toast.warn(error.response.data.message, generalToastStyle);
      });
  };

  return (
    <div className="login">
      <Navbar />
      <div className="login-container">
        <div className="login-form">
          <h2>
            Login to <br />
            Sada Shri Jewel Kart
          </h2>
          <p>
            Login to unlock best prices and become an insider for our exclusive
            launches & offers. Complete your profile and get{" "}
            <strong>₹250</strong> worth of Xclusive Points.
          </p>
          <TextField
            label="Enter your Mobile Number"
            variant="outlined"
            fullWidth
            value={mobile}
            onEdit={(e) => {
              setMobile(e.target.value);
              if (e.target.value.length === 10) activateSendOTPAdornment(true);
              else activateSendOTPAdornment(false);
            }}
            adornment={
              <InputAdornment position="end">
                <Done
                  className={
                    sendOTPAdornment ? "adornment-active" : "adornment-inactive"
                  }
                  onClick={sendOTP}
                />
              </InputAdornment>
            }
          />
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onEdit={(e) => {
              setOtp(e.target.value);
              if (e.target.value.length === 6) activateVerifyOTPAdornment(true);
              else activateVerifyOTPAdornment(false);
            }}
            adornment={
              <InputAdornment position="end">
                <Done
                  className={
                    verifyOTPAdornment
                      ? "adornment-active"
                      : "adornment-inactive"
                  }
                  onClick={verifyOTP}
                />
              </InputAdornment>
            }
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="login-button"
            onClick={(e) => handleLogin()}
          >
            Login
          </Button>
          <Divider />
          <p>Or</p>

          <IconButton className="google-button" style={{ color: "#a36e29" }}>
            <Google />
          </IconButton>
          <IconButton className="facebook-button" style={{ color: "#a36e29" }}>
            <Facebook />
          </IconButton>
          <p className="signup-text">
            New to Sada Shri Jewel Kart?{" "}
            <p
              style={{color:"#a36e29", textDecoration:"underline"}}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Create an Account
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
