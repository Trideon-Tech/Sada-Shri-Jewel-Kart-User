import { Close } from "@mui/icons-material";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import { Box, Card, Grid, TextField, useMediaQuery } from "@mui/material";
import axios from "axios";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/navbar/navbar.component";
import CartItem from "./cartItem.component";
import CartTotal from "./cartTotal.component";
import emptyCartAnimation from "./empty_cart.json";

const CouponCard = ({
  item,
  handleClose,
  couponSelectHandler,
  couponCodeSelector,
}) => {
  const handleSelectedCoupon = () => {
    handleClose(false);
    couponSelectHandler(item.id);
    couponCodeSelector(item.code);
  };

  return (
    <Card
      elevation={1}
      sx={{
        marginTop: "20px",
        height: "100px",
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
            color: "white",
            textAlign: "center",
            fontWeight: 600,
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.2rem",
            transform: "rotate(270deg)",
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
        <div
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          {item.code}
        </div>
        <p
          style={{
            margin: 0,
            color: "#00000060",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >
          Valid till {item.coupon_validity}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            cursor: "pointer",
            backgroundColor: "transparent",
            fontWeight: "bold",
            color: "#A36E29",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
          }}
          onClick={() => handleSelectedCoupon()}
        >
          APPLY
        </div>
      </div>
    </Card>
  );
};

const Cart = () => {
  const navigate = useNavigate();
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

  const matches = useMediaQuery("(min-width:600px)");

  const [cartItems, setCartItems] = useState([]);
  const [refreshCart, setRefreshCart] = useState(1);
  const [couponList, setCouponList] = useState(couponList_dummy);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");

  const getWishListItemsNonAuth = async () => {
    const cartListExists = localStorage.getItem("cart_list");
    console.log(cartListExists, "cartListExists================");
    if (cartListExists && cartListExists.length > 0) {
      const cartListItems = cartListExists.split(",");
      console.log(cartListItems, "cartListItems================");
      const detailsList = [];
      for (let item of cartListItems) {
        if (item.length > 0) {
          const { data } = await axios.get(
            `https://api.sadashrijewelkart.com/v1.0.0/user/products/details.php?type=product_details_on_id&user_id=-1&product_id=${item}`
          );
          console.log(data);
          detailsList.push(data?.response);
        }
      }
      setCartItems(detailsList);
    }
  };

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
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        await getWishListItemsNonAuth();
        return;
      }
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
          setCartItems(response?.data?.response);
        })
        .catch((error) =>
          console.log("Error while fetching cart items", error)
        );
    })();
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
    <div style={{ width: "100vw", height: "100vh", overflowX: "none" }}>
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
            style={{ width: "450px", height: "600px", padding: "30px" }}
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
                <p
                  style={{
                    fontSize: "1.2rem",
                    fontFamily: '"Open Sans", sans-serif',
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  Apply Coupon
                </p>
                <Close
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setModalOpen(false);
                  }}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  marginTop: "30px",
                }}
              >
                <TextField
                  sx={{
                    width: "100%",
                    "& input": {
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      backgroundColor: "#f9f5ec",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#a36e29",
                      },
                    },
                  }}
                  placeholder="Enter Coupon Code"
                  InputProps={{
                    endAdornment: (
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.8rem",
                          color: "#A36E29",
                          fontWeight: "bold",
                          paddingLeft: "10px",
                          cursor: "pointer",
                        }}
                      >
                        ADD
                      </div>
                    ),
                  }}
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
          overflowX: "hidden",
          backgroundColor:
            cartItems?.length > 0 ? "rgba(163,110,41,0.08)" : "white",
        }}
      >
        {cartItems?.length > 0 ? (
          <Box style={{ width: "65%" }}>
            <Grid container spacing={6}>
              <Grid item xs={matches ? 8 : 12}>
                <Box style={{ height: "60%", marginTop: "2rem" }}>
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
              <Grid item xs={matches ? 4 : 12}>
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: "white",
              width: "100vw",
              height: "300px",
            }}
          >
            <Lottie animationData={emptyCartAnimation} loop={true} />
            <div
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              There's nothing here!
            </div>
            <div
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1rem",
                marginTop: "10px",
              }}
            >
              Let's do some retail therapy.
            </div>
            <div
              onClick={() => navigate("/")}
              style={{
                width: "325px",
                padding: "10px",
                fontWeight: "bold",
                background:
                  "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1rem",
                fontWeight: "bold",
                marginTop: "20px",
                textAlign: "center",
                color: "white",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </div>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Cart;
