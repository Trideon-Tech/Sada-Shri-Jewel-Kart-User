import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tab, tabClasses, TabList, Tabs } from "@mui/joy";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalToastStyle } from "../utils/toast.styles";
import SchemesDialog from "./SchemesDialog";

function MySchemes() {
  const [selectedTab, setSelectedTab] = useState(1);
  const [activeSchemes, setActiveSchemes] = useState([]);
  const [oldSchemes, setOldSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [redeemConfirmOpen, setRedeemConfirmOpen] = useState(false);
  const [redeemScheme, setRedeemScheme] = useState(null);
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("🔐 Token used:", token);

    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/schemes/active.php", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response?.data;

        if (data?.success === 1 && Array.isArray(data.response)) {
          const schemesArray = data.response;

          // 🎯 Split based on status
          const active = schemesArray.filter((s) => s.status === "ACTIVE");
          const old = schemesArray.filter(
            (s) => s.status === "CANCELLED" || s.status === "COMPLETED"
          );

          setActiveSchemes(active);
          setOldSchemes(old);
          setError("");
        } else if (
          data?.success === 0 &&
          data?.message === "No active subscription found!"
        ) {
          setActiveSchemes([]);
          setOldSchemes([]);
          setError("");
        } else {
          console.warn("⚠️ Unexpected API shape", data);
          setError("Unexpected API response format.");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ API fetch error:", err);
        setError("Failed to load schemes");
        setLoading(false);
      });
  }, []);

  const handleRedeem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ You're not logged in.");
      return;
    }
    const formData = new FormData();
    formData.append("scheme", redeemScheme.scheme);
    formData.append("subscription", redeemScheme.id);

    try {
      const response = await axios.post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/schemes/redeem.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success === 1) {
        toast.success(" Scheme redeemed successfully! 🎉", generalToastStyle);

        setActiveSchemes((prev) =>
          prev.filter((s) => s.id !== redeemScheme.id)
        );

        const updatedScheme = { ...redeemScheme, status: "cancelled" };

        setOldSchemes((prev) => [...prev, updatedScheme]);
      } else {
        alert(data?.message || "Redemption failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Redeem error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setRedeemConfirmOpen(false);
    }
  };

  const renderSchemeCard = (scheme, isActive = false) => (
    <Box key={scheme.id}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box>
            <Typography
              fontWeight="bold"
              fontSize="1rem"
              style={{
                width: "20vw",
              }}
            >
              {scheme.scheme_details?.name || "N/A"}
            </Typography>

            <Typography fontSize="0.8rem" color="text.primary">
              Subscription ID: {scheme.id}
            </Typography>
          </Box>
        </Box>

        {/* Middle Section */}
        <Box>
          <Typography fontWeight="bold" fontSize="1rem">
            Started On: {scheme.start_date.split(" ")[0]}
          </Typography>
          {scheme.scheme !== "3" && (
            <Typography fontSize="0.8rem" color="text.secondary">
              Ends: {scheme.exp_closure_date.split(" ")[0]}
            </Typography>
          )}
          {scheme.scheme !== "3" && (
            <Typography fontSize="0.8rem" color="text.secondary">
              Plan ID: {scheme.plan}
            </Typography>
          )}
        </Box>

        {/* Right Section */}
        <Box>
          {isActive ? (
            <Button
              variant="contained"
              onClick={() => {
                setRedeemScheme(scheme);
                setRedeemConfirmOpen(true);
              }}
              sx={{
                background: "linear-gradient(to right, #a36e29, #c89444)",
                color: "white",
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 15px",
                "&:hover": {
                  background: "linear-gradient(to right, #a36e29, #a36e29)",
                },
              }}
            >
              Redeem
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                display: "none",
                background: "linear-gradient(to right, #a36e29, #c89444)",
                color: "white",
                textTransform: "none",
                borderRadius: "5px",
                padding: "5px 15px",
                "&:hover": {
                  background: "linear-gradient(to right, #a36e29, #a36e29)",
                },
              }}
              onClick={() => {
                setCode(scheme.redemption_details.code);
                setShowCode(true);
              }}
            >
              View Code
            </Button>
          )}
          <Button
            variant="outlined"
            sx={{
              borderColor: "#a36e29",
              color: "#a36e29",
              textTransform: "none",
              borderRadius: "5px",
              padding: "5px 15px",
              marginLeft: "20px",
              "&:hover": {
                borderColor: "#a36e29",
                backgroundColor: "#f7f7f7",
              },
            }}
            onClick={() => {
              setSelectedScheme(scheme);
              setOpenDialog(true);
            }}
          >
            View Transactions
          </Button>
        </Box>
      </Box>
      <Divider />
    </Box>
  );

  return (
    <>
      <Box sx={{ width: "70%", margin: "50px auto 0 auto", textAlign: "left" }}>
        <Typography
          sx={{
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          My Schemes
        </Typography>

        <Tabs
          aria-label="tabs"
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
          style={{ marginTop: "20px" }}
        >
          <TabList
            sx={{
              p: 0,
              gap: 0,
              borderRadius: "5px",
              width: "max-content",
              border: "1px solid #a7a7a7",
              bgcolor: "#f7f7f7",
              color: "#00000090",
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
                border: "2px solid #a36e29",
                bgcolor: "white",
                color: "#a36e29",
                fontWeight: "bold",
              },
            }}
          >
            <Tab disableIndicator>Old Schemes</Tab>
            <Tab disableIndicator>Active Schemes</Tab>
          </TabList>

          {loading ? (
            <Box mt={4} textAlign="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box mt={4} textAlign="center" color="red">
              {error}
            </Box>
          ) : (
            <>
              {/* Old Schemes */}
              {selectedTab === 0 && (
                <Box
                  mt={4}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {oldSchemes.length === 0 ? (
                    <Box textAlign="center" p={4} color="text.secondary">
                      No old schemes found.
                    </Box>
                  ) : (
                    oldSchemes.map((scheme) => renderSchemeCard(scheme, false))
                  )}
                </Box>
              )}

              {/* Active Schemes */}
              {selectedTab === 1 && (
                <Box
                  mt={4}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {activeSchemes.length === 0 ? (
                    <Box textAlign="center" p={4} color="text.secondary">
                      No active schemes found.
                    </Box>
                  ) : (
                    activeSchemes.map((scheme) =>
                      renderSchemeCard(scheme, true)
                    )
                  )}
                </Box>
              )}
            </>
          )}
        </Tabs>
      </Box>

      <SchemesDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        scheme={selectedScheme}
      />
      <Dialog
        open={redeemConfirmOpen}
        onClose={() => setRedeemConfirmOpen(false)}
      >
        <DialogTitle>Confirm Redemption</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to redeem this scheme?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setRedeemConfirmOpen(false)}
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
              onClick={handleRedeem}
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
      <ToastContainer />

      <Dialog open={showCode} onClose={() => setShowCode(false)}>
        <DialogTitle>Scheme Code</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              my: 2,
            }}
          >
            <Typography variant="h4" align="center">
              {code}
            </Typography>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success("Code copied to clipboard!", generalToastStyle);
              }}
              sx={{
                minWidth: "auto",
                p: 1,
                "&:hover": {
                  backgroundColor: "rgba(163, 110, 41, 0.1)",
                },
              }}
            >
              <ContentCopyIcon sx={{ color: "#a36e29" }} />
            </Button>
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => setShowCode(false)}
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
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MySchemes;
