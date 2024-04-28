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
import DisabledByDefaultRoundedIcon from "@mui/icons-material/DisabledByDefaultRounded";
import IndeterminateCheckBoxRoundedIcon from "@mui/icons-material/IndeterminateCheckBoxRounded";

export default function CartItem({ item, removeHandler }) {
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
        display: "flex",
        width: "100%",
        aspectRatio: "3/1",
        marginBottom: "5%",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
      elevation={4}
    >
      <Box
        style={{
          border: "2px solid #f7f7f7",
          borderRadius: "5px",
          height: "50%",
          aspectRatio: "1/1",
          marginLeft: "10%",
          overflow: "hidden",
        }}
      >
        <img
          src={`https://api.sadashrijewelkart.com/assets/${item.images[0].file}`}
          // src="https://api.sadashrijewelkart.com/assets/company/NewJwellers/products/webp/Faria%20Diamond%20Band-1706799778.webp"
          style={{ height: "80%", width: "80%", objectFit: "contain" }}
        />
      </Box>
      <Box
        style={{
          height: "80%",
          display: "flex",
          marginLeft: "10%",
          marginRight: "auto",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          color="#505050"
          style={{ textAlign: "left" }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ fontWeight: "bold" }}
          gutterBottom
        >
          ${item.price}
        </Typography>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BalanceIcon fontSize="small" style={{ color: "#a36e29" }} />
          <Typography
            style={{ marginLeft: "10px", fontWeight: "bold", color: "#505050" }}
          >
            {item.weight} g
          </Typography>
        </Box>
        <Box
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "end",
            justifyContent: "space-evenly",
          }}
        >
          <Typography
            variant="subtitle1"
            style={{ fontWeight: "bold", color: "#505050" }}
            gutterBottom
          >
            Quantity :
          </Typography>
          <input
            value={quantity}
            style={{
              width: "30px",
              height: "30px",
              marginLeft: "5px",
              fontSize: "15px",
              textAlign: "center",
            }}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </Box>
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled button group"
          style={{ marginTop: "10px" }}
        >
          <Button
            style={{ backgroundColor: "#a36e29" }}
            onClick={decreaseQuantity}
          >
            {" "}
            <RemoveIcon fontSize="medium" />
          </Button>
          <Button
            style={{ backgroundColor: "#a36e29" }}
            onClick={increaseQuantity}
          >
            <AddIcon fontSize="medium" />
          </Button>
        </ButtonGroup>
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "80%",
          marginRight: "5%",
        }}
      >
        <Button onClick={() => removeHandler(item.cart_id)}>
          <IndeterminateCheckBoxRoundedIcon
            fontSize="large"
            style={{
              marginBottom: "auto",
              marginTop: "5%",
              color: "#f06954",
              "&:hover": {
                color: "#ed2a0c",
              },
            }}
          />
        </Button>
      </Box>
    </Card>
  );
}
