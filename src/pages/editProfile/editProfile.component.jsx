import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";

const EditProfile = () => {
  const userName = localStorage.getItem("user_name")?.split(" ") || ["", ""];
  const [firstName, setFirstName] = useState(userName[0]);
  const [lastName, setLastName] = useState(userName[1]);
  const [mobile, setMobile] = useState(localStorage.getItem("mobile"));
  const [email, setEmail] = useState(localStorage.getItem("user_email"));
  const [pincode, setPincode] = useState(
    localStorage.getItem("default_pincode")
  );

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("type", "update");
    formData.append("name", `${firstName} ${lastName}`);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("user_id", localStorage.getItem("user_id"));

    const token = localStorage.getItem("token");
    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/auth.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          token,
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box
        style={{
          width: "70%",
          margin: "auto",
          textAlign: "left",
          marginTop: "30px",
        }}
      >
        <Typography
          style={{ marginTop: "2.5%", fontSize: "2rem", fontWeight: "bold" }}
        >
          Edit Profile
        </Typography>
      </Box>
      <Card
        style={{
          margin: "auto",
          width: "70%",
          minHeight: "600px",
          height: "max-content",
          paddingBottom: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "20px",
          marginTop: "20px",
        }}
        elevation={3}
      >
        <Avatar
          sx={{
            width: "130px",
            height: "130px",
            fontSize: "3.5rem",
            background:
              "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
          }}
        >
          {firstName.charAt(0)}
        </Avatar>
        <Box
          style={{
            marginTop: "30px",
            width: "80%",
            height: "70%",
            minHeight: "200px",

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              width: "100%",
              height: "max-content",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              value={firstName}
              variant="outlined"
              label="First Name*"
              fullWidth
              style={{ width: "45%" }}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
            <TextField
              value={lastName}
              variant="outlined"
              label="Last Name*"
              fullWidth
              style={{ width: "45%" }}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </Box>

          <TextField
            value={email}
            variant="outlined"
            label="Enter Email Id"
            fullWidth
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            value={mobile}
            label="Phone*"
            fullWidth
            onChange={(event) => {
              if (Number.isInteger(Number(event.target.value)))
                if (event.target.value.length <= 12)
                  setMobile(event.target.value);
            }}
          />
          <TextField
            value={pincode}
            variant="outlined"
            label="Default Pincode*"
            fullWidth
            onChange={(event) => {
              setPincode(event.target.value);
              localStorage.setItem("default_pincode", event.target.value);
            }}
          />
          <Box
            style={{
              width: "100%",
              height: "max-content",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <Button
              variant="outlined"
              size="large"
              style={{
                marginLeft: "auto",
                width: "25%",
                border: "2px solid #a36e29",
                color: "#a36e29",
                marginRight: "20px",
              }}
            >
              Cancel Canges
            </Button>
            <Button
              size="large"
              variant="contained"
              style={{
                width: "25%",
                background:
                  "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
              }}
              onClick={() => updateProfile()}
            >
              Save Canges
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default EditProfile;
