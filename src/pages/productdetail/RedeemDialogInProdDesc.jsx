import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const handlePayment = async (order) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: order.amount_due,
    currency: order.currency,
    name: "SadaShri Jewel Kart",
    description: "Order Payment",
    order_id: order.id,
    handler: async function (response) {
      try {
        const token = localStorage.getItem("token");
        const paymentPayload = {
          type: "payment_success",
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_id: order.id,
          payment_method: "razorpay",
          wallet_amount: 0,
          coupon_id: null,
        };

        const params = new URLSearchParams();
        for (const key in paymentPayload) {
          params.append(key, paymentPayload[key]);
        }

        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1.0.0/user/orders.php`,
          params,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (data.success) {
          alert("Payment successful and verified!");
          // Close the dialog or perform any other UI updates
        } else {
          alert("Payment verification failed.");
        }
      } catch (err) {
        console.error("Payment verification error", err);
        alert("Payment verification failed.");
      }
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    theme: {
      color: "#a36e29",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

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

  const navigate = useNavigate();
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

  const totalBenefitAmount = Number(redeemedSchemes.reduce(
    (acc, curr) => acc + (curr.raw_benefit || 0),
    0
  ).toFixed(2));

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

    const rate = Number((rates[metalInfo.quality] || 0).toFixed(2));
    const grossWt = Number((parseFloat(metalInfo.gross_wt || 0)).toFixed(2));
    const stoneWt = Number((parseFloat(metalInfo.stone_wt || 0)).toFixed(2));
    const netWeight = Number((grossWt - stoneWt).toFixed(2));
    const wastagePerc = Number((parseFloat(metalInfo.wastage_prec || 0)).toFixed(2));
    const wastageWeight = Number((netWeight * (wastagePerc / 100)).toFixed(2));
    const netWeightAfterWastage = Number((netWeight + wastageWeight).toFixed(2));

    const baseMetalAmount = Number((netWeightAfterWastage * rate).toFixed(2));
    const makingChargeValue = Number((parseFloat(metalInfo.making_charge_value || 0)).toFixed(2));
    const makingChargeAmount = Number(((baseMetalAmount * makingChargeValue) / 100).toFixed(2));
    const hallmark = Number((parseFloat(metalInfo.hallmark_charge || 0)).toFixed(2));
    const rodium = Number((parseFloat(metalInfo.rodium_charge || 0)).toFixed(2));
    const stoneAmt = Number((parseFloat(metalInfo.stone_amount || 0)).toFixed(2));
    const gstPercent = Number((parseFloat(metalInfo.gst_perc || 0)).toFixed(2));

    const gstBase = Number((
      baseMetalAmount + makingChargeAmount + hallmark + rodium + stoneAmt
    ).toFixed(2));
    const gstFinal = Number(((gstBase * gstPercent) / 100).toFixed(2));

    setMetalAmount(baseMetalAmount);
    setStoneAmount(stoneAmt);
    setMakingCharges(makingChargeAmount);
    setHallmarkCharge(hallmark);
    setRodiumCharge(rodium);
    setGstAmount(gstFinal);
    setGstPerc(gstPercent);
  }, [metalInfo, rates]);

  const buyNow = async () => {
    const userId = localStorage.getItem("user_id")
      ? localStorage.getItem("user_id")
      : -1;

    if (userId !== -1) {
      navigate(
        `/checkout?action=buy-now&prod=${productDetail?.name}&hash=${
          productDetail?.hash
        }&customization=${
          productDetail?.customizations?.variants?.options[0]?.id || -1
        }&discount=${0}&coins=${0}&schemeId=${
          redeemedSchemes.length > 0 ? redeemedSchemes[0].id : null
        }`
      );
    } else {
      navigate(
        `/signin?redirect_to=/item/${productDetail?.category}/${productDetail?.name}-${productDetail?.hash}`
      );
    }
  };

  const totalAmount = Number((
    metalAmount +
    stoneAmount +
    makingCharges +
    hallmarkCharge +
    rodiumCharge +
    gstAmount -
    totalBenefitAmount
  ).toFixed(2));

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
                        Scheme ID - {scheme.id}
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
            // onClick={async () => {
            //   try {
            //     const token = localStorage.getItem("token");
            //     const userId = localStorage.getItem("user_id");

            //     if (!token || !userId) {
            //       alert("Please log in to place the order.");
            //       return;
            //     }

            //     // Prepare ordered products array
            //     const orderedProducts = [
            //       {
            //         product_id: productDetail?.id,
            //         customization_id:
            //           productDetail?.customizations?.variants?.options[0]?.id || -1,
            //         quantity: 1,
            //         customizations_requested: null,
            //       },
            //     ];

            //     // Prepare order request payload matching backend expectations
            //     const orderPayload = {
            //       type: "order_request",
            //       currency: "INR",
            //       receipt: `receipt_${Date.now()}`,
            //       user_address_id: null, // TODO: set user address id if available
            //       payment_status: "created",
            //       coupon_id: null,
            //       wallet_amount: 0,
            //       ordered_products: JSON.stringify(orderedProducts),
            //       scheme_id: redeemedSchemes.length > 0 ? redeemedSchemes[0].id : null,
            //       scheme_amount: totalBenefitAmount.toFixed(2),
            //     };

            //     const params = new URLSearchParams();
            //     for (const key in orderPayload) {
            //       params.append(key, orderPayload[key]);
            //     }

            //     const { data } = await axios.post(
            //       `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/payment.php`,
            //       params,
            //       {
            //         headers: {
            //           Authorization: `Bearer ${token}`,
            //           "Content-Type": "application/x-www-form-urlencoded",
            //         },
            //       }
            //     );

            //     if (data.success) {
            //       // Call Razorpay payment flow with order details
            //       await handlePayment(data.response);
            //     } else {
            //       alert("Failed to place the order.");
            //     }
            //   } catch (err) {
            //     console.error("Order submission failed", err);
            //     alert("Something went wrong. Please try again.");
            //   }
            // }}
            onClick={buyNow}
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
