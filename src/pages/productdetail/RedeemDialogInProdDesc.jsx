import React from "react";
import {
  Dialog,
  DialogTitle,
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

const RedeemSchemeDialog = ({ open, onClose }) => {
  const schemes = [
    { id: "SCH001", name: "Scheme Name", value: "₹80000", disabled: false },
    { id: "SCH002", name: "Scheme Name", value: "Save ₹800", disabled: true },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box p={2}>
        {/* Title */}
        <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
          Redeem My Schemes
        </Typography>

        {/* Product Info Row */}
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
            {/* Left Section - Schemes */}
            <Grid item xs={12} md={6}>
              {/* Add Code */}
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

              {/* Scheme Cards */}
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
                  {/* Left Vertical Tag */}
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

                  {/* Right Content Block */}
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
                          color: scheme.disabled ? "text.secondary" : "#b27900",
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
                {[
                  "Metal Amount",
                  "Stone Amount",
                  "Making Charges",
                  "GST (18%)",
                  "Schemes Discount",
                ].map((label, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    my={1}
                  >
                    <Typography>{label}</Typography>
                    <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                      ₹ 80,000
                    </Typography>
                  </Box>
                ))}
                <Divider />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography fontWeight="bold">Total Amount</Typography>
                  <Typography fontWeight="bold" sx={{ color: "#a36e29" }}>
                    ₹ 4,00,000
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Bottom CTA */}
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
