import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom"; // Import for linking to track order page
import { useTheme } from "@mui/material/styles";

const OrderCard = ({ orderData }) => {
  return (
    <Card
      sx={{
        display: "flex",
        width: "40vw",
        flexDirection: "column",
        marginBottom: 2,
        minHeight: "30vh",
      }}
    >
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: "3%",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
          height: "10vh",
          marginBottom: "2%",
          backgroundColor: "#fcdaac",
          borderBottom: "1px solid #a36e29",
        }}
      >
        <Typography style={{ color: "#404040" }} variant="h6">
          Order Id : {"1230-A-3S"}
        </Typography>
        <Typography style={{ color: "#707070" }} variant="body">
          Ordered On : 12th july 2023
        </Typography>
      </Box>
      <Box
        style={{
          width: "100%",
          display: "flex",
          marginBottom: "2%",
        }}
      >
        {" "}
        {/* Set card width */}
        <CardActionArea
          style={{ width: "30%" }}
          component={Link}
          to={`/track-order/`}
        >
          {/* Link to specific track order page */}
          <img src={orderData.imageUrl} title={orderData.name} />
        </CardActionArea>
        <CardContent
          sx={{ padding: 2 }}
          style={{
            textAlign: "left",
            width: "30%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {" "}
          {/* Add padding for content */}
          <Typography variant="subtitle1" color="textSecondary">
            Arriving on {orderData.arrivalDate}
          </Typography>
          <Typography variant="h6">{orderData.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {orderData.status}
          </Typography>
          <Box
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginTop: "auto",
            }}
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "#a36e29" }}
              size="small"
              component={Link}
              to={`/track-order/`}
            >
              Track Order
            </Button>
            <Button variant="outlined" color="error" size="small">
              Cancel Order
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default OrderCard;
