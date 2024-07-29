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
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

const AddressPanel = ({ selectedAddress, setSelectedAddress }) => {
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
        console.log("SA", selectedAddress);
        if (!selectedAddress) setSelectedAddress(response.data.response[0]);
        setAddresses(response.data.response);
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
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setAddingNew(false);
    setRefreshAddresses(refreshAddresses + 1);
  };
  return (
    <Box>
      {!addresses ? null : (
        <Box>
          <Select
            defaultValue={selectedAddress}
            value={selectedAddress.add_line1}
            slotProps={{
              listbox: {
                sx: {
                  "--ListItemDecorator-size": "100px",
                },
              },
            }}
            sx={{
              marginTop: "3%",
              minHeight: 60,
              boxShadow: "0 2px 3px 0px #666666",
              minWidth: 240,
            }}
            onChange={(e, newValue) => {
              if (newValue) setSelectedAddress(newValue);
            }}
          >
            {addresses?.map((data, index) => (
              <Option
                style={{ height: "100px" }}
                key={data.id}
                value={data}
                label={data.add_line_1}
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
              padding: "30px",
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
                    level="body-lg"
                    style={{ fontWeight: "bold" }}
                  >{`${selectedAddress?.name}`}</Typography>
                  <EditIcon
                    style={{ marginLeft: "auto", marginRight: "2%" }}
                    onClick={() => handleEditCreateAddress(true)}
                  />
                  <CloseIcon />
                </Box>
                <Typography level="body-lg">
                  {selectedAddress?.add_line_1}
                </Typography>
                <Typography level="body-lg">
                  {selectedAddress?.add_line_2}
                </Typography>
                <Typography level="body-lg">{`${selectedAddress?.city} ,${selectedAddress?.state}`}</Typography>
                <Typography level="body-lg">
                  Pincode : {`${selectedAddress?.pincode}`}
                </Typography>

                <Typography level="body-lg">
                  {" "}
                  Phone :{selectedAddress?.mobile}
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
                  <Typography variant="body" style={{ fontWeight: "bold" }}>
                    Edit Address
                  </Typography>
                  <CloseIcon onClick={() => setEditing(false)} />
                </Box>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    id="standard-size-small"
                    defaultValue={editAddress.name}
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
                    style={{ width: "100%" }}
                    label="Address Line 1"
                    id="standard-size-small"
                    defaultValue={editAddress.add_line_1}
                    size="large"
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
                    onChange={(e) => setCity(e.target.value)}
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
                    defaultValue={editAddress.pincode}
                    size="large"
                    variant="outlined"
                    onChange={(e) => {
                      if (e.target.value) setPincode(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    id="standard-size-small"
                    defaultValue={editAddress.mobile}
                    size="large"
                    variant="outlined"
                    onChange={(e) => {
                      if (e.target.value.length <= 10)
                        setMobile(e.target.value);
                    }}
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
              height: "max-content",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body" style={{ fontWeight: "bold" }}>
              Add New Address
            </Typography>
            <CloseIcon onClick={() => setAddingNew(false)} />
          </Box>
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
                onChange={(e) => setCity(e.target.value)}
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
            <Grid item xs={12}>
              <Button
                variant="solid"
                size="md"
                sx={{
                  fontWeight: 600,
                  minHeight: 50,
                  background:
                    "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
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
            minHeight: 30,
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
          <Typography variant="body" style={{ fontWeight: "bold" }}>
            Add New Address
          </Typography>
          <ControlPointIcon
            onClick={() => setAddingNew(true)}
            style={{ fontSize: "1.7rem", marginLeft: "auto", color: "#A36E29" }}
          />
        </Card>
      )}
    </Box>
  );
};

export default AddressPanel;
