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
import AddressPanel from "./addressPanel.component";
import CheckoutProgressBar from "../../components/checkoutProgress/checkoutProgress.component";

const steps = ["Login", "Shipping", "Payment"];

const addresses = [
  {
    id: 1,
    firstName: "Eric",
    lastName: "Joon",
    addressLine1: "3rd Cross Street, 4th Main Road",
    addressLine2: "Neeladri Nagar, Electronic City",
    pin: 560100,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
  {
    id: 2,
    firstName: "Ken",
    lastName: "Miles",
    addressLine1: "HustleHub 1901, 19th Main Street",
    addressLine2: "Near HSR BDA Complex",
    pin: 560098,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
  {
    id: 3,
    firstName: "lara",
    lastName: "Croft",
    addressLine1: "16rd Cross Street, 4th Main Road",
    addressLine2: "Neeladri Nagar, Electronic City",
    pin: 560100,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
  {
    id: 4,
    firstName: "Captain",
    lastName: "Price",
    addressLine1: "14rd Cross Street, 4th Main Road",
    addressLine2: "Gotigere Nagar, Electronic City",
    pin: 560100,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
];
const CheckoutForm = ({ cartItems }) => {
  const [editing, setEditing] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState(
    addresses[0] || {}
  );
  const [activeStep, setActiveStep] = React.useState(1);
  const addNewAddress = () => {
    setSelectedAddress({
      id: 0,
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      pin: 0,
      city: "",
      state: "",
      mobile: 0,
    });
    setEditing(true);
  };

  const createOrderHandler = () => {
    const formData = new FormData();
    formData.append("type", "order_request");
    formData.append("currency", `INR`);
    formData.append("receipt", "22344$");
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("user_address_id", selectedAddress.id);
    formData.append("payment_status", "pending");
    const orderList = cartItems.map((item) => {
      return {
        product_id: item.id,
        customization_id: -1,
        quantity: 1,
      };
    });
    console.log(JSON.stringify(orderList));
    formData.append("ordered_products", JSON.stringify(orderList));

    const token = localStorage.getItem("token");
    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/payment.php",
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
        console.log("order created", response);
        if (response.data.success === 1) {
          console.log("address Added successfully");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box
      elevation={3}
      style={{
        backgroundColor: "white",
        width: "100%",
        height: "max-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box style={{ width: "60%", marginTop: "5%", height: "max-content" }}>
        <CheckoutProgressBar activeStep={activeStep} />
      </Box>
      <Box
        style={{
          width: "60%",
          marginTop: "5%",
          height: "max-content",
          marginBottom: "5%",
        }}
      >
        <Typography
          variant="h5"
          style={{
            fontSize: "1.5rem",
            color: "#505050",
            fontWeight: "bold",
            marginTop: "5%",
            marginBottom: "3%",
          }}
        >
          Shipping Address
        </Typography>

        <AddressPanel
          selectedAddress={setSelectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
        <Button
          style={{ backgroundColor: "#a36e29" }}
          onClick={createOrderHandler}
        >
          Proceed
        </Button>
      </Box>
    </Box>
  );
};
export default CheckoutForm;
