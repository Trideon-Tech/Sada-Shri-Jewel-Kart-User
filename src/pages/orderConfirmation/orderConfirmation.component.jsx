import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar.component";
import { Button, Paper } from "@mui/material";
import CartItem from "../cart/cartItem.component";
import { useNavigate } from "react-router-dom";

const productData = {
  id: "7",
  name: "Margerit Splendid Diamond Band",
  hash: "D2A3F7",
  description:
    '<p><span style="color: rgb(79, 50, 103);">Set in 14 KT Rose Gold(1.230 g) with diamonds (0.100 ct ,IJ-SI)</span></p>',
  category: "Rings",
  sub_category: "Engagement",
  price: "16827",
  cart_id: "7",
  customization_applied: true,
  customization: {
    fields: ["Choice Of Metal", "Diamond Quality", "Select Size"],
    variant: [
      {
        id: "1",
        created_at: "2024-02-04 06:17:00",
        updated_at: "0000-00-00 00:00:00",
        product: "7",
        for_customization_options: ["14 KT Rose Gold", "GH-SI", "5 / 44.8mm"],
        price: "18266",
        made_on_order: "1",
        for_customization_fields: [
          "Choice Of Metal",
          "Diamond Quality",
          "Select Size",
        ],
      },
    ],
  },
  images: [
    {
      id: "19",
      created_at: "2024-02-04 06:17:00",
      updated_at: "0000-00-00 00:00:00",
      product: "7",
      is_primary: "0",
      type: "img",
      file: "company/NewJwellers/products/webp/Margerit Splendid Diamond Band-1707027420.webp",
    },
    {
      id: "20",
      created_at: "2024-02-04 06:17:00",
      updated_at: "0000-00-00 00:00:00",
      product: "7",
      is_primary: "0",
      type: "img",
      file: "company/NewJwellers/products/webp/Margerit Splendid Diamond Band-1707027420.webp",
    },
    {
      id: "21",
      created_at: "2024-02-04 06:17:00",
      updated_at: "0000-00-00 00:00:00",
      product: "7",
      is_primary: "0",
      type: "img",
      file: "company/NewJwellers/products/webp/Margerit Splendid Diamond Band-1707027420.webp",
    },
  ],
};

const OrderConfirmation3 = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F8F8F8",
        display: "flex",
        paddingTop: "100px",
        justifyContent: "center",
      }}
    >
      <Navbar />
    </div>
  );
};

const OrderConfirmation = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F8F8F8",
        display: "flex",
        paddingTop: "100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Navbar />
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#F8F8F8",
          display: "flex",
          paddingTop: "100px",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "70%", height: "100%" }}>
          <div
            style={{
              width: "100%",
              height: "max-content",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: "2rem", fontWeight: 600 }}>
              Thanks you for your order #1232143545
            </p>
            <Button
              style={{
                borderRadius: "10px",
                border: "2px solid #a36e29",
                width: "200px",
                backgroundColor: "white",
                height: "57px",
                color: "#a36e29",
              }}
              onClick={() => navigate("/jwellery/Rings/1/false")}
            >
              Continue Shopping
            </Button>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <p style={{ fontSize: "2rem" }}>
              Congratulations you have received ₹
              <span style={{ fontWeight: 600, color: "#a36e29" }}>345</span> in
              your wallet{" "}
            </p>
          </div>
          <div
            style={{
              width: "100%",
              height: "max-content",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60%",
                height: "max-content",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    height: "max-content",
                    textAlign: "left",
                  }}
                >
                  <p style={{ fontWeight: 600, color: "gray" }}>Order Placed</p>
                  <p style={{ fontWeight: 600 }}>Value Shipping</p>
                  <p style={{ fontWeight: 600 }}>Arriving By 7th May 10</p>
                  <p style={{ fontWeight: 600, color: "gray" }}>
                    Sold by Sada Shri Jewel Kart
                  </p>
                  <p style={{ fontWeight: 600, color: "gray" }}>
                    Order #1234562343567
                  </p>
                </div>
                <div
                  style={{
                    width: "50%",
                    height: "max-content",
                    textAlign: "left",
                  }}
                >
                  <p style={{ fontWeight: 600, color: "gray" }}>
                    Shipping Address
                  </p>
                  <p style={{ fontWeight: 600, color: "gray" }}>JP Singh</p>
                  <p style={{ width: "200px", fontWeight: 600, color: "gray" }}>
                    92, South Park Street, Bangalore, India-843212
                    xyz@gmail.com +91-7250516843
                  </p>
                  <p style={{ fontWeight: 600, color: "gray" }}>Order Placed</p>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  minHeight: "200px",
                }}
              >
                <CartItem
                  moveToWishlistHandler={() => {}}
                  key={"someId"}
                  item={productData}
                  removeHandler={() => {}}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Paper
                  style={{
                    width: "35%",
                    minHeight: "300px",
                    borderRadius: "5px",
                    padding: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                  elevation={5}
                >
                  <p style={{ fontWeight: 600, textAlign: "left" }}>
                    Order Summary
                  </p>
                </Paper>
                <Paper
                  style={{
                    width: "35%",
                    minHeight: "300px",
                    borderRadius: "5px",
                    padding: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                  elevation={5}
                >
                  <p style={{ fontWeight: 600, textAlign: "left" }}>
                    Billing Address
                  </p>
                </Paper>
              </div>
            </div>
            <div
              style={{
                width: "40%",
                height: "max-content",
                minHeight: "100px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderConfirmation1 = () => {
  //   useState();
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F8F8F8",
        display: "flex",
        paddingTop: "100px",
        justifyContent: "center",
      }}
    >
      <Navbar />
      <div style={{ width: "70%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "max-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "2rem", fontWeight: 600 }}>
            Thanks you for your order #1232143545
          </p>
          <Button
            style={{
              borderRadius: "10px",
              border: "2px solid #a36e29",
              width: "200px",
              backgroundColor: "white",
              height: "57px",
              color: "#a36e29",
            }}
          >
            Continue Shopping
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <p style={{ fontSize: "2rem" }}>
            Congratulations you have received{" "}
            <span style={{ fontWeight: 600, color: "#a36e29" }}>345</span> in
            your wallet{" "}
          </p>
        </div>
        <div
          style={{
            width: "100%",
            height: "max-content",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "60%",
              height: "max-content",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{ width: "50%", height: "max-content", textAlign: "left" }}
            >
              <p style={{ fontWeight: 600, color: "gray" }}>Order Placed</p>
              <p style={{ fontWeight: 600 }}>Value Shipping</p>
              <p style={{ fontWeight: 600 }}>Arriving By 7th May 10</p>
              <p style={{ fontWeight: 600, color: "gray" }}>
                Sold by Sada Shri Jewel Kart
              </p>
              <p style={{ fontWeight: 600, color: "gray" }}>
                Order #1234562343567
              </p>
            </div>
            <div
              style={{ width: "50%", height: "max-content", textAlign: "left" }}
            >
              <p style={{ fontWeight: 600, color: "gray" }}>Shipping Address</p>
              <p style={{ fontWeight: 600, color: "gray" }}>JP Singh</p>
              <p style={{ width: "200px", fontWeight: 600, color: "gray" }}>
                92, South Park Street, Bangalore, India-843212
                xyz@gmail.com +91-7250516843
              </p>
              <p>Order Placed</p>
            </div>
          </div>
          <div>
            <CartItem
              moveToWishlistHandler={() => {}}
              key={"someId"}
              item={{ name: "Diamond Jewellery" }}
              removeHandler={() => {}}
            />
          </div>

          <div style={{ width: "40%", height: "max-content" }}></div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
