import { FavoriteBorderOutlined } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRefresh } from "../../RefreshContent";
import "./jwellerycard.styles.scss";

const JwelleryCard = ({
  id,
  image,
  name,
  price,
  hash,
  clickHandler,
  isWishlisted,
  isInCart,
  addToCartClick,
  wishlistItem,
  quantity,
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
  }, []);

  const [unWishList, setUnwishList] = useState(false);

  const removeFromWishList = async () => {
    try {
      console.log('Remove from wishlist', id);
      if (!id) return;
      setUnwishList(true);

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
        return;
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/wishlist.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            type: "wishlist_item",
            wishlist_item_id: wishlistItem.id ?? id,
          },
        }
      );
      triggerRefresh();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateWishList = async () => {
    console.log('Wishlist clicked');
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (isWishlisted || wishListed) {
      console.log('Wishlist already exists');
      removeFromWishList();
      return;
    }

    const formData = new FormData();
    formData.append("type", "add_item");
    formData.append("wishlist_id", localStorage.getItem("default_wishlist"));
    formData.append("product_id", id);

    await axios.post(
      `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/wishlist.php`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log('Wishlist added');
    setWishListed(true);
    triggerRefresh();
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    if (isInCart) {
      navigate("/cart");
    } else {
      addToCartClick(id);
    }
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
                <FavoriteBorderOutlined
                  style={{
                    fontSize: "2rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: "#bfbfbf",
                  }}
                />
              ) : isWishlisted || wishListed ? (
                <FavoriteIcon
                  style={{
                    fontSize: "2rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: "#a36e29",
                  }}
                />
              ) : (
                <FavoriteBorderOutlined
                  style={{
                    fontSize: "2rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: "#bfbfbf",
                  }}
                />
              )}
            </Button>
          </div>
          {image?.length ? (
            <img
              src={encodeURI(
                `${process.env.REACT_APP_API_URL}/assets/${image}`
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
              style={{
                fontWeight: "bold",
                color: "#a36e29",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1.2rem",
              }}
            >
              ₹{price}
            </Typography>
            <Typography
              style={{
                marginRight: "auto",
                marginLeft: "3%",
                color: "gray",
                textDecoration: "line-through",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1rem",
              }}
            >
              ₹{(price * 1.2).toFixed(2)}
            </Typography>
          </Box>
          <Typography
            style={{
              marginBottom: "3%",
              color: "gray",
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
            }}
          >
            {name.length > 25 ? `${name.substring(0, 25)}...` : name}
          </Typography>
          {quantity != "0" ? (
            <Button
              variant="contained"
              style={{
                width: "100%",
                fontWeight: "bold",
                marginTop: "3%",
                marginBottom: "3%",
                background: "linear-gradient(to right, #d4a76a, #a36e29)",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
              onClick={handleAddToCart}
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{
                width: "100%",
                fontWeight: "bold",
                marginTop: "3%",
                marginBottom: "3%",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                background: "linear-gradient(to right, #d4a76a, #a36e29)",
              }}
              onClick={() => clickHandler(name, hash)}
            >
              SHOW DETAILS
            </Button>
          )}
        </div>
      </div>

      {/* Mobile UI */}
      <div className="mobile">
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
              {isWishlisted || wishListed ? (
                <FavoriteIcon
                  style={{
                    fontSize: "1.8rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: "#a36e29",
                  }}
                />
              ) : (
                <FavoriteBorderOutlined
                  style={{
                    fontSize: "1.8rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: "#bfbfbf",
                  }}
                />
              )}
            </Button>
          </div>
          {image?.length ? (
            <img
              src={encodeURI(
                `${process.env.REACT_APP_API_URL}/assets/${image}`
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
              style={{
                fontWeight: "bold",
                color: "#a36e29",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1rem",
              }}
            >
              ₹{price}
            </Typography>
            <Typography
              style={{
                marginRight: "auto",
                marginLeft: "3%",
                color: "gray",
                textDecoration: "line-through",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              ₹{(price * 1.2).toFixed(2)}
            </Typography>
          </Box>
          <Typography
            style={{
              marginBottom: "3%",
              color: "gray",
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            {name.length > 16 ? `${name.substring(0, 16)}...` : name}
          </Typography>
          {quantity != "0" ? (
            <Button
              variant="contained"
              style={{
                width: "100%",
                fontWeight: "bold",
                marginTop: "3%",
                background: "linear-gradient(to right, #d4a76a, #a36e29)",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
              onClick={handleAddToCart}
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </Button>
          ) : (
            <Button
              variant="contained"
              style={{
                width: "100%",
                fontWeight: "bold",
                marginTop: "3%",
                fontFamily: '"Roboto", sans-serif',
                background: "linear-gradient(to right, #d4a76a, #a36e29)",
                fontSize: "0.8rem",
              }}
              onClick={() => clickHandler(name, hash)}
            >
              SHOW DETAILS
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JwelleryCard;
