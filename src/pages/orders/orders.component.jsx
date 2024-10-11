import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import { TabPanel } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Card,
  TextareaAutosize,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [selectedOrder, setSelectedOrder] = useState();
  const [categories, setCategories] = useState();

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
    borderRadius: "10px",

    width: 800,
    height: 780,
    backgroundColor: "white",
    p: 4,
  };

  const [modalOpen, setModalOpen] = useState(false);

  const writeReview = (item) => {
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
      .then((response) => {
        setCategories(response.data.response.categories);

        navigate(
          `/item/${
            response.data.response.categories.find(
              (c) => c.id === item.product_categories
            )["name"]
          }/${item["product_name"]}-${item["product_hash"]}?drawer=open`
        );
      });
  };

  return matches ? (
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
      >
        <Box sx={style}>
          <Typography
            style={{
              fontWeight: 700,
              marginBottom: "20px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1.2rem",
            }}
          >
            Cancel/Return order
          </Typography>
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
              {selectedOrder?.images ? (
                <img
                  src={`https://api.sadashrijewelkart.com/assets/${selectedOrder?.images[0]?.file}`}
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
                {selectedOrder?.product_name}
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
                {parseFloat(selectedOrder?.price).toLocaleString()}
              </Typography>
            </Box>
          </Card>
          <Typography
            style={{
              marginBottom: "20px",
              fontWeight: "bold",
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: "1rem",
            }}
          >
            Cancellation/Return reason
          </Typography>
          <div
            style={{
              height: "100px",
              width: "100px",
              border: "1px solid #e7e7e7",
              marginBottom: "20px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <AddPhotoAlternateOutlined />
          </div>
          <TextareaAutosize
            style={{
              width: "100%",
              height: "250px",
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: "0.8rem",
              borderColor: "#e7e7e7",
              marginBottom: "20px",
            }}
            placeholder=" Type your message here!"
          ></TextareaAutosize>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              style={{
                width: "32%",
                fontWeight: "bold",
                background: "#a36e29",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              Track Order
            </Button>
          </div>
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
                  handleCancelOrder={() => {
                    console.log(order.order_record_id);
                    setSelectedOrder(order);
                    setModalOpen(true);
                  }}
                  writeReview={() => writeReview(order)}
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
    </Box>
  ) : (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          width: "90%",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          height: "90%",
        }}
      >
        <Box
          style={{
            width: "90%",
            marginBottom: "20px",
            marginTop: "20px",
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
            width: "90%",
            margin: "auto",
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
            <Box
              style={{
                width: "95%",
                height: "100%",
              }}
            >
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
                    handleCancelOrder={() => {
                      console.log(order.order_record_id);
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}
                    writeReview={() => writeReview(order)}
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
      </Box>
      {!matches ? (
        <BottomNavigation
          showLabels
          style={{
            background: "rgba(163,110,41,0.08)",
            marginTop: "auto",
            border: "1px solid #a36e29",
            borderRadius: "50px",
            height: "40px",
          }}
        >
          <BottomNavigationAction
            label="Profile"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account")}
          />
          <BottomNavigationAction
            label="Orders"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "#a36e29",
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/my-account/orders")}
          />
          <BottomNavigationAction
            label="Address"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/address")}
          />
          <BottomNavigationAction
            label="Wallet"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/wallet")}
          />
        </BottomNavigation>
      ) : null}
    </div>
  );
};
export default Orders;
