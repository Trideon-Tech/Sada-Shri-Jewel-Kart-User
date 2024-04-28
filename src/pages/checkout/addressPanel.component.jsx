import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import FormLabel from "@mui/joy/FormLabel";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Divider from "@mui/material/Divider";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Chip from "@mui/joy/Chip";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import StepButton from "@mui/joy/StepButton";
import StepIndicator from "@mui/joy/StepIndicator";
import Check from "@mui/icons-material/Check";
import Input from "@mui/joy/Input";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";

const AddressPanel = () => {
  const [editing, setEditing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
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

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        "https://api.sadashrijewelkart.com//v1.0.0/user/details.php?key=address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setSelectedAddress(response.data.response[0]);
        setAddresses(response.data.response);
      })
      .catch((error) => console.log("Error while fetching card items", error));
  }, [refreshAddresses]);

  const handleEditCreateAddress = (editMode = false) => {
    if (editMode) {
      setEditAddress(selectedAddress);
    } else {
      setEditAddress({});
    }
    setEditing(true);
  };

  const addNewAddress = (editMode = false) => {
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
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setEditing(false);
  };
  return (
    <Box>
      {!addresses ? (
        <Box>
          <Box>
            <Card
              orientation="Verticle"
              size="sm"
              variant="soft"
              style={{
                border: "2px solid #a36e29",
                marginTop: "3%",
                marginBottom: "5%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Grid container spacing={3} style={{ marginTop: "2%" }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    id="standard-size-small"
                    defaultValue={editAddress.firstName}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    id="standard-size-small"
                    defaultValue={editAddress.lastName}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    id="standard-size-small"
                    defaultValue={editAddress.addressLine1}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setAdd_line1(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    id="standard-size-small"
                    defaultValue={editAddress.addressLine2}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setAdd_line2(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    id="standard-size-small"
                    defaultValue={editAddress.city}
                    size="large"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="State"
                    id="standard-size-small"
                    defaultValue={editAddress.state}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setState(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    id="standard-size-small"
                    defaultValue={editAddress.pin}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    id="standard-size-small"
                    defaultValue={editAddress.mobile}
                    size="large"
                    variant="outlined"
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="solid"
                    size="md"
                    sx={{
                      marginLeft: "20%",
                      fontWeight: 600,
                      backgroundColor: "#a36e29",
                    }}
                    onClick={addNewAddress}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    size="md"
                    sx={{
                      marginRight: "20%",
                      fontWeight: 600,
                      color: "#a36e29",
                    }}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Box>
      ) : (
        <Box>
          <Select
            defaultValue={addresses[0]}
            slotProps={{
              listbox: {
                sx: {
                  "--ListItemDecorator-size": "100px",
                },
              },
            }}
            sx={{
              marginTop: "3%",
              minWidth: 240,
            }}
            onChange={(event, newValue) => {
              console.log(event);
              console.log(newValue);
              setSelectedAddress(newValue);
            }}
          >
            {addresses?.map((data, index) => (
              <Option
                style={{ height: "100px" }}
                key={data.id}
                value={data}
                label={data.addressLine1}
              >
                <Box component="span" sx={{ display: "block" }}>
                  <Typography component="span" level="title-sm">
                    {data.add_line_1}
                  </Typography>
                  <Typography level="body-xs">{data.add_line_2}</Typography>
                  <Typography level="subtitle">{data.city}</Typography>
                  <Typography level="subtitle">{`${data.state} - ${data.pincode}`}</Typography>
                </Box>
              </Option>
            ))}
          </Select>
          <Card
            orientation="Verticle"
            size="sm"
            variant="soft"
            style={{
              border: "2px solid #a36e29",
              marginTop: "3%",
              marginBottom: "5%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {!editing ? (
              <>
                <Typography level="body-lg">{`${selectedAddress?.state} ${selectedAddress?.pincode}`}</Typography>
                <Typography level="title-lg">
                  {selectedAddress?.add_line_1}
                </Typography>
                <Typography level="title-lg">
                  {selectedAddress?.add_line_2}
                </Typography>
                <Typography level="body-sm">{selectedAddress?.city}</Typography>
                <Typography level="body-md">
                  {selectedAddress?.mobile}
                </Typography>
                <Typography level="body-md">{`${selectedAddress?.name}`}</Typography>
                <Box
                  style={{
                    width: "100%",
                    height: "5%",
                    display: "flex",

                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="solid"
                    size="md"
                    color="primary"
                    sx={{
                      marginLeft: "20%",
                      fontWeight: 600,
                      backgroundColor: "#a36e29",
                    }}
                    onClick={() => handleEditCreateAddress(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="md"
                    color="primary"
                    aria-label="Explore Bahamas Islands"
                    sx={{
                      marginRight: "20%",
                      fontWeight: 600,
                      color: "#a36e29",
                    }}
                    onClick={() => handleEditCreateAddress(false)}
                  >
                    Add Address
                  </Button>
                </Box>
              </>
            ) : (
              <Grid container spacing={3} style={{ marginTop: "2%" }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    id="standard-size-small"
                    defaultValue={editAddress.name}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    id="standard-size-small"
                    defaultValue={editAddress.lastName}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    style={{ width: "100%" }}
                    label="Address Line 1"
                    id="standard-size-small"
                    defaultValue={editAddress.add_line_1}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setAdd_line1(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    style={{ width: "100%" }}
                    label="Address Line 2"
                    id="standard-size-small"
                    defaultValue={editAddress.add_line_2}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setAdd_line2(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    id="standard-size-small"
                    defaultValue={editAddress.city}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="State"
                    id="standard-size-small"
                    defaultValue={editAddress.state}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setState(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    id="standard-size-small"
                    defaultValue={editAddress.pincode}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    id="standard-size-small"
                    defaultValue={editAddress.mobile}
                    size="small"
                    variant="outlined"
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="solid"
                    size="md"
                    sx={{
                      marginLeft: "20%",
                      fontWeight: 600,
                      backgroundColor: "#a36e29",
                    }}
                    onClick={addNewAddress}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    size="md"
                    sx={{
                      marginRight: "20%",
                      fontWeight: 600,
                      color: "#a36e29",
                    }}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            )}
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AddressPanel;
