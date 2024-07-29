import React from "react";
import "./jwellerycard.styles.scss"; // Ensure this is the path to your SCSS file
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { Box } from "@mui/material";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";

const JwelleryCard = ({ id, image, name, price, hash, clickHandler }) => {
  const handleCreateWishList = async () => {
    const formData = new FormData();
    formData.append("type", "add_item");
    formData.append("wishlist_id", localStorage.getItem("default_wishlist"));
    formData.append("product_id", id);
    const token = localStorage.getItem("token");
    const a = await axios.post(
      "https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("hello");
  };
  return (
    <div className="jwellery-card">
      <div className="web">
        <div className="card-image-container" style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              height: "max-content",
              display: "flex",
              alignItems: "center",
              position: "absolute",
            }}
          >
            <Button
              style={{
                width: "max-content",
                height: "max-content",
                marginLeft: "auto",
                backgroundColor: "transparent",
              }}
              onClick={() => {
                handleCreateWishList();
              }}
            >
              <FavoriteBorderOutlinedIcon
                style={{
                  fontSize: "2.5rem",
                  marginLeft: "auto",
                  marginRight: "5%",
                  marginTop: "5%",
                  color: "#a36e29",
                }}
              />
            </Button>
          </div>
          {image.length ? (
            <img
              src={encodeURI(
                `https://api.sadashrijewelkart.com/assets/${image}`
              )}
              alt={name}
              onClick={() => clickHandler(name, hash)}
              className="card-image"
            />
          ) : (
            <Skeleton
              sx={{ bgcolor: "grey.900" }}
              variant="rectangular"
              height={800}
              width={650}
            />
          )}
        </div>
        <div
          className="card-content"
          style={{ textAlign: "left", paddingLeft: "10%", paddingRight: "10%" }}
        >
          <Box
            style={{
              widht: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: "2%",
            }}
          >
            <Typography
              variant="h5"
              style={{ fontWeight: "bold", color: "#a36e29" }}
            >
              ₹{price}
            </Typography>
            <Typography
              variant="h6"
              style={{
                marginRight: "auto",
                marginLeft: "3%",
                color: "gray",
                textDecoration: "line-through",
              }}
            >
              ₹{price}
            </Typography>
          </Box>
          <Typography
            variant="subtitle"
            style={{ marginBottom: "3%", color: "gray", fontWeight: "bold" }}
          >
            {name.substring(0, 23)}
          </Typography>
          <Button
            variant="contained"
            style={{
              width: "100%",
              borderRadius: "50px",
              fontWeight: "bold",
              marginTop: "3%",
              marginBottom: "3%",
              background:
                "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="mobile">
        <div className="card-image-container">
          <img
            src={encodeURI(`https://api.sadashrijewelkart.com/assets/${image}`)}
            alt={name}
            className="card-image"
          />
        </div>
        <div className="card-content">
          <Typography variant="h6" component="h2" className="card-title">
            {name}
          </Typography>
          <Typography variant="h5" component="p" className="card-price">
            ₹{price}
          </Typography>
          <Button variant="contained" className="add-to-cart-button">
            Add to Cart
          </Button>
          <div className="check-delivery">Check delivery date</div>
        </div>
      </div>
    </div>
  );
};

export default JwelleryCard;
