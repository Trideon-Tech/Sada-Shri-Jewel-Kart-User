import { Box, Button, Card, Typography } from "@mui/material";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import OrderItem from "./orderItem.component";
import { TabPanel } from "@mui/joy";
const Orders = () => {
  return (
    <Box
      style={{
        width: "100%",
        padding: "1%",
        paddingRight: "14%",
        height: "100%",
        overflowY: "scroll",
        display: "flex",
        marginLeft: "auto",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Box style={{ width: "70%", margin: "auto", textAlign: "left" }}>
        <Typography
          style={{ marginTop: "2.5%", fontSize: "2rem", fontWeight: "bold" }}
        >
          Orders and Returns
        </Typography>
      </Box>

      <Tabs
        aria-label="tabs"
        defaultValue={0}
        style={{ width: "70%", margin: "auto" }}
        sx={{ marginTop: "2.5%", marginBottom: "5%", bgcolor: "transparent" }}
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

            [`& .${tabClasses.root}[aria-selected="true"]`]: {
              boxShadow: "sm",
              border: "2px solid #a36e29",
              bgcolor: "white",
              color: "#a36e29",
              fontWeight: "bold",
            },
          }}
        >
          <Tab disableIndicator>In Progress</Tab>
          <Tab disableIndicator>Completed</Tab>
          <Tab disableIndicator>Cancelled</Tab>
        </TabList>
        <TabPanel value={0} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            <OrderItem />
            <OrderItem />
            <OrderItem />
            <OrderItem />
          </Box>
        </TabPanel>
        <TabPanel value={1} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            <OrderItem titleColorType="delivered" />
            <OrderItem titleColorType="delivered" />
            <OrderItem titleColorType="delivered" />
            <OrderItem titleColorType="delivered" />
          </Box>
        </TabPanel>
        <TabPanel value={2} style={{ padding: 0, paddingTop: "20px" }}>
          <Box style={{ width: "100%", height: "100%" }}>
            <OrderItem titleColorType="cancelled" />
            <OrderItem titleColorType="cancelled" />
            <OrderItem titleColorType="cancelled" />
            <OrderItem titleColorType="cancelled" />
          </Box>
        </TabPanel>
      </Tabs>
      {/* <OrderItem />
        <OrderItem />
        <OrderItem />
        <OrderItem /> */}
    </Box>
  );
};
export default Orders;
