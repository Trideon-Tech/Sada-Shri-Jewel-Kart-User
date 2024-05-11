import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import * as React from "react";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";

const OrderItem = ({ address }) => {
  return (
    <Box>
      <Box
        style={{
          width: "100%",
          height: "40%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <img
          src="https://source.unsplash.com/random/?jewellery&sig=1"
          style={{
            margin: "3%",
            marginRight: "0%",
            borderRadius: "3%",
            width: "7%",
            aspectRatio: "1/1",
          }}
        />
        <Typography variant="body" style={{ marginRight: "40%" }}>
          Diamond Ring In Golden Stone
        </Typography>
        <Button variant="contained" style={{ backgroundColor: "#a36e29" }}>
          Track
        </Button>
        <Typography variant="subtitle" style={{ marginRight: "10%" }}>
          1
        </Typography>
        <Typography variant="h5">$12,232</Typography>
      </Box>
      <Box style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Divider style={{ width: "90%" }} />
      </Box>
    </Box>
  );
};

export default OrderItem;
