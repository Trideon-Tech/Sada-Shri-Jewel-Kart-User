import CloseIcon from "@mui/icons-material/Close";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Typography from "@mui/joy/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

const AddressPanel = ({ selectedAddress, setSelectedAddress }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDD2ek0oaYCGCsN7T5MvyV8z-GSXpsLgfg",
    libraries: ["places"],
  });

  const [editing, setEditing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editAddress, setEditAddress] = useState({});

  const [add_line1, setAdd_line1] = useState("");
  const [add_line2, setAdd_line2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [refreshAddresses, setRefreshAddresses] = useState(1);
  const [addingNew, setAddingNew] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  const autocompleteRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        "https://api.sadashrijewelkart.com/v1.0.0/user/details.php?key=address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const addressList = response?.data?.response;
        setAddresses(addressList);
        console.log(addressList);
        if ((!selectedAddress || addingNew) && addressList?.length > 0) {
          setSelectedAddress(addressList[0]);
          window.location.reload();
        }
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, [refreshAddresses]);

  const handleEditCreateAddress = (editMode = false) => {
    if (editMode) {
      setEditAddress(selectedAddress);
    } else {
      setEditAddress({});
    }
    setEditing(true);
  };

  const addNewAddress = () => {
    const formData = new FormData();
    formData.append("key", "address");
    formData.append("name", `${firstName} ${lastName}`);
    formData.append("add_line_1", add_line1);
    formData.append("add_line_2", add_line2);
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
          setRefreshAddresses(refreshAddresses + 1);
          const addressUpdateEvent = new CustomEvent("addressesUpdated");
          window.dispatchEvent(addressUpdateEvent);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setAddingNew(false);
    setRefreshAddresses(refreshAddresses + 1);
  };

  const onLoad = (autocomplete) => {
    console.log("Autocomplete loaded:", autocomplete);
    setAutocomplete(autocomplete);
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;

    let streetNumber = "";
    let route = "";

    setAdd_line1(place.name);

    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          streetNumber = component.long_name;
          break;
        }
        case "route": {
          route = component.short_name;
          break;
        }
        case "postal_code": {
          setPincode(component.long_name);
          break;
        }
        case "locality": {
          setCity(component.long_name);
          break;
        }
        case "administrative_area_level_1": {
          setState(component.long_name);
          break;
        }
      }
    }

    // Combine street number and route for address line 2
    if (streetNumber && route) {
      setAdd_line2(`${streetNumber} ${route}`);
    } else if (route) {
      setAdd_line2(route);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      {!addresses ? null : (
        <Box>
          <Select
            placeholder="Select Address"
            defaultValue={selectedAddress}
            value={selectedAddress}
            slotProps={{
              listbox: {
                sx: {
                  "--ListItemDecorator-size": "100px",
                },
              },
            }}
            sx={{
              marginTop: "3%",
              minHeight: 50,
              boxShadow: "0 2px 3px 0px #666666",
              minWidth: 220,
              backgroundColor: "white",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
            onChange={(e, newValue) => {
              if (newValue) setSelectedAddress(newValue);
            }}
          >
            {addresses?.map((data, index) => (
              <Option key={data.id} value={data} label={data.add_line_1}>
                <Box component="span" sx={{ display: "block" }}>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {data.add_line_1}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    {data.add_line_2}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    {data.city}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >{`${data.state} - ${data.pincode}`}</Typography>
                </Box>
              </Option>
            ))}
          </Select>
          {addresses.length > 0 ? (
            <Card
              orientation="Verticle"
              size="sm"
              variant="soft"
              style={{
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0 0 3px 0 #555555",
                marginTop: "5%",
                marginBottom: "5%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {!editing ? (
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
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >{`${selectedAddress?.name}`}</Typography>
                    {/* <EditIcon
                      style={{
                        marginLeft: "auto",
                        cursor: "pointer",
                        fontSize: "1rem",
                        color: "#a36e29",
                      }}
                      onClick={() => handleEditCreateAddress(true)}
                    /> */}
                  </Box>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    {selectedAddress?.add_line_1}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    {selectedAddress?.add_line_2}
                  </Typography>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >{`${selectedAddress?.city} ,${selectedAddress?.state}`}</Typography>
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    Pincode : {`${selectedAddress?.pincode}`}
                  </Typography>

                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    Phone : {selectedAddress?.mobile}
                  </Typography>
                </>
              ) : (
                <Grid container spacing={3} style={{ marginTop: "2%" }}>
                  <Box
                    style={{
                      width: "100%",
                      height: "max-content",
                      display: "flex",
                      marginLeft: "30px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      style={{
                        fontWeight: "bold",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "1rem",
                      }}
                    >
                      Edit Address
                    </Typography>
                    <CloseIcon onClick={() => setEditing(false)} />
                  </Box>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      placeholder="First Name"
                      defaultValue={editAddress.name}
                      size="small"
                      variant="outlined"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      placeholder="Last Name"
                      id="standard-size-small"
                      defaultValue={editAddress.lastName}
                      size="small"
                      variant="outlined"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <TextField
                        sx={{
                          width: "100%",
                          height: "22px",
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
                        fullWidth
                        placeholder="Address Line 1"
                        value={add_line1}
                        size="small"
                        variant="outlined"
                        onChange={(e) => setAdd_line1(e.target.value)}
                        inputRef={autocompleteRef}
                      />
                    </Autocomplete>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      fullWidth
                      placeholder="Address Line 2"
                      value={add_line2}
                      size="small"
                      variant="outlined"
                      onChange={(e) => setAdd_line2(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      size="small"
                      variant="outlined"
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      value={state}
                      size="small"
                      variant="outlined"
                      onChange={(e) => setState(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      placeholder="Pincode"
                      value={pincode}
                      size="small"
                      variant="outlined"
                      onChange={(e) => {
                        if (e.target.value) setPincode(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{
                        width: "100%",
                        height: "22px",
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
                      placeholder="Mobile"
                      defaultValue={editAddress.mobile}
                      size="small"
                      variant="outlined"
                      onChange={(e) => {
                        if (e.target.value.length <= 10)
                          setMobile(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div
                      style={{
                        textAlign: "center",
                        background: "#a36e29",
                        color: "white",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={addNewAddress}
                    >
                      Save
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div
                      style={{
                        textAlign: "center",
                        border: "1px solid #a36e29",
                        color: "#a36e29",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </div>
                  </Grid>
                </Grid>
              )}
            </Card>
          ) : (
            <div></div>
          )}
        </Box>
      )}
      {addingNew ? (
        <Card
          orientation="Verticle"
          size="sm"
          variant="soft"
          style={{
            marginTop: "3%",
            padding: "30px",
            marginBottom: "5%",
            boxShadow: "0 0 3px 0 #555555",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
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
                fontSize: "1rem",
              }}
            >
              Add New Address
            </Typography>
            <CloseIcon
              style={{
                cursor: "pointer",
              }}
              onClick={() => setAddingNew(false)}
            />
          </Box>
          <Grid container spacing={3} style={{ marginTop: "1%" }}>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                variant="outlined"
                size="small"
                placeholder="First Name"
                defaultValue={editAddress.firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                placeholder="Last Name"
                defaultValue={editAddress.lastName}
                size="small"
                variant="outlined"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceSelect}
              >
                <TextField
                  sx={{
                    width: "100%",
                    height: "22px",
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
                  fullWidth
                  placeholder="Address Line 1"
                  value={add_line1}
                  size="small"
                  variant="outlined"
                  onChange={(e) => setAdd_line1(e.target.value)}
                />
              </Autocomplete>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                fullWidth
                placeholder="Address Line 2"
                value={add_line2}
                size="small"
                variant="outlined"
                onChange={(e) => setAdd_line2(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                size="small"
                variant="outlined"
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                value={state}
                size="small"
                variant="outlined"
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                placeholder="Pincode"
                value={pincode}
                size="small"
                variant="outlined"
                onChange={(e) => setPincode(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{
                  width: "100%",
                  height: "22px",
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
                defaultValue={editAddress.mobile}
                size="small"
                variant="outlined"
                onChange={(e) => setMobile(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="solid"
                size="md"
                sx={{
                  fontWeight: 600,
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  background: "#a36e29",
                }}
                onClick={addNewAddress}
                fullWidth
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Card>
      ) : (
        <Card
          variant="soft"
          style={{
            display: "flex",
            minHeight: 20,
            paddingLeft: "30px",
            paddingRight: "30px",
            marginTop: "3%",
            marginBottom: "5%",
            flexDirection: "row",
            boxShadow: "0 0 3px 0 #555555",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            Add New Address
          </Typography>
          <ControlPointIcon
            onClick={() => setAddingNew(true)}
            style={{
              fontSize: "1.2rem",
              marginLeft: "auto",
              color: "#A36E29",
              cursor: "pointer",
            }}
          />
        </Card>
      )}
    </Box>
  );
};

export default AddressPanel;
