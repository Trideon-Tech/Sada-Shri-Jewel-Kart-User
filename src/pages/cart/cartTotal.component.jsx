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

import { Divider, CardContent } from "@mui/material";

export default function CartTotal() {
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <Card
      sx={{
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        marginTop: "40px",
        height: "60vh",
        width: "28vw",
        alignItems: "center",
      }}
      elevation={4}
    >
      <Box style={{ display: "flex", marginTop: "1%" }}>
        <Typography variant={"h5"} fontWeight="bold" color="#707070">
          Cart Summary
        </Typography>
      </Box>
      <Divider flexItem style={{ marginTop: "1%", width: "100%" }} />
      <Box
        style={{
          marginTop: "5%",
          width: "80%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            width: "fit-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography style={{ lineHeight: "40px" }}>Sub-Total</Typography>
          <Typography style={{ lineHeight: "40px" }}>Discount</Typography>
          <Typography style={{ lineHeight: "40px" }}>Total</Typography>
        </Box>
        <Box
          style={{
            marginLeft: "auto",
            width: "fit-content",

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography style={{ lineHeight: "40px" }}>$89,209</Typography>
          <Typography style={{ lineHeight: "40px" }}>$9,209</Typography>
          <Typography style={{ lineHeight: "40px" }}>$80,000</Typography>
        </Box>
      </Box>
      <Card
        style={{
          width: "80%",
          marginTop: "auto",
          marginBottom: "5%",
          backgroundColor: "#fcbd6a",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Estimated Date Of Delivery
          </Typography>
          <Typography
            variant="h5"
            component="div"
            style={{ fontWeight: "bold" }}
          >
            13 April 2024
          </Typography>

          <Typography variant="body2">Location: Ranchi</Typography>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        style={{
          marginTop: "auto",
          marginBottom: "5%",
          backgroundColor: "#a36e29",
        }}
      >
        Continue
      </Button>
    </Card>
  );
}
