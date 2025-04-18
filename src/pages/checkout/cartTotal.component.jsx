import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CartTotal({ items, coinValueDiscount }) {
  const totalPrice = items
    .map((item) =>
      item.customization === "-1"
        ? parseFloat(item.price)
        : parseFloat(item.customization.variant[0].price)
    )
    .reduce((prev, curr) => prev + curr, 0);

  const queryParams = new URLSearchParams(window.location.search);

  const [discountValue, setDiscountValue] = useState(0);
  const [discountName, setDiscountName] = useState(0);
  const [coinsApplied, setCoinsApplied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const coins = queryParams.get("coins");
        setCoinsApplied(coins);
        console.log(coinsApplied);

        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1.0.0/user/coupons/all.php?type=all_coupons`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (queryParams.get("discount") == "null") {
          setDiscountValue(0);
        } else {
          const selectedCouponData = data?.response?.filter(
            (item) => item.id === queryParams.get("discount")
          )[0];

          if (selectedCouponData) {
            setDiscountName(() => selectedCouponData.code);
            if (selectedCouponData.amount !== "0") {
              setDiscountValue(() => Number(selectedCouponData.amount));
            } else {
              setDiscountValue(
                () => totalPrice * (Number(selectedCouponData.percentage) / 100)
              );
            }
          }
        }
      } catch (err) {
        console.log("fetching coupons failed ", err);
      }
    })();
  }, [queryParams, discountValue, coinsApplied]);

  const matches = useMediaQuery("(min-width:600px)");

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
          width: matches ? "90%" : "",
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
            fontFamily: '"Roboto", sans-serif',
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
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            Subtotal:
          </Typography>
          <Typography
            style={{
              fontFamily: '"Roboto", sans-serif',
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
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            Discount: (
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {discountName}
            </span>
            )
          </Typography>
          <Typography
            style={{
              fontFamily: '"Roboto", sans-serif',
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
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              Redeemed Coins:
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              ₹ {Number(coinsApplied).toLocaleString()}
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
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Total:
          </Typography>
          <Typography
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            ₹
            {(
              Number(totalPrice) -
              discountValue -
              (coinsApplied ? coinsApplied : 0)
            ).toLocaleString()}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
