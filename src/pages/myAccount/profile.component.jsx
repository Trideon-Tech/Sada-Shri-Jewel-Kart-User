import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";

import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import Input from "@mui/joy/Input";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Box from "@mui/joy/Box";
import { Button } from "@mui/joy";
const Profile = () => {
  const userData = {
    firstName: "Sushovan",
    lastName: "Paul",
    phone: "8102334451",
    gender: "Male",
  };
  const [editing, setEditing] = React.useState(false);

  const [firstName, setFirstName] = React.useState("Sushovan");
  const [lastName, setLastName] = React.useState("Paul");
  const [gender, setGender] = React.useState("Male");
  const [phone, setPhone] = React.useState("8102312341");

  const cancelEditHandler = () => {
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setGender(userData.gender);
    setPhone(userData.phone);
    setEditing(false);
  };

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
      <Typography level="h2" fontSize="xl" sx={{ mb: 0.5, mt: 0.5 }}>
        Arvind Kejriwal
      </Typography>
      <Typography level="body-md" style={{ marginBottom: "3%" }}>
        arvind.kejriwal@gmail.com{" "}
      </Typography>

      <div style={{ height: "70vh", width: "100%" }}>
        <List
          variant="outlined"
          sx={{
            minHeight: "max-content",
            minWidth: "80%",
            borderRadius: "sm",
          }}
          style={{ height: "max-content" }}
        >
          <ListItem>
            <Box
              style={{
                width: "100%",
                height: "10%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography style={{ height: "6vh" }} level="title-md">
                First Name
              </Typography>
              {editing ? (
                <Input
                  style={{ marginLeft: "auto", width: "30%" }}
                  size="md"
                  placeholder="Large"
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                  }}
                />
              ) : (
                <Typography style={{ marginLeft: "auto" }} level="body-md">
                  {firstName}
                </Typography>
              )}
            </Box>
          </ListItem>
          <ListDivider />
          <ListItem>
            <Typography style={{ height: "6vh" }} level="title-md">
              Last Name
            </Typography>
            {editing ? (
              <Input
                style={{ marginLeft: "auto", width: "30%" }}
                size="md"
                placeholder="Large"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            ) : (
              <Typography style={{ marginLeft: "auto" }} level="body-md">
                {lastName}
              </Typography>
            )}
          </ListItem>
          <ListDivider />
          <ListItem>
            <Typography style={{ height: "6vh" }} level="title-md">
              Gender
            </Typography>
            {editing ? (
              <Select
                defaultValue={gender}
                placeholder="Select Gender"
                name="foo"
                required
                sx={{ minWidth: 200 }}
                style={{ marginLeft: "auto", width: "30%" }}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            ) : (
              <Typography style={{ marginLeft: "auto" }} level="body-md">
                {gender}
              </Typography>
            )}
          </ListItem>
          <ListDivider />
          <ListItem>
            <Typography style={{ height: "6vh" }} level="title-md">
              Phone Number
            </Typography>
            {editing ? (
              <Input
                style={{ marginLeft: "auto", width: "30%" }}
                size="md"
                placeholder="Large"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
              />
            ) : (
              <Typography style={{ marginLeft: "auto" }} level="body-md">
                {phone}
              </Typography>
            )}
          </ListItem>
          <ListDivider />

          <ListItem>
            {editing ? (
              <>
                <Button
                  variant="outlined"
                  style={{ marginLeft: "auto", color: "#a36e29" }}
                  onClick={cancelEditHandler}
                >
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: "3%", backgroundColor: "#a36e29" }}
                  onClick={() => setEditing(!editing)}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                style={{ marginLeft: "auto", backgroundColor: "#a36e29" }}
                onClick={() => setEditing(!editing)}
              >
                Edit
              </Button>
            )}
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default Profile;
