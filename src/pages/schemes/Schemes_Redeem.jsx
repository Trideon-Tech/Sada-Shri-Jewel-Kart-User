import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  Divider,
} from "@mui/material";
import Navbar from "../../components/navbar/navbar.component";
import ButtonComponent from "../../components/button/button.component";
// import { BorderBottom, Translate } from "@mui/icons-material"; // These imports are not used, can be removed.

const Schemes_Redeem = () => {
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
            left: "514px", // Fixed left positioning, not ideal for responsiveness.
            color: "#000000",
            fontFamily: "open sans",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          My schemes
        </Box>

        {/* Scheme filter buttons (Old Schemes, Active Schemes). Fixed positioning is problematic for responsiveness. */}
        <Box sx={{ position: "relative", top: "100px", left: "500px" }}>
          <Button
            sx={{
              border: "1px solid black",
              fontFamily: "open sans",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "0px", // Sharp corners.
              color: "#A36E29",
            }}
          >
            Old Schemes
          </Button>
          <Button
            sx={{
              border: "1px solid black",
              borderRadius: "0px",
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

                {/* Redeem Now Button */}
                {/* <Box sx={{ position: "relative", top: "25px", left: "180px" }}>
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
                </Box> */}

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
    </Box>
  );
};

export default Schemes_Redeem;
