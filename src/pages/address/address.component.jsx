import * as React from "react";
import { Box, Typography } from "@mui/material";
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
import AddressTile from "./addressTile.component";
import AddressNew from "./addressNew.component";

const Address = () => {
  return (
    <Box
      style={{
        width: "78%",
        padding: "1%",
        paddingRight: "14%",
        height: "100%",
        overflowY: "scroll",
        display: "flex",
        marginLeft: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Typography
        style={{ marginTop: "2.5%", fontSize: "2rem", fontWeight: "bold" }}
      >
        Saved Addresses
      </Typography>
      <Box
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginTop: "50px",
          flexDirection: "column",
        }}
      >
        <AddressNew address={{}} />
      </Box>
      <Box
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginTop: "50px",
          flexDirection: "column",
        }}
      >
        <AddressTile address={{}} />
        <AddressTile address={{}} />
        <AddressTile address={{}} />
      </Box>
    </Box>
  );
};

export default Address;
