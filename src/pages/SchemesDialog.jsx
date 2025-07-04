import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import dayjs from "dayjs";

function SchemesDialog({ open, onClose, scheme }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const subscriptionId = scheme?.id;

  useEffect(() => {
    if (!open || !subscriptionId) return;

    const token = localStorage.getItem("token");
    setLoading(true);

    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/schemes/transactions.php?subscription=${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const data = res.data?.response || [];
        setTransactions(data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch transactions", err);
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, [open, subscriptionId]);

  const formatDate = (raw) => dayjs(raw).format("DD/MM/YYYY [at] h:mmA");
  const formatAmount = (amt) => `Rs. ${Number(amt).toLocaleString()}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ paddingLeft: 4 }}>
            <Typography fontWeight="bold">
              {scheme?.scheme_name || "Scheme Name"}
            </Typography>
            <Typography fontSize="0.9rem" color="text.secondary">
              {scheme?.start_date || "Start Date"} - {scheme?.exp_closure_date || "Maturity Date"}
            </Typography>
          </Box>

          <Box textAlign="right">
            <Typography>
              <b>Status:</b>{" "}
              <Chip
                label={scheme?.status || "In Progress"}
                size="small"
                sx={{ backgroundColor: "#F7941D", color: "white", fontWeight: "bold" }}
              />
            </Typography>
            <Typography>
              <b>Total Payment:</b> {formatAmount(scheme?.total_paid || 0)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, left: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography fontWeight="bold" mb={2}>
          Payment History
        </Typography>

        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              p: 2,
              overflowX: "auto",
              bgcolor: "#fff",
            }}
          >
            <Box display="flex" fontWeight="bold" mb={1}>
              <Box width="25%">Transaction ID</Box>
              <Box width="25%">Date of Installment</Box>
              <Box width="25%">Amount</Box>
              <Box width="25%">Status</Box>
            </Box>

            {transactions.map((txn, index) => (
  <React.Fragment key={txn.id}>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        p: "10px 0",
        alignItems: "center",
      }}
    >
      <Typography fontSize="0.9rem">{txn.rzp_payment_id}</Typography>
      <Typography fontSize="0.9rem">
        {dayjs(txn.created_at).format("DD/MM/YYYY [at] h:mmA")}
      </Typography>
      <Typography fontSize="0.9rem">
        Rs. {parseInt(txn.amount).toLocaleString()}
      </Typography>
      <Typography
        fontSize="0.9rem"
        sx={{ color: txn.status === "completed" ? "green" : "gray" }}
      >
        ● {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
      </Typography>
    </Box>
    {index < transactions.length - 1 && <Divider />}
  </React.Fragment>
))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SchemesDialog;