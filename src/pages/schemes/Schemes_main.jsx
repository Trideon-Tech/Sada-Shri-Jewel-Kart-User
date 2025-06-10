import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.component";
import { Box, Typography, Container, Card } from "@mui/material";

import Scheme_Card from "../../components/scheme_card/Scheme_Card";
import ringLogo from "../../assets/images/2 1.svg";
import { useTheme, useMediaQuery } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Schemes_CardForMobile from "../../components/scheme_card/Schemes_CardForMobile";
import { HandymanOutlined } from "@mui/icons-material";

const Schemes_main = () => {
  const [card, setCard] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/schemes/form");
  }

   useEffect(() => {
  fetch("http://localhost/Sada-Shri-Jewel-Kart-Backend/v1.0.0/scheme/scheme_api.php") 
    .then((res) => res.json())
    .then((data) =>  {
    // console.log("Fetched data from backend:", data);
    setCard(data)})
    .catch((err) => console.error("Failed to fetch schemes:", err));
}, []);


  return (
    <Container maxWidth="4xl" disableGutters>
      {/* Optional Navbar */}
      <Navbar />

      {isMobile ? (
        <div
          style={{
            background:
              "linear-gradient(to bottom,rgb(249, 236, 220),rgb(231, 192, 125))",
              minHeight:"100vh"
          }}
        >
          <Box
            sx={{
              position: "relative",
              top: "120px",
              display: "flex",
              justifyContent: { xs: "space-between" },
              "@media (min-width:400px)": {
                justifyContent: "space-evenly",
              },
            }}
          >
            {/* Left Ring */}
            <Box
              component="img"
              src={ringLogo}
              alt="ring-left"
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                width: { xs: "180px", sm: "220px", md: "250px" },
                height: { xs: "180px", sm: "220px", md: "250px" },
                position: "relative",
                left: { xs: "-30px", sm: "-50px", md: "-62px" },
              }}
            />

            {/* Right Ring */}
            <Box
              component="img"
              src={ringLogo}
              alt="ring-right"
              sx={{
                width: { xs: "100px", sm: "120px", md: "150px" },
                height: { xs: "100px", sm: "120px", md: "150px" },
                position: "relative",
                //  left: { xs: "40px", sm: "60px", md: "100px" },
                top: { xs: "-10px", sm: "-12px", md: "-16px" },
              }}
            />
          </Box>
          <div style={{ position: "relative", top: "-10px" }}>
            <Typography
              style={{
                textAlign: "center",
                fontFamily: "Open Sans",
                fontWeight: 700,
                fontSize: "28px",
              }}
            >
              Save your <strong style={{ color: "#A36E29" }}>Money</strong> now
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                top: "4px",
                fontFamily: "Open Sans",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              <Typography
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  fontSize: "16px",
                  opacity: "80%",
                  wordBreak: "break-word", // Allows breaking long words
                }}
              >
                Join <strong style={{ color: "#A36E29" }}>1000+</strong> users
                who are already benefiting
              </Typography>
              <Typography
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  fontSize: "16px",
                  opacity: "80%",
                }}
              >
                from our three special schemes &
              </Typography>
              <Typography
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  fontSize: "16px",
                  opacity: "80%",
                }}
              >
                get invest your money wisely
              </Typography>
            </div>
          </div>
          <div style={{ marginTop: "30px" }}>
            <Schemes_CardForMobile />
          </div>
        </div>
      ) : (
        <Box
          sx={{
            minHeight: "100vh",
            background:
              "linear-gradient(to bottom,rgb(249, 236, 220),rgb(227, 190, 126))",
            px: 2,
            py: 1,
          }}
        >
          {/* Background Image Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              gap: "20px",
              flexWrap: "wrap",

              mb: 4,
            }}
          >
            {[...Array(2)].map((_, i) => (
              <Box
                key={i}
                component="img"
                src={ringLogo}
                alt="background decoration"
                sx={{
                  width: { xs: "200px", sm: "250px", md: "370px" },
                  opacity: 0.7,
                }}
              />
            ))}
          </Box>

          {/* Centered Text */}
          <Box
            sx={{
              position: { md: "absolute" },
              top: { md: "220px" },
              left: { md: "50%" },
              transform: { md: "translateX(-50%)" },
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              px: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Open Sans",
                fontWeight: 600,
                fontSize: { xs: "32px", md: "48px" },
              }}
            >
              Save Your <strong style={{ color: "#A36E29" }}>Money</strong> now
            </Typography>

            <Typography
              sx={{
                fontFamily: "Open Sans",
                fontWeight: 600,
                fontSize: { xs: "18px", md: "24px" },
                textAlign: "center",
              }}
            >
              Join <strong style={{ color: "#A36E29" }}>1000+</strong> users who
              are already benefiting from our three special schemes & invest
              your money wisely
            </Typography>

            <Typography
              sx={{
                fontFamily: "Open Sans",
                fontWeight: 600,
                fontSize: { xs: "18px", md: "24px" },
              }}
            ></Typography>
          </Box>

          {/* Scheme Cards Section */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: { xs: 2, md: 6 },
              px: 2,
            }}
          >
            {card.map((item, index) => (
              <Scheme_Card key={index} data={item} onJoin={handleJoinClick} />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Schemes_main;
