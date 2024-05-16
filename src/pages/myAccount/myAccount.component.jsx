import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Navbar from "../../components/navbar/navbar.component";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Grid, Box, Divider, Typography, Button } from "@mui/material";
import Profile from "./profile.component";
import Orders from "./orders.component";
import { BrowserRouter, Route, Routes, Outlet, Link } from "react-router-dom";
export default function MyAccount() {
  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar />
      <Box style={{ width: "100%", height: "100%", display: "flex" }}>
        <Box
          style={{
            width: "30%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Box
            style={{
              margin: "auto",
              width: "60%",
              height: "100%",
              textAlign: "left",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography
              style={{ fontWeight: "bold", fontSize: "2rem", marginTop: "10%" }}
            >
              My Account
            </Typography>
            <Typography
              style={{ fontWeight: "bold", fontSize: "1rem", marginTop: "20%" }}
            >
              Sushovan Paul
            </Typography>
            <Typography
              style={{
                fontSize: "1rem",
                marginTop: "5%",
                color: "#00000090",
              }}
            >
              sushovanpaul07@gmail.com
            </Typography>
            <Typography
              style={{
                fontSize: "1rem",
                marginTop: "5%",
                color: "#00000090",
              }}
            >
              <u>+91 8102535095</u>
            </Typography>

            <Link to={"/my-account/edit-profile"}>
              <Button
                style={{
                  fontWeight: "bold",
                  color: "#a36e29",
                  padding: 0,
                  marginTop: "5%",
                }}
              >
                Edit Profile
              </Button>
            </Link>
            <Divider
              style={{ width: "100%", marginTop: "10%", marginBottom: "10%" }}
            />
            <Link to={"/my-account/orders"}>
              <Button
                style={{
                  fontWeight: "bold",
                  color: "#a36e29",
                  padding: 0,
                  marginTop: "5%",
                }}
              >
                Orders and Returns
              </Button>
            </Link>
            <Link to={"/my-account/address"}>
              <Button
                style={{
                  fontWeight: "bold",
                  color: "#a36e29",
                  padding: 0,
                  marginTop: "5%",
                }}
              >
                Saved Addresses
              </Button>
            </Link>
            <Divider
              style={{ width: "100%", marginTop: "auto", marginBottom: "10%" }}
            />
            <Button
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#00000090",
                padding: 0,
                marginTop: "5%",
              }}
            >
              Logout
            </Button>
            <Button
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#00000090",
                padding: 0,
                marginTop: "5%",
                marginBottom: "20%",
              }}
            >
              Deactivate Account
            </Button>
          </Box>
        </Box>
        <Box
          style={{
            width: "70%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}
