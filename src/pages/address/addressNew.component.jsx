import CloseIcon from "@mui/icons-material/Close";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

const AddressNew = ({ refreshAddress, setRefreshAddress }) => {
  const matches = useMediaQuery("(min-width:600px)");

  const [isEditing, setIsEditing] = useState(false);
  const [add_line_1, setAdd_line1] = useState("");
  const [add_line_2, setAdd_line2] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const autocompleteRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDD2ek0oaYCGCsN7T5MvyV8z-GSXpsLgfg&libraries=places`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setAdd_line1(place.name);

      for (const component of place.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
          case "street_number":
            setAdd_line2((prev) => component.long_name + " " + prev);
            break;
          case "route":
            setAdd_line2((prev) => prev + component.short_name);
            break;
          case "postal_code":
            setPincode(component.long_name);
            break;
          case "locality":
            setCity(component.long_name);
            break;
          case "administrative_area_level_1":
            setState(component.long_name);
            break;
        }
      }
    }
  };

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
      .post(`${process.env.REACT_APP_API_URL}/v1.0.0/user/add.php`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success === 1) {
          console.log("address Added successfully");
          setRefreshAddress(refreshAddress + 1);
          setIsEditing(false);
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
        width: matches ? "95%" : "90%",
        height: isEditing ? "90%" : "25%",
        minWidth: matches ? "700px" : "250px",
        minHeight: "10px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-evenly",
      }}
    >
      {!isEditing ? (
        <Box
          style={{
            width: "100%",
            height: "22px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
              color: "#00000060",
            }}
          >
            Add New Address
          </Typography>
          <ControlPointIcon
            onClick={() => setIsEditing(true)}
            style={{ fontSize: "1.2rem", marginLeft: "auto", color: "#A36E29" }}
          />
        </Box>
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
                fontWeight: 600,
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
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
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
                  onChange={(e) => setAdd_line1(e.target.value)}
                  inputRef={autocompleteRef}
                />
              </Autocomplete>
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
                onChange={(e) => setPincode(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                style={{
                  border: "2px solid #A36E29",
                  color: "#A36E29",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1rem",
                  marginTop: "20px",
                  height: "50px",
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={() => addNewAddress()}
                fullWidth
                style={{
                  border: "2px solid #A36E29",
                  color: "white",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1rem",
                  marginTop: "20px",
                  height: "50px",
                  backgroundColor: "#A36E29",
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

export default AddressNew;
