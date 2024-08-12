import * as React from "react";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#ececec", py: 6 }}>
      <Container style={{ width: "80%" }}>
        <Grid container spacing={4}>
          {/* Column 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="left">
              Know Your Jewellry
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Diamond Guide
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Gold Guide
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Silver Guide
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Gold Rate
            </Typography>
          </Grid>

          {/* Column 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="left">
              Sada Shri Jewel Kart advantages
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              15 days return
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Free shipping
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Financing Options
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Gold Exchange
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="left">
              Customer Services
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Return Policy
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Order Status
            </Typography>
          </Grid>

          {/* Column 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="left">
              Contact Us
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Building No./Flat No.: NO 1323/1324Road/Street: 16TH B CROSS
              HOUSING BOARD COLONY EWS 3RD PHASE Locality/Sub
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              Locality: Yelahanka New TownCity/Town/ Village: Bengaluru
            </Typography>
            <Typography variant="body2" color="textSecondary" align="left">
              District: Bengaluru UrbanState: Karnataka PIN Code: 560064
            </Typography>
          </Grid>

          {/* Column 4 */}
        </Grid>
        <Divider sx={{ margin: "30px 0" }} />
        <Typography variant="body2" color="textSecondary" align="center">
          Copyright © {new Date().getFullYear()} Sada Shri Jewel Kart. All
          rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
