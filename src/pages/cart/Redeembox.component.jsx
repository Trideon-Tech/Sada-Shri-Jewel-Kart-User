import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RedeemBox = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const jwtToken = localStorage.getItem("token");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open && productId) {
      console.log("🔍 Fetching from:", `https://api.sadashrijewelkart.com/v1.0.0/user/schemes/benefits.php?product=${productId}`);

      fetch(
        `https://api.sadashrijewelkart.com/v1.0.0/user/schemes/benefits.php?product=${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("🟢 Scheme API response:", data);

          if (data.success && data.response) {
            setSchemes(data.response);
          } else {
            setSchemes([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch schemes", err);
          setSchemes([]);
        });
    }
  }, [open, productId, jwtToken]);

const handleRedeem = async () => {
  const token = localStorage.getItem("token");

  if (!token || !selectedScheme) return;

  const formData = new FormData();
  formData.append("scheme", selectedScheme.scheme);
  formData.append("subscription", selectedScheme.id);

  try {
    // 1. Call redeem API
    const res = await fetch(
      "https://api.sadashrijewelkart.com/v1.0.0/user/schemes/redeem.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (data.success === 1) {
      // 2. Call active.php to refresh the list
      const refreshed = await fetch(
        "https://api.sadashrijewelkart.com/v1.0.0/user/schemes/active.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const refreshedData = await refreshed.json();
      const filtered = (refreshedData.response || []).filter(
  (scheme) => scheme.status === "ACTIVE"
);
setSchemes(filtered);

      
    } else {
      alert(data.message || "Redemption failed.");
    }
  } catch (err) {
    console.error("❌ Redeem error:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    // Close the confirm dialog either way
    setConfirmDialogOpen(false);
  }
};


  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(90deg, #c6943f 0%, #e0b255 100%)",
          borderRadius: "12px",
          padding: "1rem",
          marginTop: "1.5rem",
          textAlign: "left",
          color: "white",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "1.1rem",
            fontFamily: '"Roboto", sans-serif',
          }}
        >
          Save Big !!!
        </Typography>
        <Typography
          sx={{
            fontSize: "0.95rem",
            fontFamily: '"Roboto", sans-serif',
            marginBottom: "0.5rem",
          }}
        >
          Redeem Schemes Now
        </Typography>
        <Button
          sx={{
            backgroundColor: "white",
            color: "#b28228",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
            padding: "8px 20px",
          }}
          onClick={handleOpenDialog}
        >
          Redeem Now
        </Button>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.1rem",
          }}
        >
          <span>
            Save Big using <span style={{ color: "#c6943f" }}>Schemes</span>
          </span>
          <IconButton size="small" onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              backgroundColor: "#f8f4eb",
              padding: "10px 15px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              placeholder="Add existing scheme code"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              fullWidth
              sx={{ backgroundColor: "#f8f4eb", fontSize: "0.9rem" }}
            />
            <Button
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                color: "#a36e29",
              }}
            >
              Redeem
            </Button>
          </Box>

          {schemes.length > 0 ? (
            schemes.map((scheme, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    backgroundColor: index === 2 ? "#eee" : "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    mb: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box
                    sx={{
                      width: "60px",
                      backgroundColor: index === 2 ? "#ccc" : "#c6943f",
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "8px 4px",
                      fontSize: "0.7rem",
                    }}
                  >
                    <div>Subscription</div>
                    <div>{scheme.id || "ID"}</div>
                  </Box>
                  <Box sx={{ flex: 1, padding: "10px" }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                      {scheme.scheme_details?.name || "Scheme Name"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "gray" }}>
                      Start Date : {scheme.start_date?.split(" ")[0] || "N/A"}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                      ₹{" "}
                      {parseFloat(scheme.benefit) > 0
                        ? parseFloat(scheme.benefit).toLocaleString("en-IN")
                        : "0"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      padding: "10px",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.7rem", color: "gray", mb: 1 }}>
                      View More
                    </Typography>
                    <Button
                      variant="text"
                      disabled={scheme.redeemed}
                      sx={{
                        textTransform: "none",
                        color: scheme.redeemed ? "gray" : "#a36e29",
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setConfirmDialogOpen(true);
                      }}
                    >
                      Redeem
                    </Button>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography sx={{ fontSize: "0.9rem", color: "gray" }}>
              No schemes available
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* 🔁 Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Redemption</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to redeem this scheme?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setConfirmDialogOpen(false)}
              sx={{
                color: "#a36e29",
                borderColor: "#a36e29",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "6px",
                padding: "6px 18px",
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                  borderColor: "#a36e29",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick= {handleRedeem}
              sx={{
                background: "linear-gradient(to right, #a36e29, #e0b872)",
                color: "#fff",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "6px",
                padding: "6px 18px",
                "&:hover": {
                  background: "linear-gradient(to right, #a36e29, #a36e29)",
                },
              }}
            >
              Yes, Redeem
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RedeemBox;
