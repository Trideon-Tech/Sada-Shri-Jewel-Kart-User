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
import { generalToastStyle } from "../../utils/toast.styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
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
  handlePaymentRequest,
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
          onClick={handlePaymentRequest}
        >
          Pay
        </Button>
      </Box>
    </Box>
  );
};

const CheckoutForm = ({ cartItems }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState({});
  const [paymentMethod, setPaymentMethod] = React.useState("CREDIT_CARD");
  const [activeStep, setActiveStep] = React.useState(1);
  const [orderCreatedData, setOrderCreatedData] = React.useState(null);

  React.useEffect(() => {
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
        console.log(response);
        console.log(response?.data?.response[0]);
        if (response?.data?.response[0])
          setSelectedAddress(response?.data?.response[0]);
        console.log("SAP", selectedAddress);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePaymentRequest = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    console.log(orderCreatedData);
    const options = {
      key: "rzp_test_u3HTPcwIbGNSAp", // Enter the Key ID generated from the Dashboard
      amount: orderCreatedData.amount_due.toString(),
      currency: orderCreatedData.currency,
      name: "Sada Shri",
      description: "Test Transaction",
      image: {
        logo: "https://source.unsplash.com/random/1280x720?jewellery&sig=1",
      },
      order_id: orderCreatedData.id,
      handler: async function (response) {
        console.log(response);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        console.log("orderCreatedData::::", orderCreatedData);
        formData.append("type", "payment_success");
        formData.append("razorpay_order_id", response.razorpay_order_id);
        formData.append("razorpay_payment_id", response.razorpay_payment_id);
        formData.append("razorpay_signature", response.razorpay_signature);
        formData.append("order_id", response.razorpay_order_id);
        formData.append("payment_method", "UPI");
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
            toast.info("Payment Verified", generalToastStyle);
            navigate("/order-confirmation");
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error(error.response.data.message, generalToastStyle);
          });
      },
      prefill: {
        name: "Soumya Dey",
        email: "SoumyaDey@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#a36e29",
      },
    };

    console.log("paymentOptions : ", options);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const createOrderHandler = () => {
    const formData = new FormData();
    formData.append("type", "order_request");
    formData.append("currency", `INR`);
    formData.append("receipt", "22344$" + parseInt(Math.random() * 100));
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("user_address_id", selectedAddress.id);
    formData.append("payment_status", "pending");
    // formData.append("amount", 4210);
    const orderList = cartItems?.map((item) => {
      return {
        product_id: parseInt(item.id),
        // customization_id: -1,
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
        setOrderCreatedData(response.data.response);
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
          handlePaymentRequest={handlePaymentRequest}
        />
      ) : null}
    </Box>
  );
};
export default CheckoutForm;
