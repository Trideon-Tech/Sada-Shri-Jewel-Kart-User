import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar.component";
import { Box, Typography, Container } from "@mui/material";
import image1 from "../../assets/images/pngegg.png";
import Scheme_Card from "../../components/scheme_card/Scheme_Card";
import ringLogo from '../../assets/images/2 1.svg'

const Schemes_main = () => {
  const [card, setCard] = useState(["", "", ""]);

  return (
    <Container maxWidth="4xl" disableGutters>
      {/* Optional Navbar */}
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom,rgb(249, 236, 220),rgb(227, 190, 126))",
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
            are already benefiting from our three special schemes & invest your money wisely
          </Typography>

          <Typography
            sx={{
              fontFamily: "Open Sans",
              fontWeight: 600,
              fontSize: { xs: "18px", md: "24px" },
            }}
          >
            
          </Typography>
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
            <Scheme_Card key={index} data={item} />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Schemes_main;
