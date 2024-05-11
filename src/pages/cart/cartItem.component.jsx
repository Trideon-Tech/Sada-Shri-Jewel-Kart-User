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
import Select from "@mui/joy/Select";
import CloseIcon from "@mui/icons-material/Close";
import Option from "@mui/joy/Option";
export default function CartItem({ item, removeHandler, readOnly }) {
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
        borderRadius: "20px",
        display: "flex",
        padding: "3%",
        width: "93%",
        aspectRatio: "4/1",
        marginBottom: "5%",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      elevation={4}
    >
      <Box
        style={{
          border: "2px solid #e7e7e7",
          borderRadius: "10px",
          height: "100%",
          aspectRatio: "1/1",
          overflow: "hidden",
        }}
      >
        <img
          src={`https://api.sadashrijewelkart.com/assets/${item.images[0].file}`}
          // src="https://api.sadashrijewelkart.com/assets/company/NewJwellers/products/webp/Faria%20Diamond%20Band-1706799778.webp"
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
      </Box>
      <Box
        style={{
          height: "100%",
          width: "70%",
          padding: "10px",
          display: "flex",

          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          color="#505050"
          style={{ textAlign: "left", fontWeight: "bold" }}
        >
          {item.name}
        </Typography>
        <Box
          style={{
            width: "100%",
            marginTop: "5%",
            height: "max-content",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              width: "max-content",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              style={{ color: "gray", fontSize: "1rem" }}
              gutterBottom
            >
              Size :
            </Typography>
            <Select
              placeholder="Select size"
              required
              sx={{ width: 150, border: 0 }}
            >
              <Option value="dog">Dog</Option>
              <Option value="cat">Cat</Option>
              <Option value="fish">Fish</Option>
              <Option value="bird">Bird</Option>
            </Select>
          </Box>
          <Box
            style={{
              display: "flex",
              marginLeft: "10%",
              marginRight: "auto",
              width: "max-content",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              style={{ color: "gray", fontSize: "1rem" }}
              gutterBottom
            >
              Quantity :
            </Typography>
            <Select
              value={quantity}
              defaultValue={1}
              onChange={(newValue) => setQuantity(newValue)}
              required
              sx={{ width: 150, border: 0 }}
            >
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
              <Option value={4}>4</Option>
            </Select>
          </Box>
        </Box>
        <Typography
          variant="subtitle2"
          style={{ marginTop: "2%", fontSize: "1rem", fontWeight: "bold" }}
          gutterBottom
        >
          <span style={{ fontWeight: "normal" }}>Price:</span> ₹
          {parseFloat(item.price).toLocaleString()}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ marginTop: "2%", color: "gray", fontSize: "1rem" }}
          gutterBottom
        >
          Deliver By : 3rd September, 2024
        </Typography>
      </Box>
      {!readOnly ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "max-content",
            height: "100%",
          }}
        >
          <Button
            onClick={() => removeHandler(item.cart_id)}
            style={{ padding: 0 }}
          >
            <CloseIcon
              fontSize="large"
              style={{
                marginBottom: "auto",
                color: "#A36E29",
              }}
            />
          </Button>
        </Box>
      ) : null}
    </Card>
  );
}
