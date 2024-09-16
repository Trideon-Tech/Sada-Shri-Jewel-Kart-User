import { TabPanel } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import {
  Box,
  TextareaAutosize,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../cart/cartItem.component";
import OrderItem from "./orderItem.component";

const Orders = () => {
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState([]);

  const matches = useMediaQuery("(min-width:600px)");
  const STATUS_CREATED = "created";
  const STATUS_COMPLETED = "completed";
  const STATUS_CANCELLED = "cancelled";

  const [openOrdersList, setOpenOrderList] = useState([]);
  const [completedOrdersList, setCompletedOrderList] = useState([]);
  const [cancelledOrdersList, setCancelledOrderList] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    width: 800,
    height: 700,
    backgroundColor: "white",
    p: 4,
  };
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Box
      style={{
        width: "100%",
        paddingRight: matches ? "14%" : "5%",
        maxHeight: "100%",
        overflowY: "scroll",
        display: "flex",
        marginLeft: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            style={{ fontWeight: 700, marginBottom: "50px" }}
          >
            Cancel/Return order
          </Typography>
          <CartItem
            readOnly={true}
            item={openOrdersList?.filter(
              (item) => (item.id === selectedOrderId)[0]
            )}
          />
          <Typography
            id="modal-modal-title"
            variant="p"
            component="h4"
            style={{ marginBottom: "50px" }}
          >
            Cancellation/Return reason
          </Typography>
          <TextareaAutosize
            style={{ width: "100%", height: "250px" }}
          ></TextareaAutosize>
        </Box>
      </Modal>
      <Box
        style={{
          width: "70%",
          margin: "auto",
          textAlign: "left",
        }}
      >
        <Typography
          style={{
            marginTop: "20px",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Orders and Returns
        </Typography>
      </Box>

      <Tabs
        aria-label="tabs"
        defaultValue={0}
        style={{
          width: matches ? "70%" : "100%",
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
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",

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
            {openOrdersList
              .sort(
                (a, b) =>
                  parseInt(b.order_record_id) - parseInt(a.order_record_id)
              )
              .map((order) => (
                <OrderItem
                  orderInfo={order}
                  selectHandler={() => {
                    navigate(
                      `/order-confirmation?order_record_id=${order.order_record_id}`
                    );
                  }}
                  handleCancelOrder={setModalOpen}
                />
              ))}
          </Box>
        </TabPanel>
        <TabPanel value={1} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            {completedOrdersList.map((order) => (
              <OrderItem
                orderInfo={order}
                titleColorType="delivered"
                selectHandler={(id) => {
                  return;
                }}
              />
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={2} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            <Box style={{ width: "100%", height: "100%" }}>
              {cancelledOrdersList.map((order) => (
                <OrderItem
                  orderInfo={order}
                  titleColorType="cancelled"
                  selectHandler={(id) => {
                    return;
                  }}
                />
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
