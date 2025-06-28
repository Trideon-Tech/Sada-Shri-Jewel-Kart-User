import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  TextField,
  Paper,
} from "@mui/material";

const RedeemSchemeDialog = ({ open, onClose, productDetail }) => {
  const [benefitAmount, setBenefitAmount] = useState(0);
  const [rates, setRates] = useState({});
  const [metalAmount, setMetalAmount] = useState(0);
  const [stoneAmount, setStoneAmount] = useState(0);
  const [makingCharges, setMakingCharges] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [gstPerc, setGstPerc] = useState(0);
  const [hallmarkCharge, setHallmarkCharge] = useState(0);
  const [rodiumCharge, setRodiumCharge] = useState(0);

  const productId = productDetail?.id || 583;
  const jwtToken = localStorage.getItem("token");

  const metalInfo = productDetail?.customizations?.variants?.options?.[0]?.metal_info || {};
  const stoneInfo = productDetail?.customizations?.variants?.options?.[0]?.stone_info || {};
console.log("🧪 Rate for", metalInfo.quality, "=", rates[metalInfo.quality]);
console.log("📦 Metal Info:", metalInfo);


  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1.0.0/user/landing.php`)
      .then((res) => res.json())
      .then((data) => {
        setRates(data?.response?.jewellery_inventory || {});
      })
      .catch((err) => {
        console.error("Failed to fetch rates", err);
        setRates({});
      });
  }, []);

  useEffect(() => {
    if (open && productId) {
      fetch(
        `https://api.sadashrijewelkart.com/v1.0.0/user/schemes/benefits.php?product=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.response?.length > 0) {
            const benefit = parseFloat(data.response[0].benefit || "0");
            setBenefitAmount(benefit);
          } else {
            setBenefitAmount(0);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch benefit amount", err);
          setBenefitAmount(0);
        });
    }
  }, [open, productId, jwtToken]);

  useEffect(() => {
    if (!metalInfo || !rates || !metalInfo.quality) return;

    const rate = rates[metalInfo.quality] || 0;
    const grossWt = parseFloat(metalInfo.gross_wt || 0);
    const stoneWt = parseFloat(metalInfo.stone_wt || 0);
    const netWeight = grossWt - stoneWt;
    const wastagePerc = parseFloat(metalInfo.wastage_prec || 0);
    const wastageWeight = netWeight * (wastagePerc / 100);
    const netWeightAfterWastage = netWeight + wastageWeight;

    const baseMetalAmount = netWeightAfterWastage * rate;
    const makingChargeValue = parseFloat(metalInfo.making_charge_value || 0);
    const makingChargeAmount = (baseMetalAmount * makingChargeValue) / 100;
    const hallmark = parseFloat(metalInfo.hallmark_charge || 0);
    const rodium = parseFloat(metalInfo.rodium_charge || 0);
    const stoneAmt = parseFloat(metalInfo.stone_amount || 0);
    const gstPercent = parseFloat(metalInfo.gst_perc || 0);

    const gstBase =
      baseMetalAmount + makingChargeAmount + hallmark + rodium + stoneAmt;
    const gstFinal = (gstBase * gstPercent) / 100;

    setMetalAmount(baseMetalAmount);
    setStoneAmount(stoneAmt);
    setMakingCharges(makingChargeAmount);
    setHallmarkCharge(hallmark);
    setRodiumCharge(rodium);
    setGstAmount(gstFinal);
    setGstPerc(gstPercent);
  }, [metalInfo, rates]);

  const schemes = [
    { id: "SCH001", name: "Scheme Name", value: "₹80000", disabled: false },
    { id: "SCH002", name: "Scheme Name", value: "Save ₹800", disabled: true },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box p={2}>
        <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
          Redeem My Schemes
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          px={2}
          py={1}
          borderBottom="1px solid #e0e0e0"
        >
          <Typography>
            Selected Product: <strong>Gold Ring</strong>
          </Typography>
          <Typography>
            Product Value: <strong>₹ 56,986</strong>
          </Typography>
          <Typography>
            Current Value: <strong>₹ 56,986</strong>
          </Typography>
        </Box>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add existing scheme code"
                  variant="outlined"
                />
                <Button
                  sx={{ ml: 2 }}
                  variant="text"
                  style={{
                    color: "#a36e29",
                    fontWeight: 500,
                  }}
                >
                  Redeem
                </Button>
              </Box>

              {schemes.map((scheme, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    mb: 2,
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "50px",
                      background: scheme.disabled
                        ? "#9e9e9e"
                        : "linear-gradient(to bottom, #e0c08d, #a36e29)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        transform: "rotate(-90deg)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Scheme ID
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: scheme.disabled ? "#f0f0f0" : "#fff",
                      opacity: scheme.disabled ? 0.7 : 1,
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        fontWeight="bold"
                        color={scheme.disabled ? "text.secondary" : "initial"}
                      >
                        {scheme.name}
                      </Typography>
                      <Typography fontSize="0.85rem" color="text.secondary">
                        {scheme.disabled
                          ? "Valid till 31st July, 2024"
                          : "Get these for ?"}
                      </Typography>
                      <Typography
                        mt={1}
                        fontWeight="bold"
                        sx={{
                          color: scheme.disabled
                            ? "text.secondary"
                            : "#b27900",
                        }}
                      >
                        {scheme.value}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        fontSize="0.85rem"
                        sx={{
                          color: scheme.disabled ? "gray" : "#a36e29",
                          mb: 1,
                          cursor: scheme.disabled ? "default" : "pointer",
                        }}
                      >
                        View More
                      </Typography>
                      <Button
                        variant="text"
                        disabled={scheme.disabled}
                        sx={{
                          color: scheme.disabled ? "gray" : "#a36e29",
                          fontWeight: 500,
                        }}
                      >
                        Redeem
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Right Section - Price Breakdown */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{ p: 2, borderRadius: "8px", backgroundColor: "#fafafa" }}
              >
                <Typography fontWeight="bold" mb={2}>
                  Price Breakout Details
                </Typography>
                <Divider />

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Metal Amount</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {metalAmount.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Stone Amount</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {stoneAmount.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Making Charges</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {makingCharges.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Hallmark Charge</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {hallmarkCharge.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Rodium Charge</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {rodiumCharge.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>GST ({gstPerc}%)</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {gstAmount.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
                  <Typography>Schemes Discount</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    - ₹ {benefitAmount.toLocaleString("en-IN")}
                  </Typography>
                </Box>

                <Divider />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography fontWeight="bold">Total Amount</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ {(
                      metalAmount +
                      stoneAmount +
                      makingCharges +
                      hallmarkCharge +
                      rodiumCharge +
                      gstAmount -
                      benefitAmount
                    ).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#a36e29",
              color: "#a36e29",
              fontWeight: 500,
              mr: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Redeem Now clicked");
              onClose();
            }}
            sx={{
              background: "linear-gradient(to right, #d4a76a, #a36e29)",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Redeem Now
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RedeemSchemeDialog;
