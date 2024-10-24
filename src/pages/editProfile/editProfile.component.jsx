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
            fontFamily: '"Open Sans", sans-serif',
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
            fontFamily: '"Open Sans", sans-serif',
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
                  fontFamily: '"Open Sans", sans-serif',
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
                  fontFamily: '"Open Sans", sans-serif',
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
                  fontFamily: '"Open Sans", sans-serif',
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
                  fontFamily: '"Open Sans", sans-serif',
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
                  fontFamily: '"Open Sans", sans-serif',
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
              background: "#a36e29",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              textTransform: "none",
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
      }}
    >
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
              fontFamily: '"Open Sans", sans-serif',
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
              fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
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
                background: "#a36e29",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1rem",
                textTransform: "none",
              }}
              onClick={() => updateProfile()}
            >
              Save Changes
            </Button>
          </div>
        </Card>
      </Box>
      {!matches ? (
        <BottomNavigation
          showLabels
          style={{
            background: "rgba(163,110,41,0.08)",
            marginTop: "auto",
            border: "1px solid #a36e29",
            borderRadius: "50px",
            height: "40px",
          }}
        >
          <BottomNavigationAction
            label="Profile"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#a36e29",
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/my-account")}
          />
          <BottomNavigationAction
            label="Orders"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/orders")}
          />
          <BottomNavigationAction
            label="Address"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/address")}
          />
          <BottomNavigationAction
            label="Wallet"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/wallet")}
          />
        </BottomNavigation>
      ) : null}
    </div>
  );
};

export default EditProfile;
