import {
  Box,
  Button,
  Card,
  Divider,
  Typography
} from "@mui/material";
import React from "react";
import ButtonComponent from "../../components/button/button.component";
import Navbar from "../../components/navbar/navbar.component";
// import { BorderBottom, Translate } from "@mui/icons-material"; // These imports are not used, can be removed.
import CloseIcon from "@mui/icons-material/Close"; // For the 'X' icon
import { IconButton } from "@mui/material";
const Schemes_Redeem = ({ onClose }) => {
  const transactions = [
    {
      id: "SS10922",
      date: "02/10/2024 at 4:15pm",
      amount: "Rs. 16,389",
      status: "Pending",
    },
    {
      id: "SS10923",
      date: "04/10/2024 at 4:15pm",
      amount: "Rs. 156,389",
      status: "Completed",
    },
    {
      id: "SS10924",
      date: "06/10/2024 at 4:15pm",
      amount: "Rs. 30,000",
      status: "Completed",
    },
    {
      id: "SS10925",
      date: "08/10/2024 at 4:15pm",
      amount: "Rs. 5,000",
      status: "Pending",
    },
  ];

  const schemes = [
    {
      id: "SCHM123",
      name: "Gold Savings Scheme",
      amount: 345,
      startDate: "2023-01-01",
      maturityDate: "2025-01-01",
      image: "/images/gold.png",
    },
    {
      id: "SCHM456",
      name: "Silver SIP",
      amount: 500,
      startDate: "2023-03-01",
      maturityDate: "2026-03-01",
      image: "/images/silver.png",
    },
  ];

  return (
    // Main container for the entire page.
    <Box>
      {/* Navbar component at the top of the page. Positioned relatively to allow other elements to flow around it. */}
      <Box sx={{ position: "relative" }}>
        <Navbar />
      </Box>

      {/* Container for the main content area, using flexbox for layout of sidebar and main content. */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Left Sidebar - My Account section */}
        <Box>
          {/* Box acting as the sidebar with fixed dimensions and absolute positioning.
              NOTE: Absolute positioning can make responsiveness challenging.
              Consider using Material-UI's Grid component for better responsiveness. */}
          <Box
            sx={{
              width: "440px",
              height: "883px",
              backgroundColor: "#F8F8F8",
              position: "absolute",
              top: "130px",
              left: "8px",
            }}
          >
            {/* Title for the My Account section */}
            <Typography
              sx={{
                color: "#000000",
                fontFamily: "open sans",
                fontSize: "28px",
                position: "absolute",
                top: "30px",
                fontWeight: "700",
                left: "99px",
              }}
            >
              My Account
            </Typography>

            {/* User information (Name, Email, Phone) */}
            <Box sx={{ position: "relative", top: "100px", left: "99px" }}>
              <Typography
                sx={{
                  fontFamily: "open sans",
                  fontWeight: "700",
                  fontSize: "16px",
                  // textDecoration is used for styling, consider using Material-UI's Link or a custom Text component if this is interactive.
                  textDecoration: "underline",
                  textDecorationThickness: "0", // Setting thickness to 0 effectively hides the underline unless color is applied.
                  textDecorationColor: "#000000E5",
                }}
              >
                Sumit
              </Typography>
              <Typography
                sx={{
                  position: "relative", // Relative positioning here might not be necessary if using flex/grid.
                  margin: "10px 0px",
                  fontFamily: "open sans",
                  fontWeight: "600",
                  fontSize: "14px",
                  textDecoration: "underline",
                  textDecorationThickness: "0",
                  textDecorationColor: "#000000E5",
                }}
              >
                shubham@gmail.com
              </Typography>
              <Typography
                sx={{
                  position: "relative",
                  margin: "10px 0px",
                  fontFamily: "open sans",
                  fontWeight: "600",
                  fontSize: "14px",
                  textDecoration: "underline",
                  textDecorationThickness: "0",
                  textDecorationColor: "#000000E5",
                }}
              >
                9876543210
              </Typography>
              {/* Edit Profile Button */}
              <Button
                sx={{
                  color: "#A36E29",
                  position: "relative",
                  top: "-5px",
                  left: "-8px",
                  fontFamily: "open sans",
                  fontWeight: "700",
                  fontSize: "14px",
                  textDecoration: "underline",
                  textDecorationThickness: "0",
                  textDecorationColor: "#000000E5",
                }}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Divider line using a div with inline style. Material-UI's <Divider /> component is recommended for consistency. */}
            <div
              style={{
                border: "1px solid black",
                marginTop: "133px",
                width: "249px",
                marginLeft: "97px",
              }}
            ></div>

            {/* Navigation links/buttons for account sections */}
            <Box sx={{ position: "relative", top: "50px", left: "99px" }}>
              <Button
                sx={{
                  fontFamily: "open sans",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#353535",
                  display: "block", // Makes the button take full width and stack vertically.
                }}
              >
                Orders and Returns
              </Button>
              <Button
                sx={{
                  position: "relative",
                  margin: "10px 0px",
                  fontFamily: "open sans",
                  fontWeight: "600",
                  fontSize: "14px",
                  display: "block",
                  color: "#353535",
                }}
              >
                Saved Addresses
              </Button>
              <Button
                sx={{
                  position: "relative",
                  margin: "10px 0px",
                  fontFamily: "open sans",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#353535",
                  display: "block",
                }}
              >
                Your Wallet
              </Button>
              {/* Highlighted button for "My Schemes" */}
              <Button
                sx={{
                  color: "#A36E29",
                  position: "relative",
                  top: "-5px",
                  fontFamily: "open sans",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                My Schemes
              </Button>
            </Box>

            {/* Another divider line */}
            <div
              style={{
                border: "1px solid black",
                marginTop: "240px",
                width: "249px",
                marginLeft: "97px",
              }}
            ></div>

            {/* Account management buttons */}
            <Box>
              <Button
                sx={{
                  color: "#353535",
                  fontFamily: "open sans",
                  fontSize: "16px",
                  position: "relative",
                  top: "30px",
                  fontWeight: "600",
                  left: "99px",
                  display: "block",
                }}
              >
                Logout
              </Button>
              <Button
                sx={{
                  color: "#353535",
                  fontFamily: "open sans",
                  fontSize: "16px",
                  position: "relative",
                  top: "30px",
                  fontWeight: "600",
                  left: "99px",
                  display: "block",
                }}
              >
                Deactivate Account
              </Button>
            </Box>
          </Box>
          {/* Empty Box, likely a remnant or placeholder. */}
          <Box></Box>
        </Box>

        {/* Right Content Area - My Schemes */}
        {/* Title for the "My Schemes" section. Absolute positioning may cause overflow on smaller screens. */}
        <Box
          sx={{
            position: "relative",
            top: "65px",
            left: "", // Fixed left positioning, not ideal for responsiveness.
            color: "#000000",
            fontFamily: "open sans",
            fontSize: "28px",
            fontWeight: "700",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "35vw",
              // Fixed left positioning, not ideal for responsiveness.
              color: "#000000",
              fontFamily: "open sans",
              fontSize: "28px",
              fontWeight: "700",
              display: "flex",
              justifyContent: "start",
            }}
          >
            My schemes
          </Box>
        </Box>

        {/* Scheme filter buttons (Old Schemes, Active Schemes). Fixed positioning is problematic for responsiveness. */}
        <Box
          sx={{
            position: "relative",
            top: "90px",
            display: "flex",
            justifyContent: "end",
            width: "46vw",
          }}
        >
          <Button
            sx={{
              border: "1px solid black",
              fontFamily: "open sans",
              fontSize: "12px",
              fontWeight: "600",
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px", // Sharp corners.
              color: "#A36E29",
            }}
          >
            Old Schemes
          </Button>
          <Button
            sx={{
              border: "1px solid black",
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              fontFamily: "open sans",
              fontSize: "12px",
              fontWeight: "600",
              color: "#A36E29",
            }}
          >
            Active Schemes
          </Button>
        </Box>

        {/* Scheme Card - Displays details of a single scheme */}
        <Card
          sx={{
            marginTop: "115px",
            left: "480px",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            position: "relative",
            width: "950px",
            height: "624px",
            border: "2px solid #ccc", // Completed border style
            borderRadius: "10px",
            padding: "20px", // Optional for better spacing
          }}
        >
          {schemes.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: "flex" }}>
                {/* Image */}
                <Box
                  component="img"
                  src=""
                  sx={{
                    borderRadius: "20px",
                    width: "64px",
                    height: "64px",
                    position: "relative",
                    left: "25px",
                    top: "20px",
                  }}
                />

                {/* Scheme name and ID */}
                <Box sx={{ position: "relative", top: "25px", left: "60px" }}>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Scheme name
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#4A4A4A",
                    }}
                  >
                    Scheme Id
                  </Typography>
                </Box>

                {/* Amount and dates */}
                <Box sx={{ position: "relative", top: "25px", left: "160px" }}>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Amount per month/day &#8377; 345
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#4A4A4A",
                      textAlign: "end",
                    }}
                  >
                    Start Date - Maturity Date
                  </Typography>
                </Box>

                {/* Redeem Now Button */}
                <Box sx={{ position: "relative", top: "25px", left: "180px" }}>
                  <ButtonComponent
                    buttonText={"Redeem Now"}
                    style={{
                      width: "158px",
                      height: "27px",
                      background: "linear-gradient(to right, #A36E29, #E0B872)",
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "16px",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      top: "-8px",
                    }}
                  />
                </Box>

                {/* Cancel Button */}
                <Box sx={{ position: "relative", top: "27px", left: "150px" }}>
                  <Button
                    sx={{
                      width: "158px",
                      height: "43px",
                      color: "#A36E29",
                      border: "1px solid #A36E29",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    cancel
                  </Button>
                </Box>
              </Box>

              {/* Divider (render only if not the last item) */}
              {index !== schemes.length - 1 && (
                <Divider
                  sx={{
                    marginTop: "40px",
                    borderColor: "#ccc",
                    position: "relative",
                    top: "20px",
                  }}
                />
              )}
            </Box>
          ))}
        </Card>
        <Card
          sx={{
            marginTop: "115px",
            left: "480px",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            position: "relative",
            width: "950px",
            height: "624px",
            border: "2px solid #ccc", // Completed border style
            borderRadius: "10px",
            padding: "20px", // Optional for better spacing
          }}
        >
          {schemes.map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: "flex" }}>
                {/* Image */}
                <Box
                  component="img"
                  src=""
                  sx={{
                    borderRadius: "20px",
                    width: "64px",
                    height: "64px",
                    position: "relative",
                    left: "25px",
                    top: "20px",
                  }}
                />

                {/* Scheme name and ID */}
                <Box sx={{ position: "relative", top: "25px", left: "60px" }}>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Scheme name
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#4A4A4A",
                    }}
                  >
                    Scheme Id
                  </Typography>
                </Box>

                {/* Amount and dates */}
                <Box sx={{ position: "relative", top: "25px", left: "330px" }}>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Amount per month/day &#8377; 345
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "open sans",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#4A4A4A",
                      textAlign: "end",
                    }}
                  >
                    Start Date - Maturity Date
                  </Typography>
                </Box>

                {/* Cancel Button */}
                <Box sx={{ position: "relative", top: "27px", left: "350px" }}>
                  <Button
                    sx={{
                      width: "158px",
                      height: "43px",
                      color: "#A36E29",
                      border: "1px solid #A36E29",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    cancel
                  </Button>
                </Box>
              </Box>

              {/* Divider (render only if not the last item) */}
              {index !== schemes.length - 1 && (
                <Divider
                  sx={{
                    marginTop: "40px",
                    borderColor: "#ccc",
                    position: "relative",
                    top: "20px",
                  }}
                />
              )}
            </Box>
          ))}
        </Card>
      </Box>

      {/* Card for payment history */}
      <Box
        sx={{
          maxWidth: 800, // Equivalent to Tailwind's max-w-3xl (approx 48rem * 16px/rem = 768px, so 800px is a good estimate)
          margin: "0 auto", // Equivalent to Tailwind's mx-auto
          backgroundColor: "white",
          boxShadow: 3, // Material-UI shadow (corresponds to a light gray shadow)
          borderRadius: "12px", // Rounded corners
          p: 3, // Padding
          border: "1px solid #E0E0E0", // Light border for subtle definition
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          {/* Scheme Info */}
          <Box>
            <Typography
              variant="h6" // Equivalent to text-lg font-semibold
              sx={{
                fontFamily: "inherit", // Use default font or define your 'Open Sans'
                fontWeight: 600,
                color: "black",
              }}
            >
              Scheme Name
            </Typography>
            <Typography
              variant="body2" // Equivalent to text-sm text-gray-500
              sx={{
                fontFamily: "inherit",
                color: "#6B7280", // Gray-500 equivalent
              }}
            >
              Start Date - Maturity Date
            </Typography>
          </Box>

          {/* Close Button and Status/Total Payment */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{ p: 0, mb: 1, color: "black" }} // Adjust padding and margin
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="body2" // Equivalent to text-sm font-semibold
              sx={{
                fontFamily: "inherit",
                fontWeight: 600,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Status:{" "}
              <Box
                component="span"
                sx={{
                  bgcolor: "#FCD34D", // Yellow-300 equivalent
                  color: "#92400E", // Yellow-800 equivalent
                  px: 1, // Padding x
                  py: 0.25, // Padding y
                  borderRadius: "4px", // Rounded corners
                  fontSize: "0.75rem", // text-xs
                  fontWeight: 500,
                }}
              >
                In Progress
              </Box>
            </Typography>
            <Typography
              variant="body2" // Equivalent to text-sm font-semibold
              sx={{
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Total Payment:{" "}
              <Box component="span" sx={{ color: "black" }}>
                5,400
              </Box>
            </Typography>
          </Box>
        </Box>
        {/* Divider */}
        <Divider sx={{ my: 3, borderColor: "#E0E0E0" }} />{" "}
        {/* Light gray divider */}
        {/* Payment History Section */}
        <Typography
          variant="h6" // Equivalent to text-md font-bold
          sx={{
            fontFamily: "inherit",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Payment History
        </Typography>
        {/* Payment History Table */}
        <Box
          sx={{
            overflowX: "auto",
            border: "1px solid #BFDBFE", // Light blue rounded border (closest to image)
            borderRadius: "8px",
          }}
        >
          <table
            style={{
              minWidth: "100%",
              borderCollapse: "collapse", // Ensures no double borders
              fontSize: "0.875rem", // text-sm
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: "#4B5563",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                {" "}
                {/* Gray-600 border-b */}
                <th style={{ padding: "8px 12px", fontWeight: 600 }}>
                  Transaction ID
                </th>
                <th style={{ padding: "8px 12px", fontWeight: 600 }}>
                  Date of Installment
                </th>
                <th style={{ padding: "8px 12px", fontWeight: 600 }}>Amount</th>
                <th style={{ padding: "8px 12px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                    background: "white",
                  }} // Alternating row background for readability
                >
                  <td style={{ padding: "8px 12px" }}>{txn.id}</td>
                  <td style={{ padding: "8px 12px" }}>{txn.date}</td>
                  <td style={{ padding: "8px 12px" }}>{txn.amount}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: txn.status === "Pending" ? "#6B7280" : "#10B981", // Gray-500 or Green-600
                        fontWeight: txn.status === "Completed" ? 500 : 400, // font-medium for completed
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          height: "8px",
                          width: "8px",
                          borderRadius: "50%",
                          bgcolor:
                            txn.status === "Pending" ? "#9CA3AF" : "#34D399", // Gray-400 or Green-500
                          display: "inline-block",
                        }}
                      />
                      {txn.status}
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
};

export default Schemes_Redeem;
