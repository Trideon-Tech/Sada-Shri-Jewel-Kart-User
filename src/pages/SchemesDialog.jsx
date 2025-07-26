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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
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
        {/* Accumulation & Metal Details */}
        <Box mb={3}>
          <Typography fontWeight="bold" color="text.primary" mb={1}>
            Scheme Summary
          </Typography>
          <Typography fontSize="0.8rem" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
            *Only 1 type of metal can be redeemed
          </Typography>
          
          {/* Show Total Accumulation and Months Pending below summary when no metal accumulation */}
          {(!scheme?.redemption_details?.accumulated_metal || scheme.redemption_details.accumulated_metal === "[]") && (
            <Box mt={2}>
              <Typography fontSize="0.95rem" color="text.secondary">
                <b>Total Accumulation:</b> {formatAmount(scheme?.total_paid || 0)}
              </Typography>
              {scheme?.scheme_details?.duration && (
                <Typography fontSize="0.95rem" color="text.secondary">
                  <b>Months Pending:</b> {Number(scheme.scheme_details.duration) - Number(scheme.installments_paid)}
                </Typography>
              )}
            </Box>
          )}
          
          {/* Accumulated Metal */}
          {scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" && (
            <Box mt={1}>
              <Typography fontSize="0.95rem" color="text.secondary" mb={1}>
                <b>Accumulated Metal:</b>
              </Typography>
              {(() => {
                let metal = {};
                try {
                  metal = JSON.parse(scheme.redemption_details.accumulated_metal);
                } catch (e) {}
                if (typeof metal === "object" && Object.keys(metal).length > 0) {
                  return (
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', background: '#faf7f2', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                      <Box component="thead" sx={{ background: '#f7e7c4' }}>
                        <Box component="tr">
                          <Box component="th" sx={{ p: 1, fontWeight: 'bold', border: '1px solid #e0cfa0', width: '50%' }}>Metal</Box>
                          <Box component="th" sx={{ p: 1, fontWeight: 'bold', border: '1px solid #e0cfa0', width: '50%' }}>Gross Weight</Box>
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {Object.entries(metal).map(([k, v]) => {
                          // Map metal keys to user-friendly names
                          const metalNameMap = {
                            'gold24': 'Gold | 24KT',
                            'gold22': 'Gold | 22KT',
                            'gold18': 'Gold | 18KT',
                            'gold14': 'Gold | 14KT',
                            'silver': 'Silver'
                          };
                          return (
                            <Box component="tr" key={k}>
                              <Box component="td" sx={{ p: 1, border: '1px solid #e0cfa0', width: '50%' }}>
                                {metalNameMap[k] || k}
                              </Box>
                              <Box component="td" sx={{ p: 1, border: '1px solid #e0cfa0', width: '50%' }}>{Number(v).toFixed(3)}</Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                }
                return null;
              })()}
            </Box>
          )}
        </Box>
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
              <Box width={scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" ? "16.6%" : "25%"}>Transaction ID</Box>
              <Box width={scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" ? "16.6%" : "25%"}>Start Date</Box>
              <Box width={scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" ? "16.6%" : "25%"}>Amount</Box>
              <Box width={scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" ? "16.6%" : "25%"}>Status</Box>
              {scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" && (
                <>
                  <Box width="16.6%">Total Accumulation</Box>
                  <Box width="16.6%">Months Pending</Box>
                </>
              )}
            </Box>

            {transactions.map((txn, index) => (
  <React.Fragment key={txn.id}>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" ? "repeat(6, 1fr)" : "repeat(4, 1fr)",
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
      {scheme?.redemption_details?.accumulated_metal && scheme.redemption_details.accumulated_metal !== "[]" && (
        <>
          <Typography fontSize="0.9rem">
            {formatAmount(scheme?.total_paid || 0)}
          </Typography>
          <Typography fontSize="0.9rem">
            {scheme?.scheme_details?.duration ? (Number(scheme.scheme_details.duration) - Number(scheme.installments_paid)) : 'N/A'}
          </Typography>
        </>
      )}
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