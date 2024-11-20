import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutProgressBar from "../../components/checkoutProgress/checkoutProgress.component";
import { generalToastStyle } from "../../utils/toast.styles";
import AddressPanel from "./addressPanel.component";
import PaymentMethod from "./paymentMethod.component";
const steps = ["Login", "Shipping", "Payment"];

const SelectAddressStep = ({
  setActiveStep,
  activeStep,
  selectedAddress,
  setSelectedAddress,
  createOrderHandler,
  matches,
}) => {
  const handleCreateOrder = async () => {
    await createOrderHandler();
    console.log("order created");
    setActiveStep(activeStep + 1);
  };
  return (
    <Box
      style={{
        width: matches ? "50%" : "100%",
        marginTop: "5%",
        height: "max-content",
        marginBottom: "5%",
      }}
    >
      <Typography
        style={{
          color: "black",
          fontWeight: "bold",
          marginBottom: "3%",
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "1.2rem",
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
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "1rem",
          fontWeight: "bold",
          background: "#a36e29",
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
  matches,
}) => {
  return (
    <Box
      style={{
        width: matches ? "50%" : "100%",
        marginTop: "5%",
        height: "max-content",
        marginBottom: "5%",
      }}
    >
      <Typography
        style={{
          color: "black",
          fontWeight: "bold",
          marginBottom: "3%",
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "1.2rem",
        }}
      >
        Continue To Payment
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          style={{
            color: "rgba(163,110,41,1)",
            width: "47%",
            minHeight: 50,
            border: "2px solid rgba(163,110,41,1)",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
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
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
            background: "#a36e29",
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

  const queryParams = new URLSearchParams(window.location.search);
  console.log(queryParams.get("discount"));
  console.log(queryParams.get("coins"));

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

  const handlePaymentRequest = async (data) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: "rzp_test_u3HTPcwIbGNSAp",
      amount: data.amount_due.toString(),
      currency: data.currency,
      name: "Sadāshrī Jewelkart",
      description: "Payment Request",
      image: {
        logo: "https://source.unsplash.com/random/1280x720?jewellery&sig=1",
      },
      order_id: data.id,
      handler: async function (response) {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("type", "payment_success");
        formData.append("razorpay_order_id", response.razorpay_order_id);
        formData.append("razorpay_payment_id", response.razorpay_payment_id);
        formData.append("razorpay_signature", response.razorpay_signature);
        formData.append("order_id", response.razorpay_order_id);
        formData.append("payment_method", "UPI");
        formData.append("wallet_amount", queryParams.get("coins"));
        formData.append("coupon_id", queryParams.get("discount"));
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
            toast.info("Payment Verified", generalToastStyle);
            navigate(
              `/order-confirmation?order_record_id=${response.data.response["order_record"][0]["id"]}`
            );
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error(error.response.data.message, generalToastStyle);
          });
      },
      notes: {
        address:
          "Building No./Flat No.: NO 1323/1324Road/Street: 16TH B CROSS HOUSING BOARD COLONY EWS 3RD PHASE Locality/Sub Locality: Yelahanka New TownCity/Town/ Village: Bengaluru District: Bengaluru UrbanState: Karnataka PIN Code: 560064",
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
    formData.append("coupon_id", queryParams.get("discount"));
    formData.append("wallet_amount", queryParams.get("coins"));
    const orderList = cartItems?.map((item) => {
      return {
        product_id: parseInt(item.id),
        customization_id:
          item.customization == -1 ? -1 : item.customization.variant[0].id,
        quantity: 1,
      };
    });
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
        setOrderCreatedData(() => response.data.response);

        handlePaymentRequest(response.data.response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const matches = useMediaQuery("(min-width:600px)");

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
      <Box
        style={{
          width: matches ? "60%" : "100%",
          marginTop: matches ? "5%" : '5%',
          height: "max-content",
        }}
      >
        <CheckoutProgressBar activeStep={activeStep} />
      </Box>
      {activeStep === 1 ? (
        <SelectAddressStep
          activeStep={activeStep}
          matches={matches}
          setActiveStep={setActiveStep}
          setSelectedAddress={setSelectedAddress}
          selectedAddress={selectedAddress}
          createOrderHandler={() => {}}
        />
      ) : activeStep === 2 ? (
        <SelectPaymentMethodStep
          matches={matches}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setSelectedAddress={setSelectedAddress}
          selectedAddress={selectedAddress}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          handlePaymentRequest={createOrderHandler}
        />
      ) : null}
    </Box>
  );
};
export default CheckoutForm;
