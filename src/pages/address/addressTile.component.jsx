import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
const AddressTile = ({ address }) => {
  const matches = useMediaQuery("(min-width:600px)");

  const [isEditing, setIsEditing] = useState(false);
  const [add_line_1, setAdd_line1] = useState(address.add_line_1);
  const [add_line_2, setAdd_line2] = useState(address.add_line_2);
  const [name, setName] = useState(address.name);
  const [city, setCity] = useState(address.city);
  const [state, setState] = useState(address.state);
  const [pincode, setPincode] = useState(address.pincode);
  const [mobile, setMobile] = useState(address.mobile);
  const addNewAddress = () => {
    const formData = new FormData();
    formData.append("key", "address");
    formData.append("name", name);
    formData.append("add_line_1", add_line_1);
    formData.append("add_line_2", add_line_2);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("pincode", pincode);
    formData.append("mobile", mobile);

    const token = localStorage.getItem("token");
    axios
      .post("https://api.sadashrijewelkart.com/v1.0.0/user/add.php", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success === 1) {
          console.log("address Added successfully");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <Card
      elevation={1}
      style={{
        width: "96%",
        height: isEditing ? "80%" : "40%",
        minWidth: matches ? "830px" : "300px",
        minHeight: "200px",
        backgroundColor: "white",
        marginBottom: "3%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {!isEditing ? (
        <>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontWeight: "bold",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1.2rem",
              }}
            >
              {`${address?.name}`}
            </Typography>

            <EditIcon
              style={{ marginLeft: "auto", marginRight: "2%" }}
              onClick={() => setIsEditing(true)}
            />
            <CloseIcon />
          </Box>
          <Typography
            style={{
              fontWeight: 600,
              color: "#00000060",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
            }}
          >
            {address?.add_line_1}
          </Typography>
          <Typography
            style={{
              fontWeight: 600,
              color: "#00000060",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
            }}
          >
            {address?.add_line_2}{" "}
            {`${address?.add_line_2} - ${address?.city} ,${address?.state}`}
          </Typography>
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
            }}
          >
            Pincode : {`${address?.pincode}`}
          </Typography>

          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
            }}
          >
            Phone : {address?.mobile}
          </Typography>
        </>
      ) : (
        <Box style={{ width: "100%" }}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2%",
            }}
          >
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Edit Address
            </Typography>
            <CloseIcon onClick={() => setIsEditing(false)} />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="Address Line 1"
                value={add_line_1}
                fullWidth
                onChange={(e) => setAdd_line1(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="Address Line 2"
                value={add_line_2}
                fullWidth
                onChange={(e) => setAdd_line2(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="City"
                value={city}
                fullWidth
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="State"
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="Phone"
                fullWidth
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "20px",
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
                placeholder="Pincode"
                fullWidth
                onChange={(e) => setPincode(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                style={{
                  border: "1px solid #A36E29",
                  color: "#A36E29",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                  marginTop: "20px",
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                style={{
                  background: "#A36E29",
                  border: "1px solid #A36E29",
                  color: "white",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                  marginTop: "20px",
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Card>
  );
};

export default AddressTile;
