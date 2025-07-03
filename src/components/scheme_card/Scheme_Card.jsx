import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import image from "../../assets/images/22.png";
import image2 from "../../assets/images/23.png";
import image3 from "../../assets/images/24.png";
import ButtonComponent from "../button/button.component";

const Scheme_Card = ({ data, onJoin }) => {
  console.log("Scheme Plan:", data);
  let benefitsArray = [];
  let rulesArray = [];

  const getImageForScheme = (id) => {
    switch (id) {
      case "1":
        return image;
      case "2":
        return image2;
      case "3":
        return image3;
      default:
        return image;
    }
  };

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
      const parsed = JSON.parse(data.rules);
      rulesArray = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      rulesArray = data.rules.split(",").map((r) => r.trim());
    }
  } else if (Array.isArray(data.rules)) {
    rulesArray = data.rules;
  } else {
    rulesArray = [];
  }

  return (
    <Card
      sx={{
        maxWidth: 450,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <CardMedia
        sx={{ height: 180 }}
        image={getImageForScheme(data?.id)}
        title="scheme image"
      />

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

        <ul
          style={{
            fontFamily: "open sans",
            fontWeight: "600",
            fontSize: "17px",
          }}
        >
          {benefitsArray.map((point, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>
              {point}
            </li>
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
          padding: "16px",
        }}
      >
        <ButtonComponent
          buttonText={"Join Now"}
          onClick={() => {
            onJoin(data.id);
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
