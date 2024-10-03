import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import Navbar from "../../components/navbar/navbar.component";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Slide from "@mui/material/Slide";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyAccount() {
  const matches = useMediaQuery("(min-width:600px)");

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    console.log("trigereed");
    setOpen(true);
  };

  const [drawerOpen, setDrawerOpen] = React.useState(true);
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
      {!matches ? (
        <Box
          style={{
            width: "100%",
            height: "50px",
            display: "flex",
            justifyContent: "flex-start",

            alignItems: "center",
          }}
        >
          <ArrowForwardIosIcon
            style={{ color: "#a36e29", marginLeft: "30px" }}
            onClick={() => setDrawerOpen(true)}
          />
        </Box>
      ) : null}
      <Dialog
        open={open}
        style={{ borderRadius: "20px" }}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.9rem",
            }}
          >
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
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "600",
            }}
            onClick={() => handleDeavticate()}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            style={{
              border: "2px solid #a36e29",
              backgroundColor: "#a36e29",
              width: "200px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "600",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            width: matches ? "30%" : 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          {matches ? (
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
                style={{
                  fontWeight: "bold",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.2rem",
                  marginTop: "20px",
                }}
              >
                My Account
              </Typography>
              <Typography
                style={{
                  fontWeight: "bold",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                  marginTop: "50px",
                }}
              >
                {localStorage.getItem("user_name")}
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  marginTop: "10px",
                  color: "#00000090",
                }}
              >
                {localStorage.getItem("user_email")}
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "#00000090",
                }}
              >
                <u>+91{localStorage.getItem("mobile")}</u>
              </Typography>

              <Link to={"/my-account"}>
                <Button
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "#a36e29",
                    padding: 0,
                    marginTop: "10px",
                  }}
                >
                  Edit Profile
                </Button>
              </Link>
              <Divider
                style={{ width: "100%", marginTop: "8%", marginBottom: "8%" }}
              />
              <Link to={"/my-account/orders"}>
                <Button
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#353535",
                    padding: 0,
                  }}
                >
                  Orders and Returns
                </Button>
              </Link>
              <Link to={"/my-account/address"}>
                <Button
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#353535",
                    padding: 0,
                    marginTop: "10px",
                  }}
                >
                  Saved Addresses
                </Button>
              </Link>
              <Link to={"/my-account/wallet"}>
                <Button
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#353535",
                    padding: 0,
                    marginTop: "10px",
                  }}
                >
                  Your Wallet
                </Button>
              </Link>
              <Divider
                style={{
                  width: "100%",
                  marginTop: "auto",
                  marginBottom: "10%",
                }}
              />
              <Button
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  padding: 0,
                  color: "#00000090",
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
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  padding: 0,
                  color: "#00000090",
                  marginTop: "10px",
                  marginBottom: "20%",
                }}
                onClick={() => handleClickOpen()}
              >
                Deactivate Account
              </Button>
            </Box>
          ) : null}
          {!matches ? (
            <Drawer
              anchor={"left"}
              open={drawerOpen}
              style={{ width: "70%" }}
              PaperProps={{
                sx: {
                  width: "70%",
                },
              }}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                style={{
                  margin: "auto",
                  width: "80%",
                  height: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1.2rem",
                    marginTop: "10%",
                  }}
                >
                  My Account
                </Typography>
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginTop: "20%",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                >
                  {localStorage.getItem("user_name")}
                </Typography>
                <Typography
                  style={{
                    fontSize: "0.9rem",
                    color: "#00000090",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                >
                  {localStorage.getItem("user_email")}
                </Typography>
                <Typography
                  style={{
                    fontSize: "0.9rem",
                    color: "#00000090",
                    fontFamily: '"Open Sans", sans-serif',
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
                      marginTop: "10%",
                      fontSize: "0.8rem",
                      fontFamily: '"Open Sans", sans-serif',
                    }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    Edit Profile
                  </Button>
                </Link>
                <Divider
                  style={{
                    width: "100%",
                    marginTop: "10%",
                    marginBottom: "10%",
                  }}
                />
                <Link to={"/my-account/orders"}>
                  <Button
                    style={{
                      fontWeight: "bold",
                      color: "#a36e29",
                      padding: 0,
                      marginTop: "5%",
                      fontSize: "0.8rem",
                      fontFamily: '"Open Sans", sans-serif',
                    }}
                    onClick={() => setDrawerOpen(false)}
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
                      fontSize: "0.8rem",
                      fontFamily: '"Open Sans", sans-serif',
                    }}
                    onClick={() => setDrawerOpen(false)}
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
                      fontSize: "0.8rem",
                      fontFamily: '"Open Sans", sans-serif',
                    }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    Your Wallet
                  </Button>
                </Link>
                <Divider
                  style={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "10%",
                  }}
                />
                <Button
                  style={{
                    fontWeight: "bold",
                    color: "#00000090",
                    padding: 0,
                    fontWeight: "bold",
                    marginTop: "5%",
                    fontSize: "0.8rem",
                    fontFamily: '"Open Sans", sans-serif',
                    textAlign: "left",
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
                    fontWeight: "bold",
                    color: "#00000090",
                    padding: 0,
                    marginBottom: "10%",
                    fontWeight: "bold",
                    marginTop: "5%",
                    fontSize: "0.8rem",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                  onClick={() => handleClickOpen()}
                >
                  Deactivate Account
                </Button>
              </Box>
            </Drawer>
          ) : null}
        </Box>
        <Box
          style={{
            width: matches ? "70%" : "100%",
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
