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

import axios from "axios";

const RedeemSchemeDialog = ({ open, onClose, productDetail }) => {
  const [rates, setRates] = useState({});
  const [metalAmount, setMetalAmount] = useState(0);
  const [stoneAmount, setStoneAmount] = useState(0);
  const [makingCharges, setMakingCharges] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [gstPerc, setGstPerc] = useState(0);
  const [hallmarkCharge, setHallmarkCharge] = useState(0);
  const [rodiumCharge, setRodiumCharge] = useState(0);
  const [schemes, setSchemes] = useState([]);
  const [redeemedSchemes, setRedeemedSchemes] = useState([]);

  const productId = productDetail?.id || 583;
  const jwtToken = localStorage.getItem("token");

  const metalInfo =
    productDetail?.customizations?.variants?.options?.[0]?.metal_info || {};

  const handleRedeemScheme = (scheme) => {
    const alreadyRedeemed = redeemedSchemes.find((s) => s.id === scheme.id);
    if (!alreadyRedeemed) {
      setRedeemedSchemes((prev) => [...prev, scheme]);
    }
  };

  const totalBenefitAmount = redeemedSchemes.reduce(
    (acc, curr) => acc + (curr.raw_benefit || 0),
    0
  );

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
          if (data.success && Array.isArray(data.response)) {
            const parsedSchemes = data.response.map((schemeItem) => {
              const benefit = parseFloat(schemeItem.benefit || "0");
              const schemeDetails = schemeItem.scheme_details;
              const parsedBenefits = JSON.parse(schemeDetails.benefits || "[]");

              return {
                id: schemeDetails.id,
                name: schemeDetails.name,
                value: `₹${benefit.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`,
                valid_till: schemeItem.exp_closure_date,
                benefits: parsedBenefits,
                raw_benefit: benefit,
              };
            });

            setSchemes(parsedSchemes);
          } else {
            setRedeemedSchemes([]);
            setSchemes([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch scheme data", err);
          setRedeemedSchemes([]);
          setSchemes([]);
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

  const totalAmount =
    metalAmount +
    stoneAmount +
    makingCharges +
    hallmarkCharge +
    rodiumCharge +
    gstAmount -
    totalBenefitAmount;

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
            Product Value:{" "}
            <strong>
              ₹{" "}
              {Number(
                metalAmount +
                  stoneAmount +
                  makingCharges +
                  hallmarkCharge +
                  rodiumCharge +
                  gstAmount
              ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </strong>
          </Typography>
          <Typography>
            Current Value:{" "}
            <strong style={{ color: "#a36e29" }}>
              ₹{" "}
              {Number(totalAmount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </strong>
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
                  style={{ color: "#a36e29", fontWeight: 500 }}
                >
                  Redeem
                </Button>
              </Box>

              {schemes.map((scheme, index) => {
                const isRedeemed = redeemedSchemes.find(
                  (s) => s.id === scheme.id
                );
                return (
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
                        background:
                          "linear-gradient(to bottom, #e0c08d, #a36e29)",
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
                        backgroundColor: "#fff",
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold">{scheme.name}</Typography>
                        <Typography fontSize="0.85rem" color="text.secondary">
                          Valid till {scheme.valid_till}
                        </Typography>
                        <Typography
                          mt={1}
                          fontWeight="bold"
                          sx={{ color: "#b27900" }}
                        >
                          {scheme.value}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          fontSize="0.85rem"
                          sx={{ color: "#a36e29", mb: 1, cursor: "pointer" }}
                        >
                          View More
                        </Typography>
                        {isRedeemed ? (
                          <Typography
                            fontSize="0.85rem"
                            sx={{ color: "gray", fontWeight: 500 }}
                          >
                            Redeemed
                          </Typography>
                        ) : (
                          <Button
                            variant="text"
                            sx={{ color: "#a36e29", fontWeight: 500 }}
                            onClick={() => handleRedeemScheme(scheme)}
                          >
                            Redeem
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{ p: 2, borderRadius: "8px", backgroundColor: "#fafafa" }}
              >
                <Typography fontWeight="bold" mb={2}>
                  Price Breakout Details
                </Typography>
                <Divider />

                {[
                  { label: "Metal Amount", value: metalAmount },
                  { label: "Stone Amount", value: stoneAmount },
                  { label: "Making Charges", value: makingCharges },
                  { label: "Hallmark Charge", value: hallmarkCharge },
                  { label: "Rodium Charge", value: rodiumCharge },
                  { label: `GST (${gstPerc}%)`, value: gstAmount },
                  { label: "Schemes Discount", value: -totalBenefitAmount },
                ].map((item, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    my={1}
                  >
                    <Typography>{item.label}</Typography>
                    <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                      ₹{" "}
                      {Number(item.value).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                ))}

                <Divider />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography fontWeight="bold">Total Amount</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹{" "}
                    {Number(totalAmount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
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
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("user_id");

                if (!token || !userId) {
                  alert("Please log in to place the order.");
                  return;
                }

                const orderPayload = {
                  type: "place_order",
                  user_id: userId,
                  discount: totalBenefitAmount.toFixed(2),
                  amount: totalAmount.toFixed(2),
                  sub_total_amount: (totalAmount + totalBenefitAmount).toFixed(
                    2
                  ),
                  products: [
                    {
                      product_id: productDetail?.id,
                      customization_id:
                        productDetail?.customizations?.id || null,
                      quantity: 1,
                      customizations_requested: null,
                    },
                  ],
                };

                const { data } = await axios.post(
                  `http://localhost:64159/v1.0.0/user/orders.php`,
                  orderPayload,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (data.success) {
                  alert("Order placed successfully!");
                  onClose();
                } else {
                  alert("Failed to place the order.");
                }
              } catch (err) {
                console.error("Order submission failed", err);
                alert("Something went wrong. Please try again.");
              }
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
