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
import React, { useState } from "react";

const EditProfile = () => {
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
          S
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
              variant="outlined"
              label="First Name*"
              fullWidth
              style={{ width: "45%" }}
            />
            <TextField
              variant="outlined"
              label="Last Name*"
              fullWidth
              style={{ width: "45%" }}
            />
          </Box>

          <TextField variant="outlined" label="Enter Email Id" fullWidth />
          <TextField variant="outlined" label="Phone*" fullWidth />
          <TextField variant="outlined" label="Default Pincode*" fullWidth />
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
