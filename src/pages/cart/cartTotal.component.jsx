import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useEffect, useState } from "react";
import BalanceIcon from "@mui/icons-material/Balance";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Divider, CardContent } from "@mui/material";
import PinDropIcon from "@mui/icons-material/PinDrop";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Input, Textarea } from "@mui/joy";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/joy/Modal";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";

export default function CartTotal({
  items,
  openModal,
  couponData,
  selectedCouponCode,
  setSelectedCouponId,
  setSelectedCouponCode,
  selectedCouponId,
  couponList,
}) {
  const totalPrice = items
    .map((item) => parseInt(item.price))
    .reduce((prev, curr) => prev + curr, 0);

  const [discountValue, setDiscountValue] = useState(0);

  const [locationModalOpen, setLocationModalOpen] = useState();

  const handleCouponChange = () => {
    if (selectedCouponCode) {
      //unset Coupon
      setSelectedCouponId(null);
      setSelectedCouponCode(null);
    } else {
      openModal(true);
    }
  };
  useEffect(() => {
    console.log("couponData", couponData);
    if (!selectedCouponId) {
      setDiscountValue(0);
    }
    const selectedCouponData = couponList.filter(
      (item) => item.id === selectedCouponId
    )[0];
    if (selectedCouponData) {
      if (selectedCouponData.amount) {
        setDiscountValue(Number(selectedCouponData.amount));
      } else if (selectedCouponData.percentage) {
        setDiscountValue(totalPrice * Number(selectedCouponData.percentage));
      }
    }
  }, [selectedCouponId]);

  return (
    <Box
      style={{
        width: "100%",
        height: "30vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "10%",
        justifyContent: "space-between",
      }}
    >
      <Modal
        open={locationModalOpen}
        onClose={() => {
          setLocationModalOpen(false);
        }}
      >
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="modal-dialog-overflow"
            style={{ width: "500px", height: "600px", padding: "30px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
                  Locate me now
                </p>
                <ModalClose />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50px",
                }}
              >
                <PinDropOutlinedIcon
                  style={{ fontSize: "5rem", color: "#a36e29" }}
                />
                <p
                  style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    width: "300px",
                    fontWeight: 600,
                  }}
                >
                  Add your Pincode to Browse Better
                </p>
              </div>
              <div style={{ width: "100%", height: "max-content" }}>
                <Input
                  sx={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#F9F5EC",
                    border: 0,
                  }}
                  placeholder="Enter your Pincode"
                  inputProps={{ "aria-label": "Enter your Pincode" }}
                  startDecorator={<MyLocationIcon />}
                  endDecorator={
                    <p style={{ fontWeight: 600, color: "#A36E29" }}>ADD</p>
                  }
                  onChange={(event) =>
                    localStorage.setItem("default_pincode", event.target.value)
                  }
                />
                <div
                  style={{
                    width: "100%",
                    height: "max-content",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    color: "#A36E29",
                    fontWeight: 600,
                    paddingLeft: "20px",
                  }}
                >
                  <LocalShippingOutlinedIcon />
                  <p>{"  "}Estimated delivery by 12 July</p>
                </div>
              </div>
              <Card
                elevation={4}
                sx={{
                  width: "calc(100% - 40px)",
                  height: "60px",
                  display: "flex",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ width: "70%", height: "100%" }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    City Location
                  </h4>
                  <p style={{ margin: 0, color: "gray", fontWeight: 600 }}>
                    Jamshedpur, Jharkhand
                  </p>
                </div>
                <div
                  style={{ marginLeft: "auto", width: "30%", height: "100%" }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#A36E29",
                      textAlign: "right ",
                    }}
                  >
                    Submit
                  </p>
                </div>
              </Card>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
      <Card
        style={{
          width: "90%",
          minHeight: 65,
          height: "7vh",
          borderRadius: "10px",
          backgroundColor: "white",
          paddingLeft: "5%",
          paddingRight: "5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5%",
        }}
        elevation={4}
      >
        <PinDropIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
        <Typography style={{ marginLeft: "2%", fontWeight: "bold" }}>
          Delivering to : {localStorage.getItem("default_pincode")}
        </Typography>
        <Button
          variant="outlined"
          style={{
            border: 0,
            fontSize: "0.7rem",
            color: "#A36E29",
            fontWeight: "bold",
            marginRight: 0,
          }}
          onClick={() => setLocationModalOpen(true)}
        >
          Change Pincode
        </Button>
      </Card>
      <Card
        style={{
          width: "90%",
          minHeight: 65,
          height: "7vh",
          borderRadius: "10px",
          backgroundColor: "white",
          paddingLeft: "5%",
          paddingRight: "5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "5%",
          textAlign: "left",
        }}
        elevation={4}
      >
        <LocalOfferIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
        <Typography
          style={{
            marginLeft: "5%",
            marginRight: "auto",
            fontWeight: "bold",
            color: selectedCouponCode ? "#A36E29" : "black",
          }}
        >
          {selectedCouponCode
            ? `Applied ${selectedCouponCode}`
            : "Apply Coupon"}
        </Typography>
        <Button
          variant="outlined"
          style={{ border: 0, color: "#A36E29", fontWeight: "bold" }}
          onClick={() => handleCouponChange()}
        >
          {!selectedCouponCode ? <ArrowForwardIosIcon /> : <CloseIcon />}
        </Button>
      </Card>
      <Card
        style={{
          width: "90%",
          minHeight: 250,
          height: "max-content",
          borderRadius: "10px",
          backgroundColor: "white",
          padding: "5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "flex-start",
          marginBottom: "5%",
          textAlign: "left",
        }}
        elevation={4}
      >
        <Typography
          variant="h6"
          style={{
            textAlign: "left",
            fontWeight: "bold",
            color: "#505050",
            marginBottom: "5%",
          }}
        >
          Order Summary
        </Typography>
        <Box
          style={{
            width: "100%",
            display: "flex",
            marginTop: "3%",
            alignItems: "center",
            justifyContent: "space-between",
            color: "gray",
          }}
        >
          <Typography style={{ fontSize: "1.1rem" }}>Subtotal:</Typography>
          <Typography style={{ fontSize: "1.1rem" }}>
            ₹ {Number(totalPrice).toLocaleString()}
          </Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "3%",
            color: "gray",
          }}
        >
          <Typography style={{ fontSize: "1.1rem" }}>You Saved:</Typography>
          <Typography style={{ fontSize: "1.1rem" }}>₹ 0</Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "3%",
            color: "gray",
          }}
        >
          <Typography style={{ fontSize: "1.1rem" }}>Discount:</Typography>
          <Typography style={{ fontSize: "1.1rem" }}>
            ₹ {Number(discountValue).toLocaleString()}
          </Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#050505",
          }}
        >
          <Typography style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
            Total:
          </Typography>
          <Typography style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
            ₹ {(Number(totalPrice) - discountValue).toLocaleString()}
          </Typography>
        </Box>
      </Card>
      <Button
        variant="contained"
        style={{
          marginBottom: "5%",

          minHeight: 65,
          backgroundColor: "#a36e29",
          height: "10%",
          borderRadius: "10px",
          background:
            "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
        }}
        component={Link}
        to="/checkout"
        fullWidth
      >
        Checkout
      </Button>
    </Box>
  );
}
