import * as React from "react";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Navbar from "../../components/navbar/navbar.component";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Grid, Box, Divider, Typography } from "@mui/material";
import Account from "./account.component";
import Orders from "./orders.component";
export default function Profile() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar />
      <Box
        style={{
          width: "100%",
          display: "flex",
          height: "100%",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Box style={{ width: "80%", height: "100vh" }}>
          <Tabs
            aria-label="Vertical tabs"
            orientation="vertical"
            sx={{ minWidth: 30, height: "100%" }}
          >
            <TabList style={{ width: "25%", marginTop: "5%" }}>
              <Tab>Account</Tab>
              <Tab>Orders</Tab>
              <Tab>Refunds</Tab>
              <Tab>Offers</Tab>
            </TabList>
            <TabPanel value={0}>
              <div style={{ marginBottom: "2%", marginTop: "5%" }}>

                <Typography variant="h4" style={{ textAlign: "left", color: "#a36e29", fontWeight: "bold" }}>My Profile</Typography>
              </div>
              <Divider style={{ marginBottom: "5%" }} />
              <Account />
            </TabPanel>
            <TabPanel value={1}>
              <div style={{ marginBottom: "2%", marginTop: "5%" }}>

                <Typography variant="h4" style={{ textAlign: "left", color: "#a36e29", fontWeight: "bold" }}>My Orders</Typography>
              </div>
              <Divider style={{ marginBottom: "5%" }} />
              <Orders />
            </TabPanel>
            <TabPanel value={2}>
              <b>second</b> tab panel
            </TabPanel>
            <TabPanel value={3}>
              <b>third</b> tab panel
            </TabPanel>
          </Tabs>
        </Box>
      </Box>
    </div>
  );
}
