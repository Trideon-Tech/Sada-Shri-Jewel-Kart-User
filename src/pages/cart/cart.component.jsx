import React, { useEffect, useState } from "react";
import "./cart.styles.scss";
import Navbar from "../../components/navbar/navbar.component";
import { Grid, Box, Divider, Typography, Card, Button } from "@mui/material";
import CartItem from "./cartItem.component";
import CartTotal from "./cartTotal.component";
import axios from "axios";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import { Input, Textarea } from "@mui/joy";
import "react-toastify/dist/ReactToastify.css";

const CouponCard = ({
  item,
  handleClose,
  couponSelectHandler,
  couponCodeSelector,
}) => {
  const handleSelectedCoupon = () => {
    localStorage.setItem("selected_coupon", item.id);
    handleClose(false);
    couponSelectHandler(item.id);
    console.log("=======", item.code);
    couponCodeSelector(item.code);
  };
  return (
    <Card
      elevation={4}
      sx={{
        marginTop: "20px",
        width: "100%",
        height: "120px",
        display: "flex",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          width: "25%",
          height: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          background:
            "linear-gradient(180deg, rgba(224,184,114,1) 0%, rgba(163,110,41,1) 100%)",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "40px",
            borderTopRightRadius: "100px",
            borderBottomRightRadius: "100px",
            backgroundColor: "white",
          }}
        ></div>
        <p
          style={{
            height: "max-content",
            fontSize: "1.4rem",
            writingMode: "vertical-rl",
            color: "white",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {item.coupon_text.substring(0, 7)}
        </p>
      </div>
      <div
        style={{
          width: "75%",
          height: "100%",
          padding: "20px",
        }}
      >
        <h3
          style={{
            fontWeight: 600,
            margin: 0,
          }}
        >
          {item.code}
        </h3>
        <p style={{ margin: 0, color: "#00000060", fontWeight: 600 }}>
          Valid till {item.coupon_validity}
        </p>
        <div style={{ display: "flex" }}>
          <Button
            style={{
              backgroundColor: "transparent",
              marginLeft: "auto",
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#A36E29",
            }}
            onClick={() => handleSelectedCoupon()}
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
};

const Cart = () => {
  const couponList_dummy = [
    {
      id: 1,
      coupon_text: "5% Off",
      code: "FEStIV",
      coupon_validity: "31 July 2024",
    },
    {
      id: 2,
      coupon_text: "5% Off",
      code: "FEStIV",
      coupon_validity: "31 July 2024",
    },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [refreshCart, setRefreshCart] = useState(1);
  const [couponList, setCouponList] = useState(couponList_dummy);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(
          `https://api.sadashrijewelkart.com/v1.0.0/user/coupons/all.php?type=all_coupons`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (Array.isArray(data?.response)) setCouponList(data?.response);
      } catch (err) {
        console.log("fetching coupons failed ", err);
      }
    })();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php?user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setCartItems(response.data.response);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, [refreshCart]);

  const moveToWishlistHandler = async (productId, cartId) => {
    const wishlistData = new FormData();
    wishlistData.append("type", "add_item");
    wishlistData.append(
      "wishlist_id",
      localStorage.getItem("default_wishlist")
    );
    wishlistData.append("product_id", productId);

    try {
      await axios.post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php",
        wishlistData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    removeCartItemHandler(cartId);
  };
  const removeCartItemHandler = (cartId) => {
    const token = localStorage.getItem("token");

    axios
      .delete(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { id: cartId },
        }
      )
      .then((response) => {
        setRefreshCart(refreshCart + 1);
      })
      .catch((error) => console.log("Error while removing  card items", error));
  };
  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <Navbar />
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="modal-dialog-overflow"
            style={{ width: "500px", height: "600px", padding: "30px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
                  Apply Coupon
                </p>
                <ModalClose />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  marginTop: "50px",
                }}
              >
                <Input
                  sx={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#F9F5EC",
                    border: 0,
                  }}
                  placeholder="Enter Coupon Code"
                  inputProps={{ "aria-label": "Enter Coupon Code" }}
                  endDecorator={
                    <p style={{ fontWeight: 600, color: "#A36E29" }}>ADD</p>
                  }
                />
              </div>
              <div
                style={{ width: "100%", height: "100%", overflowX: "scroll" }}
              >
                {couponList.map((item) => (
                  <CouponCard
                    item={item}
                    handleClose={setModalOpen}
                    couponSelectHandler={setSelectedCouponId}
                    couponCodeSelector={setSelectedCouponCode}
                  />
                ))}
              </div>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#f5f5f5",
        }}
      >
        {cartItems?.length > 0 ? (
          <Box style={{ width: "70%" }}>
            <Grid container spacing={6}>
              <Grid item xs={8}>
                <Box style={{ height: "60%", marginTop: "6.8%" }}>
                  {cartItems?.map((item) => (
                    <CartItem
                      moveToWishlistHandler={moveToWishlistHandler}
                      key={item.cart_id}
                      item={item}
                      removeHandler={removeCartItemHandler}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={4}>
                <CartTotal
                  selectedCouponCode={selectedCouponCode}
                  selectedCouponId={selectedCouponId}
                  items={cartItems}
                  openModal={setModalOpen}
                  couponData={
                    couponList.filter((item) => item.id === selectedCouponId)[0]
                  }
                  couponList={couponList}
                  setSelectedCouponId={setSelectedCouponId}
                  setSelectedCouponCode={setSelectedCouponCode}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Typography
              variant="h2"
              style={{ fontWeight: "bold", color: "lightgray" }}
            >
              Nothing In the Cart yet !!!
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Cart;
