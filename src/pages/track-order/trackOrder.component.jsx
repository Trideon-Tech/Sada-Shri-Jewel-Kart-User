import React, { useState, useEffect } from "react";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery"; // For responsive layout
import { useTheme } from "@mui/material/styles";
import Navbar from "../../components/navbar/navbar.component";
import AddressCard from "./address.component";
// Assuming you have order data fetched from an API or stored locally
const order = {
  steps: [
    { label: "Ordered" },
    { label: "Dispached" },
    { label: "Shipped" },
    { label: "Delivered" },
  ],
  id: 1,
  imageUrl: "https://picsum.photos/200", // Replace with your image URL
  name: "Diamond Ring",
  arrivalDate: "2024-04-20",
  status: "Shipped",
  deliveryAddress: {
    name: "Shipping Address",
    addressLine1: "3rd Main Street",
    addressLine2: "4th Cross Road",
    addressLine2: "Neeladri Nagar, Electronic City",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560100",
  },
  BillingAddress: {
    name: "Billing Address",
    addressLine1: "3rd Main Street",
    addressLine2: "4th Cross Road",
    addressLine2: "Neeladri Nagar, Electronic City",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560100",
  },
};
// ... same order data structure as before

const useStyles = (theme) => ({
  container: {
    marginTop: "5%",
    display: "flex",
    flexDirection: "column",
    width: "70%",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: "100vh", // Set minimum height for full viewport
  },
  card: {
    width: "40%",
    heigth: "30%",
    backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    justicyContent: "space-around",
    alignItems: "center",
    maxWidth: "600px", // Set maximum width for larger screens
    margin: theme.spacing(2),
  },
  stepLabel: {
    color: "#a36e29", // Customize step label color
  },
  completedStep: {
    color: "#a36e29", // Customize completed step color
  },
  mobileCard: {
    width: "100%", // Adjust width for mobile devices
  },
  "@media (max-width: 600px)": {
    // Media query for mobile responsiveness
    ".card": {
      margin: 0, // Remove margin on small screens
    },
  },
});

function TrackOrder() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [activeStep, setActiveStep] = useState(
    order.steps.findIndex((step) => step.label === order.status)
  );
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    // Simulate data fetching (replace with your actual API call)
    // ...
  }, []);

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          marginBottom: "5%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          variant={"h4"}
          style={{
            marginTop: "2%",
            marginBottom: "2%",
            fontWeight: "bold",
            color: "#707070",
          }}
        >
          Track Package
        </Typography>
        <img src="https://picsum.photos/200" />
        <Stepper
          style={{ marginTop: "5%" }}
          activeStep={activeStep}
          alternativeLabel
        >
          {order.steps.map((step) => (
            <Step key={step.label}>
              <StepLabel style={{ color: "#a36e29" }}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Card
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "70vw",
            height: "30vh",
            marginTop: "2%",
          }}
          elevation={5}
        >
          <cardContent
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <AddressCard address={order.BillingAddress} />
            <AddressCard address={order.deliveryAddress} />
          </cardContent>
        </Card>
        {/* Add a button for contacting customer service or other actions if needed */}
      </div>
    </div>
  );
}

export default TrackOrder;
