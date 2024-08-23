import * as React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";

import axios from "axios";
import { useState } from "react";
import AddressTile from "./addressTile.component";
import AddressNew from "./addressNew.component";

const Address = () => {
  const matches = useMediaQuery("(min-width:600px)");

  const [addresses, setAddresses] = useState([]);
  const [refreshAddresses, setRefreshAddresses] = useState(1);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        "https://api.sadashrijewelkart.com//v1.0.0/user/details.php?key=address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data.response);
        setAddresses(response.data.response);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  }, [refreshAddresses]);

  return (
    <Box
      style={{
        width: "100%",

        height: "100%",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "30px",
      }}
    >
      {" "}
      <Box
        style={{
          width: matches ? "70%" : "100%",
          margin: "auto",
          marginBottom: "20px",
          marginTop: "30px",
          textAlign: "left",
        }}
      >
        <Typography
          style={{ marginTop: "2.5%", fontSize: "2rem", fontWeight: "bold" }}
        >
          Saved Addresses
        </Typography>
      </Box>
      <Box
        style={{
          width: matches ? "70%" : "100%",
          margin: "auto",
          marginBottom: "20px",
          marginTop: "10px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        <AddressNew
          refreshAddress={refreshAddresses}
          setRefreshAddress={setRefreshAddresses}
        />
      </Box>
      <Box
        style={{
          width: matches ? "70%" : "100%",
          margin: "auto",
          height: "40%",
          marginTop: "30px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        {addresses
          ? addresses.map((address) => <AddressTile address={address} />)
          : null}
      </Box>
    </Box>
  );
};

export default Address;
