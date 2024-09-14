import { FavoriteBorderOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import React from "react";

export default function CartItem({
  item,
  removeHandler,
  readOnly,
  moveToWishlistHandler,
}) {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Card
      sx={{
        borderRadius: "10px",
        display: "flex",
        padding: "3%",
        width: "90%",
        height: matches ? "max-content" : "300px",
        aspectRatio: "4/1",
        marginBottom: "3%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: matches ? "row" : "column",
      }}
      elevation={1}
    >
      <Box
        style={{
          border: "2px solid #e7e7e7",
          borderRadius: "10px",
          height: matches ? "100%" : "max-content",
          aspectRatio: "1/1",
          overflow: "hidden",
        }}
      >
        {item?.images ? (
          <img
            src={`https://api.sadashrijewelkart.com/assets/${item?.images[0]?.file}`}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        ) : null}
      </Box>
      <Box
        style={{
          height: "100%",
          width: "70%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginLeft: "20px",
        }}
      >
        <Typography
          style={{
            textAlign: "left",
            fontWeight: "bold",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
          }}
        >
          {item?.name}
        </Typography>
        <Box
          style={{
            width: "100%",
            marginTop: "2%",
            height: "max-content",
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: matches ? "row" : "column",
            alignItems: matches ? "center" : "flex-start",
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
              style={{
                color: "gray",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              Size :
            </Typography>
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                marginLeft: "10px",
              }}
            >
              {item.customization == -1 ? "Default" : ""}
            </Typography>
            {/* <Select
              placeholder="Select size"
              required
              sx={{ width: "150px", border: 0, marginLeft: "10px" }}
              disabled
            >
              <Option value="15cm">15cm</Option>
              <Option value="16cm">16cm</Option>
              <Option value="17cm">17cm</Option>
              <Option value="18cm">18cm</Option>
            </Select> */}
          </Box>
          <Box
            style={{
              display: "flex",
              marginLeft: matches ? "10%" : 0,
              marginRight: "auto",
              width: "max-content",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              Quantity :
            </Typography>
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                marginLeft: "10px",
              }}
            >
              1 Pcs.
            </Typography>
          </Box>
        </Box>
        <Typography
          style={{
            marginTop: "2%",
            fontSize: "1rem",
            fontWeight: "bold",
            fontFamily: '"Open Sans", sans-serif',
          }}
        >
          <span style={{ fontWeight: "normal" }}>Price :</span> ₹
          {parseFloat(item?.price).toLocaleString()}
        </Typography>
      </Box>
      {!readOnly ? (
        <Box
          style={{
            display: "flex",
            flexDirection: matches ? "column" : "row",
            width: "max-content",
            height: "100%",
          }}
        >
          <Button
            onClick={() => removeHandler(item?.cart_id)}
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
          <Button
            style={{ marginTop: matches ? "auto" : 0 }}
            onClick={() => moveToWishlistHandler(item?.id, item?.cart_id)}
          >
            {item?.exists_in_wishlist ? (
              <FavoriteIcon
                fontSize="large"
                style={{
                  color: item?.exists_in_wishlist ? "#A36E29" : "gray",
                  marginBottom: "auto",
                }}
              />
            ) : (
              <FavoriteBorderOutlined
                fontSize="large"
                style={{
                  marginBottom: "auto",
                  color: "#bfbfbf",
                }}
              />
            )}
          </Button>
        </Box>
      ) : null}
    </Card>
  );
}
