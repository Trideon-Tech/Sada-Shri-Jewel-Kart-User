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

export default function CartTotal({ items }) {
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
          <Typography style={{ fontSize: "1.1rem" }}>$ 12,1231</Typography>
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
          <Typography style={{ fontSize: "1.1rem" }}>$ 1500</Typography>
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
          <Typography style={{ fontSize: "1.1rem" }}>$ 12</Typography>
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
            $ 12,313
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
