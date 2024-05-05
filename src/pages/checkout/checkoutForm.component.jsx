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
import PaymentMethod from "./paymentMethod.component";

const steps = ["Login", "Shipping", "Payment"];

const SelectAddressStep = ({
  setActiveStep,
  activeStep,
  selectedAddress,
  setSelectedAddress,
  createOrderHandler,
}) => {
  const handleCreateOrder = async () => {
    await createOrderHandler();
    console.log("order created");
    setActiveStep(activeStep + 1);
  };
  return (
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
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
      <Button
        fullWidth
        style={{
          minHeight: 50,
          background:
            "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
        }}
        onClick={handleCreateOrder}
      >
        Proceed
      </Button>
    </Box>
  );
};

const SelectPaymentMethodStep = ({
  setActiveStep,
  activeStep,
  selectedAddress,
  setSelectedAddress,
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
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
        Select Payment Method
      </Typography>

      <PaymentMethod
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      <Box
        style={{
          width: "100%",
          height: "max-content",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          style={{
            color: "black",
            width: "47%",
            minHeight: 50,
            border: "2px solid rgba(163,110,41,1)",
          }}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        <Button
          fullWidth
          style={{
            width: "47%",
            minHeight: 50,
            background:
              "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
          }}
        >
          Pay
        </Button>
      </Box>
    </Box>
  );
};

const CheckoutForm = ({ cartItems }) => {
  const [editing, setEditing] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState({});
  const [paymentMethod, setPaymentMethod] = React.useState("CREDIT_CARD");
  const [activeStep, setActiveStep] = React.useState(1);

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
        console.log("SAP", selectedAddress);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, []);

  const createOrderHandler = () => {
    const formData = new FormData();
    formData.append("type", "order_request");
    formData.append("currency", `INR`);
    formData.append("receipt", "22344$" + parseInt(Math.random() * 100));
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("user_address_id", selectedAddress.id);
    formData.append("payment_status", "pending");
    formData.append("amount", "pending");
    const orderList = cartItems.map((item) => {
      return {
        product_id: parseInt(item.id),
        // customization_id: -1,
        quantity: 1,
      };
    });
    console.log(JSON.stringify(orderList));
    formData.append("ordered_products", `"${JSON.stringify(orderList)}"`);

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
      {activeStep === 1 ? (
        <SelectAddressStep
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setSelectedAddress={setSelectedAddress}
          selectedAddress={selectedAddress}
          createOrderHandler={createOrderHandler}
        />
      ) : activeStep === 2 ? (
        <SelectPaymentMethodStep
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setSelectedAddress={setSelectedAddress}
          selectedAddress={selectedAddress}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      ) : null}
    </Box>
  );
};
export default CheckoutForm;
