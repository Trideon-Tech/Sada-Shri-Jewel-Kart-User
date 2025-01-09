import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { generalToastStyle } from "../../utils/toast.styles";

const EditProfile = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name")?.split(" ") || ["", ""];
  const [firstName, setFirstName] = useState(userName[0]);
  const [lastName, setLastName] = useState(userName[1]);
  const [mobile, setMobile] = useState(localStorage.getItem("mobile"));
  const [email, setEmail] = useState(localStorage.getItem("user_email"));
  const [pincode, setPincode] = useState(
    localStorage.getItem("default_pincode")
  );

  const matches = useMediaQuery("(min-width:600px)");

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("type", "update");

    // Only append fields that have changed
    if (firstName !== userName[0] || lastName !== userName[1]) {
      formData.append("name", `${firstName} ${lastName}`);
    }
    if (email !== localStorage.getItem("user_email")) {
      formData.append("email", email);
    }
    if (mobile !== localStorage.getItem("mobile")) {
      formData.append(
        "mobile",
        mobile.length === 12
          ? mobile.slice(2)
          : mobile.length === 10
          ? mobile
          : ""
      );
    }

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
        // Get updated user profile
        axios
          .get(
            `https://api.sadashrijewelkart.com/v1.0.0/user/userProfile.php?type=getUserProfile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(async (profileResponse) => {
            const userData = profileResponse.data.response.user[0];
            localStorage.setItem("user_name", userData.name);
            localStorage.setItem("user_email", userData.email);
            localStorage.setItem("mobile", userData.mobile);
            toast.success("Successfully saved in profile!", generalToastStyle);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            window.location.reload();
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return matches ? (
    <Box
      style={{
        width: "100%",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <ToastContainer />
      <Box
        style={{
          width: "70%",
          margin: "auto",
          marginTop: "50px",
          textAlign: "left",
        }}
      >
        <Typography
          style={{
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Edit Profile
        </Typography>
      </Box>
      <Card
        style={{
          margin: "auto",
          marginTop: matches ? "50px" : "30px",
          marginBottom: "20px",
          width: matches ? "70%" : "80%",
          paddingBottom: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "20px",
        }}
        elevation={1}
      >
        <Avatar
          sx={{
            width: "100px",
            height: "100px",
            fontSize: "2.7rem",
            background: "#a36e29",
            fontFamily: '"Roboto", sans-serif',
          }}
        >
          {firstName.charAt(0)}
        </Avatar>
        <Grid
          container
          spacing={2}
          rowSpacing={3}
          style={{
            marginTop: "30px",
            width: "80%",
          }}
        >
          <Grid item xs={6}>
            <TextField
              sx={{
                width: "100%",
                height: "35px",
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
              value={firstName}
              placeholder="First Name"
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              sx={{
                width: "100%",
                height: "35px",
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
              value={lastName}
              placeholder="Last Name"
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{
                width: "100%",
                height: "35px",
                marginTop: "10px",
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
              value={email}
              placeholder="Enter Email Id"
              fullWidth
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{
                width: "100%",
                height: "35px",
                marginTop: "10px",
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
              value={mobile}
              placeholder="Phone*"
              fullWidth
              onChange={(event) => {
                if (Number.isInteger(Number(event.target.value)))
                  if (event.target.value.length <= 12)
                    setMobile(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{
                width: "100%",
                height: "35px",
                marginTop: "10px",
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
              value={pincode}
              placeholder="Default Pincode*"
              fullWidth
              onChange={(event) => {
                setPincode(event.target.value);
                localStorage.setItem("default_pincode", event.target.value);
              }}
            />
          </Grid>
        </Grid>
        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "end",
            marginTop: "30px",
            marginRight: "10px",
          }}
        >
          <Button
            size="medium"
            variant="contained"
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
              textTransform: "none",
              background:
                "linear-gradient(to right, #d4a76a, #a36e29)",
            }}
            onClick={() => updateProfile()}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </Box>
  ) : (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "calc(20px + 4vh)",
        position: "relative",
      }}
    >
      <ToastContainer />
      {!matches ? (
        <BottomNavigation
          showLabels
          style={{
            background: "rgba(163,110,41)",
            border: "1px solid #a36e29",
            borderRadius: "50px",
            height: "40px",
            width: "90%",
            position: "fixed",
            bottom: 20,
            zIndex: 1000,
          }}
        >
          <BottomNavigationAction
            label="Profile"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "white",
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/my-account")}
          />
          <BottomNavigationAction
            label="Orders"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/orders")}
          />
          <BottomNavigationAction
            label="Address"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/address")}
          />
          <BottomNavigationAction
            label="Wallet"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/wallet")}
          />
        </BottomNavigation>
      ) : null}

      <Box
        style={{
          width: "100%",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginBottom: !matches ? "80px" : "0", // Added margin bottom for mobile
        }}
      >
        <Box
          style={{
            width: "70%",
            margin: "auto",
            marginTop: matches ? "20px" : "50px",
            textAlign: "left",
          }}
        >
          <Typography
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Edit Profile
          </Typography>
        </Box>
        <Card
          style={{
            margin: "auto",
            marginTop: matches ? "50px" : "10px",
            marginBottom: "20px",
            width: matches ? "70%" : "80%",
            paddingBottom: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: "20px",
          }}
          elevation={1}
        >
          <Avatar
            sx={{
              width: "100px",
              height: "100px",
              fontSize: "2.7rem",
              background: "#a36e29",
              fontFamily: '"Roboto", sans-serif',
            }}
          >
            {firstName.charAt(0)}
          </Avatar>
          <Grid
            container
            spacing={2}
            rowSpacing={3}
            style={{
              marginTop: "10px",
              width: "80%",
            }}
          >
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "30px",
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
                value={firstName}
                placeholder="First Name"
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "30px",
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
                value={lastName}
                placeholder="Last Name"
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                  height: "30px",
                  marginTop: "10px",
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
                value={email}
                placeholder="Enter Email Id"
                fullWidth
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                  height: "30px",
                  marginTop: "10px",
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
                value={mobile}
                placeholder="Phone*"
                fullWidth
                onChange={(event) => {
                  if (Number.isInteger(Number(event.target.value)))
                    if (event.target.value.length <= 12)
                      setMobile(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                  height: "30px",
                  marginTop: "10px",
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
                value={pincode}
                placeholder="Default Pincode*"
                fullWidth
                onChange={(event) => {
                  setPincode(event.target.value);
                  localStorage.setItem("default_pincode", event.target.value);
                }}
              />
            </Grid>
          </Grid>
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "end",
              marginTop: "30px",
              marginRight: "10px",
            }}
          >
            <Button
              size="medium"
              variant="contained"
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1rem",
                textTransform: "none",
                background:
                  "linear-gradient(to right, #d4a76a, #a36e29)",
              }}
              onClick={() => updateProfile()}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </Box>
    </div>
  );
};

export default EditProfile;
