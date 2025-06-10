import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import image from "../../assets/images/22.png";
import ButtonComponent from "../button/button.component";
import Box from "@mui/material/Box";

const Scheme_Card = ({ data, onJoin }) => {
  console.log("Benefits:", data.benefits);
  let benefitsArray = [];
  let rulesArray = [];

try {
  if (typeof data.benefits === "string") {
    benefitsArray = JSON.parse(data.benefits);
  } else if (Array.isArray(data.benefits)) {
    benefitsArray = data.benefits;
  }
} catch (err) {
  console.error("Error parsing benefits:", err);
}

if (typeof data.rules === "string") {
  try {
    // Try to parse string as JSON
    const parsed = JSON.parse(data.rules);
    // Check if parsed is array, else fallback to empty array
    rulesArray = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // Parsing failed — fallback to splitting by commas
    rulesArray = data.rules.split(",").map((r) => r.trim());
  }
} else if (Array.isArray(data.rules)) {
  rulesArray = data.rules;
} else {
  // If rules is undefined or not array/string, fallback empty array
  rulesArray = [];
}

  return (
    <Card sx={{ maxWidth: 450, borderRadius: "10px", display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100%" }}>
      <CardMedia sx={{ height: 180 }} image={image} title="scheme image" />

      <CardContent>
        <Typography
          style={{
            color: "#A36E29",
            fontWeight: "700",
            fontSize: "24px",
            fontFamily: "open sans",
          }}
        >
          {data?.name || "Scheme"}
        </Typography>

        {/* <Typography
          sx={{
            fontWeight: "700",
            fontSize: "24px",
            fontFamily: "open sans",
          }}
        >
          {data?.description || "Turn Daily Savings into Timeless Treasures"}
        </Typography> */}

        <ul
          style={{
            fontFamily: "open sans",
            fontWeight: "600",
            fontSize: "17px",
          }}
        >
         {benefitsArray.map((point, i) => (
          <li key={i} style={{ marginBottom: "8px" }}>
         {point}</li>
))}


        </ul>

        {rulesArray.length > 0 && (
  <>
    <Typography
      sx={{
        fontWeight: "700",
        fontSize: "18px",
        marginTop: "16px",
        fontFamily: "open sans",
        color: "#A36E29",
      }}
    >
      Rules
    </Typography>

    <ul
      style={{
        fontFamily: "open sans",
        fontWeight: "600",
        fontSize: "17px",
      }}
    >
      {rulesArray.map((rule, i) => (
        <li key={i} style={{ marginBottom: "6px" }}>
          {rule}
        </li>
      ))}
    </ul>
  </>
)}

      </CardContent>

      <Box
        style={{
          textAlign: "center",
          backgroundColor: "#F9F5EC",
          marginTop: "auto",
          // boxShadow: "none",
          padding: "16px",
        }}
      >
        <Typography>
          Join the{" "}
          <strong style={{ color: "#A36E29" }}>SadāShrī Jewelkart</strong>{" "}
          {data?.name || "Gold Savings"}
        </Typography>
        <Typography>Scheme Today</Typography>
        <Typography>
          <strong style={{ color: "#A36E29" }}>Save Now.</strong> Shine Forever
        </Typography>
      </Box>

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // marginLeft: "50px",
          padding:"16px",
        }}
      >
      
        <ButtonComponent
          buttonText={"Join Now"}
          onClick={() => {
            onJoin()
          }}
          style={{
            width: "100%",
            maxWidth: "300px",
            height: "40px",
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
          }}
        />
       
      </Box>
    </Card>
  );
};

export default Scheme_Card;
