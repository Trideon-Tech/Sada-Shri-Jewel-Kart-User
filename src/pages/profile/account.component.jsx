import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Box from "@mui/joy/Box";
const Account = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        variant="solid"
        style={{ height: "20vh", width: "20vh", marginTop: "5%" }}
      />
      <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
        Yosemite National Park
      </Typography>
      <Typography level="body-md">arvind.kejriwal@gmail.com </Typography>

      <List
        variant="outlined"
        sx={{
          minWidth: "80%",
          borderRadius: "sm",
        }}
      >
        <ListItem>
          <Typography level="title-md">Email</Typography>
          <Typography style={{ marginLeft: "auto" }} level="body-md">
            sushovanpaul08@gmail.com
          </Typography>
        </ListItem>
        <ListDivider />
        <ListItem>
          <ListItemDecorator>
            <Avatar size="sm" src="/static/images/avatar/2.jpg" />
          </ListItemDecorator>
          Boyd Burt
        </ListItem>
      </List>
    </div>
  );
};

export default Account;
