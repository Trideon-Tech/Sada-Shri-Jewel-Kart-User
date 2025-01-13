import { Facebook, Instagram, Pinterest, YouTube } from "@mui/icons-material";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";

function Footer() {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box
      component="footer"
      style={{
        marginTop: "80px",
        paddingTop: "50px",
        margin: 0,
        backgroundColor: "rgba(163,110,41,0.08)",
      }}
    >
      <Container style={{ width: "80%" }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={matches ? 6 : 12}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: `${matches ? "flex-start" : "center"}`,
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src={process.env.PUBLIC_URL + "/assets/logo_dark_1.png"}
              width={matches ? 220 : 180}
              style={{ marginBottom: "10px" }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                mt: 3,
                mb: 3,
              }}
            >
              <Facebook
                sx={{
                  color: "#1877f2",
                  cursor: "pointer",
                  "&:hover": { color: "#1877f2" },
                  height: "40px",
                  width: "40px",
                }}
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/profile.php?id=61556186217870",
                    "_blank"
                  )
                }
              />
              <Instagram
                sx={{
                  color: "#e4405f",
                  cursor: "pointer",
                  "&:hover": { color: "#e4405f" },
                  height: "40px",
                  width: "40px",
                }}
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/sadashrijewelkart_official/",
                    "_blank"
                  )
                }
              />
              <YouTube
                sx={{
                  color: "#ff0000",
                  cursor: "pointer",
                  "&:hover": { color: "#ff0000" },
                  height: "40px",
                  width: "40px",
                }}
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/@sadashri_jewelkart",
                    "_blank"
                  )
                }
              />
              <Pinterest
                sx={{
                  color: "#bd081c",
                  cursor: "pointer",
                  "&:hover": { color: "#bd081c" },
                  height: "40px",
                  width: "40px",
                }}
                onClick={() =>
                  window.open(
                    "https://pinterest.com/sadashrijewelkart",
                    "_blank"
                  )
                }
              />
            </Box>
            <img
              src={process.env.PUBLIC_URL + "/assets/payments.webp"}
              width={matches ? 220 : 180}
            />
          </Grid>

          <Grid item xs={matches ? 3 : 12}>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "1.2rem" : "1rem"}`,
                fontWeight: "bold",
              }}
            >
              Customer Services
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                marginTop: "10px",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open("https://sadashrijewelkart.com/contact", "_blank")
              }
            >
              Contact Us
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  "https://blogs.sadashrijewelkart.com/shipping-and-returns/",
                  "_blank"
                )
              }
            >
              Shipping and Delivery Policy
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  "https://blogs.sadashrijewelkart.com/privacy-policy/",
                  "_blank"
                )
              }
            >
              Privacy Policy
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  "https://blogs.sadashrijewelkart.com/terms-and-conditions/",
                  "_blank"
                )
              }
            >
              Terms and Conditions
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                cursor: "pointer",
              }}
            >
              Refund Policy
            </Typography>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={matches ? 3 : 12}>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "1.2rem" : "1rem"}`,
                fontWeight: "bold",
              }}
            >
              Contact Details
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                marginTop: "10px",
              }}
              align="left"
            >
              Building No./Flat No.: NO 1323/1324
              <br />
              Road/Street: 16TH B CROSS
              <br />
              HOUSING BOARD COLONY EWS 3RD PHASE
              <br />
              Locality/Sub Locality: Yelahanka New Town
              <br />
              City/Town/ Village: Bengaluru
            </Typography>
            <Typography
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
              }}
              align="left"
            >
              District: Bengaluru Urban
              <br />
              State: Karnataka
              <br />
              PIN Code: 560064
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ margin: "30px 0" }} />
        <Typography
          style={{
            fontFamily: '"Roboto", sans-serif',
            fontSize: `${matches ? "0.9rem" : "0.6rem"}`,
            color: "grey",
            marginTop: "10px",
            paddingBottom: "50px",
          }}
          align="center"
        >
          Copyright © {new Date().getFullYear()} Sadāshrī Ventures Private
          Limited. All rights reserved.
          <br />
          CIN: U46498KA2024PTC185784
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
