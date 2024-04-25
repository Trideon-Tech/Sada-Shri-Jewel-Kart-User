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
import { Box, Divider } from "@mui/material";
import OrderItem from "./orderItem.component";

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

function OrderDetails() {
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
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#F0F0F0" }}
    >
      <Navbar />
      <Box
        style={{
          backgroundColor: "#F0F0F0",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Box
          style={{
            width: "80%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Box style={{ width: "90%", height: "max-content" }}>
            <Typography
              variant="h4"
              style={{
                color: "#a36e29",
                fontWeight: "bold",
                textAlign: "left",
                marginBottom: "1%",
              }}
            >
              {" "}
              Order Details
            </Typography>
            <Divider />
            <Typography
              variant="h6"
              style={{ textAlign: "left", marginTop: "2%" }}
            >
              Item(s) Ordered
            </Typography>
            <Box
              style={{
                marginTop: "1%",
                width: "100%",
                minHeight: "10%",
                height: "max-content",
                borderRadius: "30px",
                paddingBottom: "5%",
                height: "max-content",
                backgroundColor: "#F0F0F0",
              }}
            >
              {" "}
              {[1, 2, 3].map((item) => (
                <OrderItem />
              ))}
              <Box
                style={{
                  width: "40%",
                  marginLeft: "auto",
                  marginTop: "1%",
                  marginBottom: "5%",
                  height: "50%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  style={{
                    width: "50%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justicyContent: "space-evenly",
                    textAlign: "left",
                  }}
                >
                  <Typography variant="h5">Product Total</Typography>
                  <Typography variant="h5">Shipping Charges</Typography>
                </Box>
                <Box
                  style={{
                    width: "50%",
                    height: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "right",
                    paddingRight: "7%",
                  }}
                >
                  <Typography variant="h5">$75,000</Typography>
                  <Typography variant="h5">Free</Typography>
                </Box>
                <Divider />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default OrderDetails;
