import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";

import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import Input from "@mui/joy/Input";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Box from "@mui/joy/Box";
import { Button } from "@mui/joy";
import OrderCard from "../my-orders/orderCard.component";

const orders = [
  {
    id: 1,
    imageUrl: "https://picsum.photos/200", // Replace with your image URL
    name: "Diamond Ring",
    arrivalDate: "2024-04-20",
    status: "Processing",
  },
  {
    id: 1,
    imageUrl: "https://picsum.photos/200", // Replace with your image URL
    name: "Gold Ring with Diamond",
    arrivalDate: "2024-04-20",
    status: "Processing",
  },
];

const Orders = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {orders.map((order) => {
        <OrderCard orderData={order} />;
      })}
    </div>
  );
};

export default Orders;
