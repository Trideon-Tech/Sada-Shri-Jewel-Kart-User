import { Box, Button, Paper, Typography, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const HistoryInfo = ({ logData, orderDetail }) => {
  console.log("hhh", logData);
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
              fontSize: "16px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {logData?.order_details[0]?.product_name}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: '"Open Sans", sans-serif',
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
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#00000060",
              fontSize: "14px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            {" "}
            {logData?.created_at}
          </p>
          <p
            style={{
              margin: 0,
              color: "#00000060",
              fontSize: "14px",
              fontFamily: '"Open Sans", sans-serif',
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

  const [transactions, setTransactions] = useState([]);
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
    // if (!sessionStorage.getItem("cart")) {
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
        setTransactions(response?.data?.response);
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
  return (
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
          marginTop: "20px",
          textAlign: "left",
        }}
      >
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.4rem",
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
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.4rem",
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
                  fontFamily: '"Open Sans", sans-serif',
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
                fontFamily: '"Open Sans", sans-serif',
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
                backgroundColor: showDebit ? "#A36E29" : "white",
                color: showDebit ? "white" : "#A36E29",
                border: "2px solid #A36E29",
                fontWeight: 600,
                borderRadius: "10px",
                fontFamily: '"Open Sans", sans-serif',
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
  );
};
export default Wallet;
