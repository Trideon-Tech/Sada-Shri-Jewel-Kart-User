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
import axios from "axios";

export default function CartTotal({ items }) {
  const totalPrice = items
    ? items
        .map((item) => parseInt(item.price))
        .reduce((prev, curr) => prev + curr, 0)
    : 0;

  const [selectedCoupon, setSelectedCoupon] = useState({});

  const [discountValue, setDiscountValue] = useState(0);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(
          `https://api.sadashrijewelkart.com/v1.0.0/user/coupons/all.php?type=all_coupons`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const couponId = localStorage.getItem("selected_coupon");

        if (!couponId) {
          setDiscountValue(0);
        }

        const selectedCouponData = data?.response?.filter(
          (item) => item.id === couponId
        )[0];

        if (selectedCouponData) {
          if (selectedCouponData.amount) {
            setDiscountValue(Number(selectedCouponData.amount));
          } else if (selectedCouponData.percentage) {
            setDiscountValue(
              totalPrice * Number(selectedCouponData.percentage)
            );
          }
        }
      } catch (err) {
        console.log("fetching coupons failed ", err);
      }
    })();
  }, []);

  return (
    <Box
      style={{
        width: "100%",
        height: "50vh",
        display: "flex",
        flexDirection: "column",
        marginTop: "10%",
        justifyContent: "space-between",
      }}
    >
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
          <Typography style={{ fontSize: "1.1rem" }}>Dicount:</Typography>
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
            ₹ {Number(totalPrice).toLocaleString()}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
