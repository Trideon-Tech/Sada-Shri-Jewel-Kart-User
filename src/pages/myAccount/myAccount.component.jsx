import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Navbar from "../../components/navbar/navbar.component";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import {
  Grid,
  Box,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import Slide from "@mui/material/Slide";
import Profile from "./profile.component";
import Orders from "./orders.component";
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyAccount() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    console.log("trigereed");
    setOpen(true);
  };

  const handleDeavticate = async () => {
    try {
      console.log("token===", localStorage.getItem("token"));
      const token = localStorage.getItem("token");
      console.log("token===", localStorage.getItem("user_id"));

      await axios.delete(
        `https://api.sadashrijewelkart.com/v1.0.0/user/user.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            user_id: localStorage.getItem("user_id"),
          },
        }
      );

      navigate("/");
      localStorage.clear();
    } catch (err) {
      console.log(err);
      setOpen(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar />
      <Dialog
        open={open}
        style={{ borderRadius: "20px" }}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You want to delete you account. You will lose all your data, saved
            addresses, gift coupons, etc.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{
              border: "2px solid #a36e29",
              color: "#a36e29",
              width: "200px",
            }}
            onClick={() => handleDeavticate()}
          >
            Are You Sure?
          </Button>
          <Button
            variant="contained"
            style={{
              border: "2px solid #a36e29",
              backgroundColor: "#a36e29",
              width: "200px",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
              {localStorage.getItem("user_name")}
            </Typography>
            <Typography
              style={{
                fontSize: "1rem",
                marginTop: "5%",
                color: "#00000090",
              }}
            >
              {localStorage.getItem("user_email")}
            </Typography>
            <Typography
              style={{
                fontSize: "1rem",
                marginTop: "5%",
                color: "#00000090",
              }}
            >
              <u>+{localStorage.getItem("mobile")}</u>
            </Typography>

            <Link to={"/my-account"}>
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
            <Link to={"/my-account/wallet"}>
              <Button
                style={{
                  fontWeight: "bold",
                  color: "#a36e29",
                  padding: 0,
                  marginTop: "5%",
                }}
              >
                Your Wallet
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
              onClick={() => {
                localStorage.clear();
                navigate("/");
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
              onClick={() => handleClickOpen()}
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
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}
