import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CartTotal({ items, coinValueDiscount }) {
  const totalPrice = items
    ? items
        .map((item) => parseInt(item.price))
        .reduce((prev, curr) => prev + curr, 0)
    : 0;

  const [selectedCoupon, setSelectedCoupon] = useState({});

  const [discountValue, setDiscountValue] = useState(0);
  const [coinsApplied, setCoinsApplied] = useState(false);
  useEffect(() => {
    const coinsApplied = localStorage.getItem("coins_applied");
    if (coinsApplied !== undefined) {
      setCoinsApplied(coinsApplied);
    }
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
        display: "flex",
        flexDirection: "column",
        marginTop: "3%",
      }}
    >
      <Card
        style={{
          width: "90%",
          borderRadius: "10px",
          backgroundColor: "white",
          padding: "3%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "flex-start",
          marginBottom: "5%",
          textAlign: "left",
        }}
        elevation={1}
      >
        <Typography
          style={{
            textAlign: "left",
            fontWeight: "bold",
            color: "#505050",
            marginBottom: "1%",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
          }}
        >
          Order Summary
        </Typography>
        <Box
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "gray",
          }}
        >
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            Subtotal:
          </Typography>
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            ₹ {Number(totalPrice).toLocaleString()}
          </Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1%",
            color: "gray",
          }}
        >
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            Dicount:
          </Typography>
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            ₹ {Number(discountValue).toLocaleString()}
          </Typography>
        </Box>
        {coinsApplied ? (
          <Box
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1%",
              color: "gray",
            }}
          >
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              Redeemed Coins:
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              ₹ {Number(coinValueDiscount).toLocaleString()}
            </Typography>
          </Box>
        ) : null}
        <Box
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#050505",
            marginTop: "1%",
          }}
        >
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Total:
          </Typography>
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            ₹
            {(
              Number(totalPrice) -
              discountValue -
              (coinsApplied ? coinValueDiscount : 0)
            ).toLocaleString()}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
