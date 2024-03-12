import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.component";
import { Divider, Grid, IconButton, TextField, Button } from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import { useState } from "react";
import "./register.styles.scss";
import axios from "axios";

const Register = () => {
  let navigate = useNavigate();
  const [mobile, setMobile] = useState();
  const [email, setemail] = useState();
  const [firstName, setfirstName] = useState();
  const [lastName, setLastName] = useState();

  const handleRegister = () => {
    console.log(mobile);
    console.log(email);
    console.log(firstName);
    console.log(lastName);
    let name = `${firstName} ${lastName}`;
    console.log(name);
    const formData = new FormData();
    formData.append("type", "register");
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("name", name);
    console.log("register");

    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/auth.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
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
            Signup to <br />
            Sada Shri Jewel Kart
          </h2>
          <p>
            Unlock Best prices and become an insider for our exclusive launches
            & offers. Complete your profile and get ₹250 worth of xCLusive
            Points.
          </p>
          <IconButton className="google-button" style={{ color: "#a36e29" }}>
            <Google />
          </IconButton>
          <IconButton className="facebook-button" style={{ color: "#a36e29" }}>
            <Facebook />
          </IconButton>
          <p>Or</p>
          <Divider />
          <Grid container className="register-grid" spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Enter your Mobile Number"
                variant="outlined"
                fullWidth
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Enter your email id"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Enter your first name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => {
                  setfirstName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Enter your last name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="register-button"
                onClick={(e) => handleRegister()}
              >
                Signup
              </Button>
            </Grid>
          </Grid>
          <p className="signup-text">
            Already Have a account?{" "}
            <p
              style={{ color: "#a36e29", textDecoration: "underline" }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
