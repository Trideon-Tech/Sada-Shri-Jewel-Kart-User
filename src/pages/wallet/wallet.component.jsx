import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const HistoryInfo = () => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          flex: "none",
          borderRadius: "100px",
          backgroundColor: "#D9D9D9",
        }}
      ></div>
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
          <p style={{ margin: 0, fontSize: "16px" }}>
            {" "}
            <b>Marigold Ring</b>
          </p>
          <p style={{ margin: 0, fontSize: "16px" }}>
            <b>₹ 345</b>
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
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {" "}
            3:45 Pm
          </p>
          <p
            style={{
              margin: 0,
              color: "#00000060",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            <b>Paid against order #1232213121</b>
          </p>
        </div>
      </div>
    </div>
  );
};

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [creditLog, setCreditLog] = useState([]);
  const [debitLog, setDebitLog] = useState([]);
  const [showDebit, setShowDebit] = useState(false);
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
        setTransactions(response.data.response);
        setCreditLog(
          response.data.response.filter(
            (item) => item.transaction_type === "credit"
          )
        );

        setDebitLog(
          response.data.response.filter(
            (item) => item.transaction_type === "debit"
          )
        );
      })
      .catch((error) => console.log("Error while fetching wallet info", error));
  }, []);
  return (
    <Box
      style={{
        width: "100%",
        padding: "1%",
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
          width: "80%",
          margin: "auto",
          textAlign: "left",
          marginTop: "30px",
        }}
      >
        <Typography
          style={{ marginTop: "2.5%", fontSize: "2rem", fontWeight: "bold" }}
        >
          Your Wallet
        </Typography>

        <Paper
          style={{
            width: "90%",
            minHeight: "500px",
            padding: "50px",
            paddingTop: "30px",
          }}
        >
          <div
            style={{
              width: "calc(100% - 70px)",
              height: "300px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "flex-start",
              paddingLeft: "70px",
              background: "linear-gradient(90deg,#A36E29,#E0B872)",
            }}
          >
            <img
              style={{ position: "absolute", marginLeft: "400px" }}
              src={process.env.PUBLIC_URL + "/assets/coins.png"}
            />
            <p
              style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "white",
                margin: 0,
                marginTop: "auto",
              }}
            >
              Available Balance
            </p>
            <p
              style={{
                margin: 0,
                marginBottom: "auto",
                fontSize: "5rem",
                fontWeight: 500,
                color: "white",
              }}
            >
              ₹{debitLog[0]?.balance || 0}
            </p>
          </div>
          <div
            style={{
              width: "100%",
              marginTop: "30px",
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
              }}
              onClick={() => setShowDebit(true)}
            >
              Debit History
            </Button>
          </div>
          <div
            style={{ width: "100%", height: "max-content", minHeight: "300px" }}
          >
            <div
              style={{ width: "100%", display: "flex", alignItems: "center" }}
            >
              <p>Today</p>
              <Divider style={{ width: "90%", marginLeft: "auto" }} />
            </div>

            {showDebit ? debitLog.map((item) => <HistoryInfo />) : ""}
            {!showDebit ? creditLog.map((item) => <HistoryInfo />) : ""}
          </div>
        </Paper>
      </Box>
    </Box>
  );
};
export default Wallet;
