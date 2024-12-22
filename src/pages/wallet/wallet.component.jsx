import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HistoryInfo = ({ logData, _ }) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <div
      style={{
        width: "100%",
        minHeight: "90px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "max-content",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "95%",
            height: "max-content",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {logData?.order_details[0]?.product_name}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
            }}
          >
            <b>₹ {logData?.amount}</b>
          </p>
        </div>
        <div
          style={{
            width: "95%",
            height: "max-content",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: matches ? "row" : "column ",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#00000060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            {" "}
            {Date(logData?.updated_at).toLocaleString()}
          </p>
          <p
            style={{
              margin: 0,
              color: "#00000060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            Paid against order #{logData.order_details[0].public_id}
          </p>
        </div>
      </div>
    </div>
  );
};

const Wallet = () => {
  const matches = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [creditLog, setCreditLog] = useState([]);
  const [debitLog, setDebitLog] = useState([]);
  const [showDebit, setShowDebit] = useState(false);

  const [orderList, setOrderList] = useState([]);

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
        console.log("orders", response?.data?.response);
        setOrderList(response?.data?.response);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/wallet.php?type=wallet&user_id=${localStorage.getItem(
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
        console.log("wallet", response);
        setCreditLog(
          response?.data?.response?.filter(
            (item) => item.transaction_type === "credit"
          )
        );

        setDebitLog(
          response.data.response.filter(
            (item) => item.transaction_type === "debit"
          )
        );
        console.log("creditLog", creditLog);
      })
      .catch((error) => console.log("Error while fetching wallet info", error));
  }, []);

  return matches ? (
    <Box
      style={{
        width: "100%",
        height: "100%",
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
          width: matches ? "80%" : "100%",
          margin: "auto",
          marginTop: "50px",
          textAlign: "left",
        }}
      >
        <Typography
          style={{
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.2rem",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Wallet
        </Typography>

        <Paper
          style={{
            width: matches ? "90%" : "95%",
            minHeight: "500px",
            padding: matches ? "50px" : "10px",
            paddingTop: "30px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "calc(100% - 70px)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              paddingLeft: "70px",
              background: "linear-gradient(90deg,#A36E29,#E0B872)",
            }}
          >
            <div
              style={{
                width: "300px",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                Available Balance
              </p>
              <p
                style={{
                  margin: 0,
                  marginBottom: "auto",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "5rem",
                  fontWeight: 500,
                  color: "white",
                }}
              >
                ₹{creditLog[0]?.balance}
              </p>
            </div>
            {matches ? (
              <img
                alt="coins"
                style={{
                  marginRight: 0,
                  marginLeft: "auto",
                  marginTop: "auto",
                }}
                src={process.env.PUBLIC_URL + "/assets/coins.png"}
              />
            ) : null}
          </div>
          <div
            style={{
              width: "100%",
              marginTop: "30px",
              marginBottom: "30px",
              height: "max-content",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Button
              style={{
                width: "300px",
                height: "50px",
                background:
                  !showDebit
                    ? "linear-gradient(to right, #d4a76a, #a36e29)"
                    : "white",
                color: !showDebit ? "white" : "#A36E29",
                border: "2px solid #A36E29",
                fontWeight: 600,
                borderRadius: "10px",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1rem",
              }}
              onClick={() => setShowDebit(false)}
            >
              Credit History
            </Button>

            <Button
              style={{
                marginLeft: "20px",
                width: "300px",
                height: "50px",
                background:
                  showDebit
                    ? "linear-gradient(to right, #d4a76a, #a36e29)"
                    : "white",
                color: showDebit ? "white" : "#A36E29",
                border: "2px solid #A36E29",
                fontWeight: 600,
                borderRadius: "10px",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1rem",
              }}
              onClick={() => setShowDebit(true)}
            >
              Debit History
            </Button>
          </div>
          <div style={{ width: "100%", height: "max-content" }}>
            {showDebit
              ? debitLog.map((item) => (
                  <HistoryInfo
                    logData={item}
                    orderDetail={
                      orderList.filter(
                        (order) => order.id === item.order_record_id
                      )[0]
                    }
                  />
                ))
              : ""}
            {!showDebit
              ? creditLog.map((item) => (
                  <HistoryInfo
                    logData={item}
                    orderDetail={
                      orderList.filter(
                        (order) => order.id === item.order_record_id
                      )[0]
                    }
                  />
                ))
              : ""}
          </div>
        </Paper>
      </Box>
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
        marginTop: "calc(10px + 2vh)",
        position: "relative",
        paddingBottom: !matches ? "80px" : "0",
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
          height: "85%",
          marginBottom: "30px",
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
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Wallet
          </Typography>
          <Paper
            style={{
              width: "95%",
              minHeight: "500px",
              padding: matches ? "50px" : "10px",
              paddingTop: "20px",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "93%",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-start",
                paddingLeft: "20px",
                background: "linear-gradient(90deg,#A36E29,#E0B872)",
              }}
            >
              <div
                style={{
                  width: "300px",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: matches ? "1.4rem" : "1.2rem",
                    fontWeight: 600,
                    color: "white",
                    paddingTop: "20px",
                  }}
                >
                  Available Balance
                </div>
                <div
                  style={{
                    margin: 0,
                    marginBottom: "auto",
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: matches ? "5rem" : "3rem",
                    fontWeight: 500,
                    color: "white",
                  }}
                >
                  ₹{creditLog[0]?.balance}
                </div>
              </div>
              {matches ? (
                <img
                  style={{
                    marginRight: 0,
                    marginLeft: "auto",
                    marginTop: "auto",
                  }}
                  src={process.env.PUBLIC_URL + "/assets/coins.png"}
                />
              ) : null}
            </div>
            <div
              style={{
                width: "100%",
                marginTop: "30px",
                marginBottom: "30px",
                height: "max-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Button
                style={{
                  width: "300px",
                  height: "50px",
                  backgroundColor: !showDebit ? "#A36E29" : "white",
                  color: !showDebit ? "white" : "#A36E29",
                  border: "2px solid #A36E29",
                  fontWeight: 600,
                  borderRadius: "10px",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: matches ? "1rem" : "0.8rem",
                }}
                onClick={() => setShowDebit(false)}
              >
                Credit History
              </Button>

              <Button
                style={{
                  marginLeft: "20px",
                  width: "300px",
                  height: "50px",
                  backgroundColor: showDebit ? "#A36E29" : "white",
                  color: showDebit ? "white" : "#A36E29",
                  border: "2px solid #A36E29",
                  fontWeight: 600,
                  borderRadius: "10px",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: matches ? "1rem" : "0.8rem",
                }}
                onClick={() => setShowDebit(true)}
              >
                Debit History
              </Button>
            </div>
            <div style={{ width: "100%", height: "max-content" }}>
              {showDebit
                ? debitLog.map((item) => (
                    <HistoryInfo
                      logData={item}
                      orderDetail={
                        orderList.filter(
                          (order) => order.id === item.order_record_id
                        )[0]
                      }
                    />
                  ))
                : ""}
              {!showDebit
                ? creditLog.map((item) => (
                    <HistoryInfo
                      logData={item}
                      orderDetail={
                        orderList.filter(
                          (order) => order.id === item.order_record_id
                        )[0]
                      }
                    />
                  ))
                : ""}
            </div>
          </Paper>
        </Box>
      </Box>
      {!matches ? (
        <BottomNavigation
          showLabels
          style={{
            background: "rgba(163,110,41)",
            border: "1px solid #a36e29",
            borderRadius: "50px",
            height: "40px",
            width: "90%",
            position: "fixed",
            bottom: 20,
            zIndex: 1000,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <BottomNavigationAction
            label="Profile"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account")}
          />
          <BottomNavigationAction
            label="Orders"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/orders")}
          />
          <BottomNavigationAction
            label="Address"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/address")}
          />
          <BottomNavigationAction
            label="Wallet"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "white",
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/my-account/wallet")}
          />
        </BottomNavigation>
      ) : null}
    </div>
  );
};
export default Wallet;
