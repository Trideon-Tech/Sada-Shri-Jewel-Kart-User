import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressNew from "./addressNew.component";
import AddressTile from "./addressTile.component";

const Address = () => {
  const matches = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [refreshAddresses, setRefreshAddresses] = useState(1);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/details.php?key=address`,
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

  return matches ? (
    <Box
      style={{
        width: "100%",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "30px",
      }}
    >
      <Box
        style={{
          width: matches ? "70%" : "100%",
          marginBottom: "20px",
          marginTop: "50px",
          textAlign: "left",
        }}
      >
        <Typography
          style={{
            marginTop: "20px",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
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
  ) : (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "calc(10px + 3vh)",
        position: "relative",
        paddingBottom: !matches ? "80px" : "0",
      }}
    >
      <Box
        style={{
          width: "100%",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          height: "90%",
        }}
      >
        <Box
          style={{
            width: matches ? "70%" : "90%",
            marginBottom: "20px",
            marginTop: "20px",
            textAlign: "left",
          }}
        >
          <Typography
            style={{
              marginTop: "20px",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Saved Addresses
          </Typography>
        </Box>
        <Box
          style={{
            width: "90%",
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
            width: matches ? "70%" : "90%",
            margin: "auto",
            height: "40%",
            marginTop: "20px",
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
      {!matches ? (
        <BottomNavigation
          showLabels
          style={{
            background: "rgba(163,110,41)",
            border: "1px solid #a36e29",
            borderRadius: "50px",
            height: "40px",
            width: "90%",
            position: "fixed",
            bottom: 20,
            zIndex: 1000,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <BottomNavigationAction
            label="Profile"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account")}
          />
          <BottomNavigationAction
            label="Orders"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/orders")}
          />
          <BottomNavigationAction
            label="Address"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "600",
                color: "white",
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/my-account/address")}
          />
          <BottomNavigationAction
            label="Wallet"
            sx={{
              "& .MuiBottomNavigationAction-label": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
            }}
            onClick={() => navigate("/my-account/wallet")}
          />
        </BottomNavigation>
      ) : null}
    </div>
  );
};

export default Address;
