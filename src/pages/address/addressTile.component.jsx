import * as React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Paper from "@mui/material/Paper";
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
      elevation={3}
      style={{
        width: "96%",
        height: isEditing ? "80%" : "40%",
        minWidth: matches ? "830px" : "300px",
        minHeight: "200px",
        backgroundColor: "white",
        boxShadow: "0 0 3px 0 #555555",
        marginTop: "2%",
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
              marginBottom: "2%",
            }}
          >
            <Typography
              level="body-lg"
              style={{ fontWeight: "bold", fontSize: "1.3rem" }}
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
            style={{ fontWeight: 600, color: "#00000060" }}
            level="body-lg"
          >
            {address?.add_line_1}
          </Typography>
          <Typography
            style={{ fontWeight: 600, color: "#00000060" }}
            level="body-lg"
          >
            {address?.add_line_2}{" "}
            {`${address?.add_line_2} - ${address?.city} ,${address?.state}`}
          </Typography>
          <Typography level="body-lg">
            Pincode : {`${address?.pincode}`}
          </Typography>

          <Typography level="body-lg"> Phone : {address?.mobile}</Typography>
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
            <Typography style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              Edit Address
            </Typography>
            <CloseIcon onClick={() => setIsEditing(false)} />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address Line 1"
                value={add_line_1}
                fullWidth
                onChange={(e) => setAdd_line1(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Address Line 2"
                value={add_line_2}
                fullWidth
                onChange={(e) => setAdd_line2(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                value={city}
                fullWidth
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="State"
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                fullWidth
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={pincode}
                label="Pincode"
                fullWidth
                onChange={(e) => setPincode(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                size="lg"
                variant="outlined"
                fullWidth
                style={{ border: "3px solid #A36E29", color: "#A36E29" }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button size="lg" fullWidth style={{ background: "#A36E29" }}>
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
