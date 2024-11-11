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
import { toast, ToastContainer } from "react-toastify";
import { generalToastStyle } from "../../utils/toast.styles";
import OrderItem from "./orderItem.component";

const Orders = () => {
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([
    null,
    null,
    null,
    null,
  ]);

  const matches = useMediaQuery("(min-width:600px)");
  const STATUS_CREATED = "created";
  const STATUS_COMPLETED = "completed";
  const STATUS_CANCELLED = "cancelled";

  const [openOrdersList, setOpenOrderList] = useState([]);
  const [completedOrdersList, setCompletedOrderList] = useState([]);
  const [cancelledOrdersList, setCancelledOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [categories, setCategories] = useState();
  const [reason, setReason] = useState();
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
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
          response.data.response
            .filter(
              (item) =>
                item.shipment_status === "ORDER_CREATED" ||
                item.shipment_status === "SELLER_VERIFIED" ||
                item.shipment_status === "ADMIN_VERIFIED" ||
                item.shipment_status === "ADMIN_RECEIVED" ||
                item.shipment_status === "ADMIN_INSPECTION_FAILED" ||
                item.shipment_status ===
                  "INSPECTION_FAILED_ORDER_RECEIVED_BY_SELLER"
            )
            .sort(
              (a, b) =>
                new Date(b.order_created_date) - new Date(a.order_created_date)
            )
        );
        setCompletedOrderList(
          response.data.response
            .filter(
              (item) =>
                item.shipment_status === "ORDER_DELIVERED" ||
                item.shipment_status === "ORDER_RETURN_REQUEST"
            )
            .sort(
              (a, b) =>
                new Date(b.order_created_date) - new Date(a.order_created_date)
            )
        );
        setCancelledOrderList(
          response.data.response
            .filter((item) => item.shipment_status === "ORDER_CANCELED")
            .sort(
              (a, b) =>
                new Date(b.order_created_date) - new Date(a.order_created_date)
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

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...selectedImages];
        newImages[index] = reader.result;
        setSelectedImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelOrder = () => {
    const formData = new FormData();
    formData.append("type", "order_cancel");
    formData.append("order_detail_id", selectedOrder.order_details_id);
    formData.append("desc", reason);
    formData.append("cancel_files[]", new File([], ""));

    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/orders.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success == 1) {
          toast.success("Order cancelled successfully!", generalToastStyle);
          setOpenConfirmationModal(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "An error occurred",
          generalToastStyle
        );
      });
  };

  const returnOrder = () => {
    const formData = new FormData();
    formData.append("type", "order_returned");
    formData.append("order_detail_id", selectedOrder.order_details_id);
    formData.append("desc", reason);
    selectedImages.forEach((image, index) => {
      if (image) {
        // Convert base64 to blob
        const byteString = atob(image.split(",")[1]);
        const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], `image${index}.jpg`, {
          type: mimeString,
        });
        formData.append("cancel_files[]", file);
      }
    });

    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/orders.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.success == 1) {
          toast.success("Order returned successfully!", generalToastStyle);
          setOpenConfirmationModal(false);
          window.location.reload();
        }
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
      <ToastContainer />
      <Modal
        open={openConfirmationModal}
        onClose={() => {
          setOpenConfirmationModal(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            width: 400,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <Typography
            style={{
              fontWeight: 700,
              marginBottom: "20px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1.2rem",
              textAlign: "center",
            }}
          >
            Are you sure you want to cancel this order?
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <Button
              variant="outlined"
              style={{
                width: "48%",
                fontWeight: "bold",
                border: "2px solid #a36e29",
                color: "#a36e29",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
              onClick={() => {
                setReason("");
                setModalOpen(false);
                setOpenConfirmationModal(false);
              }}
            >
              No, Keep Order
            </Button>
            <Button
              variant="contained"
              style={{
                width: "48%",
                fontWeight: "bold",
                background: "#a36e29",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
              }}
              onClick={() => {
                // Handle cancel order logic here
                setOpenConfirmationModal(false);
                setModalOpen(false);
                selectedOrder?.shipment_status === "ORDER_CREATED" ||
                selectedOrder?.shipment_status === "SELLER_VERIFIED" ||
                selectedOrder?.shipment_status === "ADMIN_VERIFIED" ||
                selectedOrder?.shipment_status === "ADMIN_RECEIVED" ||
                selectedOrder?.shipment_status === "ADMIN_INSPECTION_FAILED" ||
                selectedOrder?.shipment_status ===
                  "INSPECTION_FAILED_ORDER_RECEIVED_BY_SELLER"
                  ? cancelOrder()
                  : returnOrder();
              }}
            >
              {selectedOrder?.shipment_status === "ORDER_CREATED" ||
              selectedOrder?.shipment_status === "SELLER_VERIFIED" ||
              selectedOrder?.shipment_status === "ADMIN_VERIFIED" ||
              selectedOrder?.shipment_status === "ADMIN_RECEIVED" ||
              selectedOrder?.shipment_status === "ADMIN_INSPECTION_FAILED" ||
              selectedOrder?.shipment_status ===
                "INSPECTION_FAILED_ORDER_RECEIVED_BY_SELLER"
                ? "Yes, Cancel Order"
                : "Yes, Return Order"}
            </Button>
          </Box>
        </Box>
      </Modal>
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
            {selectedOrder?.shipment_status === "ORDER_CREATED" ||
            selectedOrder?.shipment_status === "SELLER_VERIFIED" ||
            selectedOrder?.shipment_status === "ADMIN_VERIFIED" ||
            selectedOrder?.shipment_status === "ADMIN_RECEIVED" ||
            selectedOrder?.shipment_status === "ADMIN_INSPECTION_FAILED" ||
            selectedOrder?.shipment_status ===
              "INSPECTION_FAILED_ORDER_RECEIVED_BY_SELLER"
              ? "Cancel order"
              : "Return order"}
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
          {selectedOrder?.shipment_status !== "ORDER_CREATED" ||
          selectedOrder?.shipment_status !== "SELLER_VERIFIED" ||
          selectedOrder?.shipment_status !== "ADMIN_VERIFIED" ||
          selectedOrder?.shipment_status !== "ADMIN_RECEIVED" ||
          selectedOrder?.shipment_status !== "ADMIN_INSPECTION_FAILED" ||
          selectedOrder?.shipment_status !==
            "INSPECTION_FAILED_ORDER_RECEIVED_BY_SELLER" ? (
            <>
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
              <Box
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    style={{
                      height: "100px",
                      width: "100px",
                      border: "1px solid #e7e7e7",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      style={{
                        opacity: 0,
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    />
                    {selectedImages[index] ? (
                      <img
                        src={selectedImages[index]}
                        alt={`Selected ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <AddPhotoAlternateOutlined />
                    )}
                  </div>
                ))}
              </Box>
            </>
          ) : null}
          <TextareaAutosize
            style={{
              width: "100%",
              height: "100px",
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: "0.8rem",
              borderColor: "#e7e7e7",
              marginBottom: "20px",
              borderRadius: "5px",
              padding: "10px",
              "&:focus": {
                borderColor: "#a36e29",
                outline: "none",
                boxShadow: "0 0 0 2px rgba(163,110,41,0.2)",
              },
              "&:hover": {
                borderColor: "#a36e29",
              },
              "&:active": {
                borderColor: "#a36e29",
              },
              "&:selected": {
                borderColor: "#a36e29",
              },
            }}
            placeholder=" Type your message here!"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
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
              onClick={() => {
                console.log(reason);
                setOpenConfirmationModal(true);
              }}
            >
              {selectedOrder?.shipment_status === "ORDER_CREATED" ||
              selectedOrder?.shipment_status === "SELLER_VERIFIED" ||
              selectedOrder?.shipment_status === "ADMIN_VERIFIED" ||
              selectedOrder?.shipment_status === "ADMIN_RECEIVED" ||
              selectedOrder?.shipment_status === "ADMIN_INSPECTION_FAILED" ||
              selectedOrder?.shipment_status ===
                "INSPECTION_FAILED_ORDER_RECEIVED_BY_SELLER"
                ? "Cancel Order"
                : "Return Order"}
            </Button>
          </div>
        </Box>
      </Modal>
      <Box
        style={{
          width: "70%",
          margin: "auto",
          textAlign: "left",
          marginTop: "50px",
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
          <Tab disableIndicator>Cancelled/Returned</Tab>
        </TabList>
        <TabPanel value={0} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            {openOrdersList.map((order) => (
              <OrderItem
                orderInfo={order}
                selectHandler={() => {
                  navigate(
                    `/order-confirmation?order_record_id=${order.order_record_id}`
                  );
                }}
                handleCancelOrder={() => {
                  setSelectedOrder(order);
                  setModalOpen(true);
                }}
                writeReview={() => writeReview(order)}
                handleReturnOrder={() => {
                  setSelectedOrder(order);
                  setModalOpen(true);
                }}
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
                selectHandler={() => {
                  navigate(
                    `/order-confirmation?order_record_id=${order.order_record_id}`
                  );
                }}
                handleReturnOrder={() => {
                  setSelectedOrder(order);
                  setModalOpen(true);
                }}
                writeReview={() => writeReview(order)}
                handleCancelOrder={() => {
                  setSelectedOrder(order);
                  setModalOpen(true);
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
