import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import image from "../../assets/images/22.png";
import ButtonComponent from "../button/button.component";

const Scheme_Card = () => {
  return (
    <Card sx={{ maxWidth: 450, borderRadius: "10px" }}>
      <CardMedia sx={{ height: 180 }} image={image} title="green iguana" />
      <CardContent>
        <Typography
          style={{
            color: "#A36E29",
            fontWeight: "700",
            fontSize: "17px",
            fontFamily: "open sans",
          }}
        >
          Schemes 1:
        </Typography>
        <Typography
          sx={{ fontWeight: "700", fontSize: "24px", fontFamily: "open sans" }}
        >
          Turn Daily Savings into Timeless Treasures
        </Typography>
        <ul
          style={{
            fontFamily: "open sans",
            fontWeight: "600",
            fontSize: "17px",
          }}
        >
          <li>Save as little as ₹100/day—no limits, no restrictions!</li>
          <br />
          <li>Shop anytime with your savings—no waiting, no tenure</li>
          <br />

          <li>
            Get 10% OFF on making charges for gold jewelry, diamond jewelry, and
            silver articles.
          </li>
          <br />
          <li>Prices based on the prevailing market rate at purchase</li>
        </ul>
      </CardContent>
      <Card
        style={{
          textAlign: "center",
          backgroundColor: "#F9F5EC",
          margin: "0px 15px",
          boxShadow: "none",
          padding: "15px 0px",
        }}
      >
        <Typography>
          Join the{" "}
          <strong style={{ color: "#A36E29" }}>SadāShrī Jewelkart</strong> Daily
          Gold Savings
        </Typography>
        <Typography>Scheme Today</Typography>
        <Typography>
          <strong style={{ color: "#A36E29" }}>Save Now.</strong> Shine Forever
        </Typography>
      </Card>
      <CardActions
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "50px",
        }}
      >
        <ButtonComponent
          buttonText={"Join Now"}
          style={{
            width: "386px",
            height: "27px",
            background: "linear-gradient(to right, #A36E29, #E0B872)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            //   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            //transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        />
      </CardActions>
    </Card>
  );
};

export default Scheme_Card;
