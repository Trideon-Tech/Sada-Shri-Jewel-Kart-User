import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Box, Card, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";

const ContactUs = () => {
  const matches = useMediaQuery("(min-width:768px)");

  return (
    <Box>
      <Navbar />

      <Box
        sx={{
          height: matches ? "calc(100vh - 18.5rem)" : "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: "30px",
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 700,
            color: "#a36e29",
            marginTop: matches ? "30px" : "120px",
            textAlign: "left",
            fontSize: "1.2rem",
          }}
        >
          Contact Us
        </Typography>

        <Card
          elevation={2}
          sx={{
            width: matches ? "60%" : "90%",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <LocationOnIcon sx={{ color: "#a36e29", fontSize: "1rem" }} />
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontFamily: '"Roboto", sans-serif' }}
              >
                Address
              </Typography>
              <Typography sx={{ fontFamily: '"Roboto", sans-serif' }}>
                No. 1323/1324, 16th B Cross,
                <br />
                Housing Board Colony EWS 3rd Phase,
                <br />
                Yelahanka New Town,
                <br />
                Bengaluru Urban, Karnataka - 560064
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <EmailIcon sx={{ color: "#a36e29", fontSize: "1rem" }} />
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontFamily: '"Roboto", sans-serif' }}
              >
                Email
              </Typography>
              <Typography sx={{ fontFamily: '"Roboto", sans-serif' }}>
                contact@sadashrijewelkart.com
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      <Footer />
    </Box>
  );
};

export default ContactUs;
