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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function CartTotal({
  items,
  openModal,
  couponData,
  selectedCouponCode,
}) {
  const totalPrice = items
    .map((item) => parseInt(item.price))
    .reduce((prev, curr) => prev + curr, 0);

  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    console.log("couponData", couponData);
    if (couponData) {
      if (couponData.amount) {
        setDiscountValue(Number(couponData.amount));
      } else if (couponData.percentage) {
        setDiscountValue(totalPrice * Number(couponData.percentage));
      }
    }
  }, [couponData]);

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
          Delivering to : 834001
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
          style={{ marginLeft: "5%", marginRight: "auto", fontWeight: "bold" }}
        >
          Apply Coupon{" "}
          <span style={{ color: "#A36E29" }}>{selectedCouponCode}</span>
        </Typography>
        <Button
          variant="outlined"
          style={{ border: 0, color: "#A36E29", fontWeight: "bold" }}
          onClick={() => openModal(true)}
        >
          <ArrowForwardIosIcon />
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
          <Typography style={{ fontSize: "1.1rem" }}>
            Discount:<b>{couponData?.code || ""}</b>
          </Typography>
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
