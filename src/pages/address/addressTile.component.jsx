import { Delete } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import { Box, Modal, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { generalToastStyle } from "../../utils/toast.styles";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteAddress = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`https://api.sadashrijewelkart.com/v1.0.0/user/add.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          key: "address",
          address_id: address.id,
        },
      })
      .then((response) => {
        console.log("Address deleted successfully");
        toast.success("Address deleted successfully", generalToastStyle);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log("Error deleting address:", error);
      });
  };

  return (
    <Card
      elevation={1}
      style={{
        width: matches ? "96%" : "90%",
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
      <ToastContainer />
      {showDeleteDialog && (
        <Modal
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "10px",
              width: 250,
              backgroundColor: "white",
              p: 4,
            }}
          >
            <Typography
              style={{
                fontWeight: 700,
                marginBottom: "20px",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              Are you sure you want to delete this address?
            </Typography>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
              }}
            >
              <Button
                variant="outlined"
                style={{
                  width: "48%",
                  fontWeight: "bold",
                  border: "2px solid #a36e29",
                  color: "#a36e29",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                }}
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{
                  width: "48%",
                  fontWeight: "bold",
                  background: "#a36e29",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                }}
                onClick={() => {
                  deleteAddress();
                  setShowDeleteDialog(false);
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
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
                fontFamily: '"Roboto", sans-serif',
                fontSize: matches ? "1.2rem" : "1rem",
              }}
            >
              {`${address?.name}`}
            </Typography>

            <Delete onClick={() => setShowDeleteDialog(true)} />
          </Box>
          <Typography
            style={{
              fontWeight: 600,
              color: "#00000060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: matches ? "1rem" : "0.8rem",
            }}
          >
            {address?.add_line_1}
          </Typography>
          <Typography
            style={{
              fontWeight: 600,
              color: "#00000060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: matches ? "1rem" : "0.8rem",
            }}
          >
            {address?.add_line_2}{" "}
            {`${address?.add_line_2} - ${address?.city} ,${address?.state}`}
          </Typography>
          <Typography
            style={{
              fontWeight: 600,
              color: "#00000060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: matches ? "1rem" : "0.8rem",
            }}
          >
            Pincode : {`${address?.pincode}`}
          </Typography>

          <Typography
            style={{
              fontWeight: 600,
              color: "#00000060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: matches ? "1rem" : "0.8rem",
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
                fontFamily: '"Roboto", sans-serif',
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
                  fontFamily: '"Roboto", sans-serif',
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
                  fontFamily: '"Roboto", sans-serif',
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
