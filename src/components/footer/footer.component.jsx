import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";

function Footer() {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box
      component="footer"
      style={{
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
              alignItems: "center",
              justifyContent: `${matches ? "left" : "center"}`,
              marginBottom: "20px",
            }}
          >
            <img
              src={process.env.PUBLIC_URL + "/assets/logo_dark.png"}
              width={matches ? 220 : 180}
            />
          </Grid>

          <Grid item xs={matches ? 3 : 12}>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "1.2rem" : "1rem"}`,
                fontWeight: "bold",
              }}
            >
              Customer Services
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                marginTop: "10px",
              }}
            >
              Shipping and Delivery Policy
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
              }}
            >
              Terms and Conditions
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
              }}
            >
              Refund Policy
            </Typography>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={matches ? 3 : 12}>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "1.2rem" : "1rem"}`,
                fontWeight: "bold",
              }}
            >
              Contact Details
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
                marginTop: "10px",
              }}
              align="left"
            >
              Building No./Flat No.: NO 1323/1324Road/Street: 16TH B CROSS
              HOUSING BOARD COLONY EWS 3RD PHASE Locality/Sub
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
              }}
              align="left"
            >
              Locality: Yelahanka New TownCity/Town/ Village: Bengaluru
            </Typography>
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: `${matches ? "0.9rem" : "0.8rem"}`,
                color: "grey",
              }}
              align="left"
            >
              District: Bengaluru UrbanState: Karnataka PIN Code: 560064
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ margin: "30px 0" }} />
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: `${matches ? "0.9rem" : "0.6rem"}`,
            color: "grey",
            marginTop: "10px",
            paddingBottom: "50px",
          }}
          align="center"
        >
          Copyright © {new Date().getFullYear()} Sada Shri Ventures Private
          Limited. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
