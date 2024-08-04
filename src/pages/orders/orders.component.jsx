import { Box, Button, Card, Typography } from "@mui/material";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import OrderItem from "./orderItem.component";
import { TabPanel } from "@mui/joy";
import { useEffect, useState } from "react";
import axios from "axios";
const Orders = () => {
  const [orderList, setOrderList] = useState([]);

  const STATUS_CREATED = "created";
  const STATUS_COMPLETED = "completed";
  const STATUS_CANCELLED = "cancelled";

  const [openOrdersList, setOpenOrderList] = useState([]);
  const [completedOrdersList, setCompletedOrderList] = useState([]);
  const [cancelledOrdersList, setCancelledOrderList] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // if (!sessionStorage.getItem("cart")) {
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/orders.php?type=all_orders&user_id=${localStorage.getItem(
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
        console.log("orders", response.data.response);
        setOrderList(response.data.response);
        setOpenOrderList(
          response.data.response.filter(
            (item) => item.status === STATUS_CREATED
          )
        );
        setCompletedOrderList(
          response.data.response.filter(
            (item) => item.status === STATUS_COMPLETED
          )
        );
        setCancelledOrderList(
          response.data.response.filter(
            (item) => item.status === STATUS_CANCELLED
          )
        );
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, []);

  return (
    <Box
      style={{
        width: "100%",
        padding: "1%",
        paddingRight: "14%",
        maxHeight: "100%",
        height: "max-content",
        overflowY: "scroll",
        display: "flex",
        marginLeft: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box
        style={{
          width: "70%",
          margin: "auto",
          textAlign: "left",
          marginTop: "30px",
        }}
      >
        <Typography
          style={{ marginTop: "2.5%", fontSize: "2rem", fontWeight: "bold" }}
        >
          Orders and Returns
        </Typography>
      </Box>

      <Tabs
        aria-label="tabs"
        defaultValue={0}
        style={{
          width: "70%",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "auto",
        }}
      >
        <TabList
          sx={{
            p: 0,
            gap: 0,
            borderRadius: "5px",
            width: "max-content",
            border: "1px solid #a7a7a7",
            bgcolor: "#f7f7f7",
            color: "#00000090",
            fontWeight: "bold",

            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: "sm",
              border: "2px solid #a36e29",
              bgcolor: "white",
              color: "#a36e29",
              fontWeight: "bold",
            },
          }}
        >
          <Tab disableIndicator>In Progress</Tab>
          <Tab disableIndicator>Completed</Tab>
          <Tab disableIndicator>Cancelled</Tab>
        </TabList>
        <TabPanel value={0} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            {openOrdersList.map((order) => (
              <OrderItem orderInfo={order} />
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={1} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            {completedOrdersList.map((order) => (
              <OrderItem orderInfo={order} titleColorType="delivered" />
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={2} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            <Box style={{ width: "100%", height: "100%" }}>
              {cancelledOrdersList.map((order) => (
                <OrderItem orderInfo={order} titleColorType="cancelled" />
              ))}
            </Box>
          </Box>
        </TabPanel>
      </Tabs>
      {/* <OrderItem />
        <OrderItem />
        <OrderItem />
        <OrderItem /> */}
    </Box>
  );
};
export default Orders;
