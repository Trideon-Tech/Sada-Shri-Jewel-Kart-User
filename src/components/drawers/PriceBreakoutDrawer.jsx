import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import axios from "axios";

const PriceBreakoutDrawer = ({ open, onClose, productDetails }) => {
  const [rates, setRates] = useState({});
  const [totalGST, setTotalGST] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const metalInfo =
    productDetails?.customizations?.variants?.options[0]?.metal_info || {};
  const stoneInfo =
    productDetails?.customizations?.variants?.options[0]?.stone_info || {};

  // Fetch live rates
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1.0.0/user/landing.php`)
      .then((res) => {
        setRates(res?.data?.response?.jewellery_inventory || {});
      })
      .catch(() => setRates({}));
  }, []);

  // Calculate total GST + amount
  useEffect(() => {
    const metalRate = rates[metalInfo.quality] || 0;
    const netWt = parseFloat(metalInfo.net_wt_after_wastage || 0);
    const makingCharge = parseFloat(metalInfo.making_charge_amount || 0);
    const hallmark = parseFloat(metalInfo.hallmark_charge || 0);
    const rodium = parseFloat(metalInfo.rodium_charge || 0);
    const stoneAmt = parseFloat(metalInfo.stone_amount || 0);
    const gstPerc = parseFloat(metalInfo.gst_perc || 0);

    const base = netWt * metalRate;
    const gstAmount = (base + makingCharge + hallmark + rodium + stoneAmt) * (gstPerc / 100);

    setTotalGST(gstAmount);
    setTotalAmount(base + makingCharge + hallmark + rodium + stoneAmt + gstAmount);
  }, [rates, productDetails]);

  const getValue = (val, suffix = "") => {
    return val !== undefined && val !== null && val !== ""
      ? `${val}${suffix}`
      : "-";
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "90%", sm: "500px" } } }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
        >
          <Typography variant="h6">
            {productDetails?.name || "Price Breakup"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Gold Details Accordion */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">🥇 Gold Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                {[
                  ["Gross Weight", getValue(metalInfo.gross_wt, " g")],
                  ["Net Weight", getValue(metalInfo.net_wt, " g")],
                  ["Stone Weight", getValue(metalInfo.stone_wt, " g")],
                  ["Metal", getValue(metalInfo.metal)],
                  ["Purity", getValue(metalInfo.display_name)],
                  ["Wastage", getValue(metalInfo.wastage_prec, "%")],
                  ["Net Weight After Wastage", getValue(metalInfo.net_wt_after_wastage, " g")],
                  ["Making Charge", getValue(metalInfo.making_charge_value, "%")],
                  ["Stone Amount", `₹${getValue(metalInfo.stone_amount)}`],
                  ["Hallmark Charge", `₹${getValue(metalInfo.hallmark_charge)}`],
                  ["Rodium Charge", `₹${getValue(metalInfo.rodium_charge)}`],
                  ["GST", getValue(metalInfo.gst_perc, "%")],
                ].map(([label, value], i) => (
                  <Grid item xs={6} key={i}>
                    <Typography
                      fontWeight={500}
                      fontSize="0.9rem"
                      color="text.secondary"
                    >
                      {label}
                    </Typography>
                    <Typography fontSize="1rem" fontWeight={600}>
                      {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Diamond Details */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">💎 Diamond Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                {[
                  ["Pieces", getValue(stoneInfo.pieces)],
                  ["Carat", getValue(stoneInfo.carat)],
                  [
                    "Weight",
                    stoneInfo.pieces && stoneInfo.carat
                      ? `${(
                          parseFloat(stoneInfo.pieces) *
                          parseFloat(stoneInfo.carat) *
                          0.2
                        ).toFixed(2)} g`
                      : "-",
                  ],
                  ["Rate", getValue(stoneInfo.stone_rate, " ₹")],
                  ["GST", getValue(stoneInfo.gst_perc, "%")],
                ].map(([label, value], i) => (
                  <Grid item xs={6} key={i}>
                    <Typography
                      fontWeight={500}
                      fontSize="0.9rem"
                      color="text.secondary"
                    >
                      {label}
                    </Typography>
                    <Typography fontSize="1rem" fontWeight={600}>
                      {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        {/* Totals */}
        <Box>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1rem",
              mb: 1,
            }}
          >
            <span>Total GST</span>
            <span>₹{totalGST.toFixed(2)}</span>
          </Typography>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PriceBreakoutDrawer;
