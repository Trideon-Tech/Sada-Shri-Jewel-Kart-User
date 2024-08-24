import React, { useEffect, useState } from "react";
import "./jwellerycard.styles.scss"; // Ensure this is the path to your SCSS file
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box } from "@mui/material";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../../RefreshContent";

const JwelleryCard = ({
  id,
  image,
  name,
  price,
  hash,
  clickHandler,
  isWishlisted,
}) => {
  const navigate = useNavigate();
  const { triggerRefresh } = useRefresh();
  const [wishListed, setWishListed] = useState(false);
  useEffect(() => {
    let wishListItems = localStorage.getItem("wish_list");
    if (wishListItems) {
      wishListItems = wishListItems.split(",");
      if (wishListItems.includes(id)) {
        setWishListed(true);
      }
    }
    console.log("isWishlisted, wishListed", isWishlisted, wishListed);
  }, []);

  const [unWishList, setUnwishList] = useState(false);

  const removeFromWishList = async () => {
    try {
      if (!id) return;

      setUnwishList(true);

      console.log(localStorage.getItem("token"));
      console.log(localStorage.getItem("wish_list"));
      console.log(id);
      const token = localStorage.getItem("token");
      if (!token) {
        const wishListExists = localStorage.getItem("wish_list");
        if (wishListExists && wishListExists.length > 0) {
          let wlItems = wishListExists.split(",");
          wlItems = wlItems.filter((item) => item !== id);
          localStorage.setItem("wish_list", wlItems.join(","));
        }
        isWishlisted = false;
        triggerRefresh();
        // navigate(0);
        return;
      }

      console.log(id);
      await axios.delete(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            type: "wishlist_item",
            wishlist_item_id: id,
          },
        }
      );
      triggerRefresh();

      // navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateWishList = async () => {
    if (isWishlisted || wishListed) {
      removeFromWishList();
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      let wishListItems = localStorage.getItem("wish_list");
      if (!wishListItems) {
        localStorage.setItem("wish_list", id);
      } else {
        wishListItems = wishListItems.split(",");
        wishListItems.push(id);
        wishListItems = Array.from(new Set(wishListItems));
        localStorage.setItem("wish_list", wishListItems.join(","));
      }
      // navigate(0);
      triggerRefresh();

      return;
    }
    const formData = new FormData();
    formData.append("type", "add_item");
    formData.append("wishlist_id", localStorage.getItem("default_wishlist"));
    formData.append("product_id", id);
    await axios.post(
      "https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // navigate(0);
    triggerRefresh();
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
              {unWishList ? (
                <FavoriteIcon
                  style={{
                    fontSize: "2.5rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: "#bfbfbf",
                  }}
                />
              ) : (
                <FavoriteIcon
                  style={{
                    fontSize: "2.5rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: isWishlisted || wishListed ? "#a36e29" : "#bfbfbf",
                  }}
                />
              )}
            </Button>
          </div>
          {image?.length ? (
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
              height={350}
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
            onClick={() => clickHandler(name, hash, true)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="mobile" style={{ padding: "5px", height: "max-content" }}>
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
              <FavoriteIcon
                style={{
                  fontSize: "2.5rem",
                  marginLeft: "auto",
                  marginRight: "5%",
                  marginTop: "5%",
                  color: isWishlisted || wishListed ? "#a36e29" : "#bfbfbf",
                }}
              />
            </Button>
          </div>
          {image?.length ? (
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
              background:
                "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
            }}
            onClick={() => clickHandler(name, hash, true)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JwelleryCard;
