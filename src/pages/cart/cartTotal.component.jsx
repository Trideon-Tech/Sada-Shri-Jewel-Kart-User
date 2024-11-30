import { Close, LocalShippingOutlined } from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import { Input } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CartTotal({
  items,
  openModal,
  selectedCouponCode,
  setSelectedCouponId,
  setSelectedCouponCode,
  selectedCouponId,
  couponList,
}) {
  const totalPrice = items
    .map((item) =>
      item.customization === "-1"
        ? parseFloat(item.price)
        : parseFloat(item.customization.variant[0].price)
    )
    .reduce((prev, curr) => prev + curr, 0);

  const [discountValue, setDiscountValue] = useState(0);

  const [locationModalOpen, setLocationModalOpen] = useState();
  const [coinsApplied, setCoinsApplied] = useState(false);

  const handleCouponChange = () => {
    if (selectedCouponCode) {
      //unset Coupon
      setSelectedCouponId(null);
      setSelectedCouponCode(null);
    } else {
      openModal(true);
    }
  };

  const [coinsRedeem, setCoinsRedeem] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [inputPinCode, setInputPinCode] = useState(0);
  const [loadingEstimation, setLoadingEstimation] = useState(false);
  const [pincode, setPincode] = useState("");
  const [currentPosition, setCurrentPosition] = useState([]);
  const [currentPositionAddress, setCurrentPositionAddresss] = useState("");
  const [currentPositionPincode, setCurrentPositionPincode] = useState("");
  const [eta, setETA] = useState("");
  const [mobileLocationModalOpen, setMobileLocationModalOpen] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/wallet.php?type=wallet&user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setCoinsRedeem(response?.data?.response[0].balance);
      })
      .catch((error) => console.log("Error while fetching wallet info", error));
  }, []);

  useEffect(() => {
    if (!selectedCouponId) {
      setDiscountValue(0);
    }

    const selectedCouponData = couponList.filter(
      (item) => item.id === selectedCouponId
    )[0];

    if (selectedCouponData) {
      if (selectedCouponData.amount !== "0") {
        setDiscountValue(Number(selectedCouponData.amount));
      } else {
        setDiscountValue(
          totalPrice * (Number(selectedCouponData.percentage) / 100)
        );
      }
    }
  }, [selectedCouponId]);

  useEffect(() => {
    handleDeliveryEstimation();
  }, [inputPinCode]);

  const handleDeliveryEstimation = () => {
    const pinCode = localStorage.getItem("default_pincode");
    console.log(pinCode);
    if (pinCode && pinCode.length > 5) {
      setLoadingEstimation(true);
      axios
        .get(
          `https://api.sadashrijewelkart.com/v1.0.0/user/sequel.php?type=estimated_date&pincode=${pinCode}&product_id=1`
        )
        .then((response) => {
          setEstimatedDelivery(
            `${response?.data?.response?.data?.estimated_delivery}  ${response?.data?.response?.data?.estimated_day}`
          );
          setLoadingEstimation(false);
        })
        .catch((error) =>
          console.log("Error while fetching wallet info", error)
        );
    }
  };

  const openLocationModal = async () => {
    if (pincode === "") {
      if ("geolocation" in navigator) {
        await navigator.geolocation.getCurrentPosition(async function (
          position
        ) {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);

          let locationResponse = await axios.get(
            `https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&api_key=66d34ff0b8bdb852964430lcwc30d15`
          );

          setCurrentPositionAddresss(locationResponse.data.display_name);
          setCurrentPositionPincode(locationResponse.data.address.postcode);

          console.log("Comes here");
          console.log(locationResponse.data.address.postcode);
          getETA(locationResponse.data.address.postcode, items[0]["id"]);
        });
      }
    }

    setLocationModalOpen(true);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);

    const dayOfMonth = date.getDate();
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // covers 11th, 12th, 13th, etc.
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${dayOfMonth}${daySuffix(dayOfMonth)} ${
      monthNames[date.getMonth()]
    }, ${date.getFullYear()}`;
  };

  const getETA = async (pincode, id) => {
    let etaResponse = await axios.get(
      `https://api.sadashrijewelkart.com/v1.0.0/user/sequel.php?type=estimated_date&pincode=${pincode}&product_id=${id}`
    );

    setETA(() => formatDate(etaResponse.data.response.data.estimated_delivery));
  };

  const getETAFromInput = async (pincode, id) => {
    let etaResponse = await axios.get(
      `https://api.sadashrijewelkart.com/v1.0.0/user/sequel.php?type=estimated_date&pincode=${pincode}&product_id=${id}`
    );

    // Getting lat lng from Pincode
    let latLngResponse = await axios.get(
      `https://geocode.maps.co/search?q=${pincode}&api_key=66d34ff0b8bdb852964430lcwc30d15`
    );

    const timer = setTimeout(async () => {
      // Getting add from lat lng
      let addResponse = await axios.get(
        `https://geocode.maps.co/reverse?lat=${latLngResponse.data[0].lat}&lon=${latLngResponse.data[0].lon}&api_key=66d34ff0b8bdb852964430lcwc30d15`
      );

      setCurrentPositionAddresss(addResponse.data.display_name);
      setCurrentPositionPincode(addResponse.data.address.postcode);
      setETA(() =>
        formatDate(etaResponse.data.response.data.estimated_delivery)
      );
    }, 1000);

    return () => clearTimeout(timer);
  };

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <div>
      {/* Web */}
      <Modal
        open={locationModalOpen}
        onClose={() => {
          setLocationModalOpen(false);
        }}
      >
        <ModalOverflow>
          <ModalDialog
            style={{ width: "30vw", height: "30vw", padding: "30px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1.2rem",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Locate Me now
                </p>
                <Close
                  onClick={() => {
                    setLocationModalOpen(false);
                  }}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50px",
                }}
              >
                <PinDropOutlinedIcon
                  style={{ fontSize: "4.5rem", color: "#a36e29" }}
                />
                <p
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                >
                  Add your Pincode to
                  <br />
                  Browse Better
                </p>
              </div>
              <div style={{ width: "100%", height: "max-content" }}>
                <Input
                  sx={{
                    width: "100%",
                    height: "3rem",
                    backgroundColor: "#F9F5EC",
                    border: 0,
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                  placeholder="Enter your pincode"
                  inputProps={{ "aria-label": "Enter your Pincode" }}
                  startDecorator={
                    <MyLocationIcon
                      style={{
                        paddingRight: "10px",
                      }}
                    />
                  }
                  endDecorator={
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#A36E29",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (pincode == 6) {
                          setPincode(pincode);
                          localStorage.setItem("default_pincode", pincode);
                          setLocationModalOpen(false);
                        }
                      }}
                    >
                      Add
                    </p>
                  }
                  onChange={(event) => {
                    console.log(event.target.value);
                    if (event.target.value.length == 6) {
                      setPincode(event.target.value);
                      localStorage.setItem(
                        "default_pincode",
                        event.target.value
                      );
                      console.log("Sending");
                      console.log(event.target.value);
                      getETAFromInput(event.target.value, items[0]["id"]);
                    }
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "max-content",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    color: "#A36E29",
                    paddingLeft: "20px",
                    paddingTop: "12px",
                    paddingBottom: "20px",
                  }}
                >
                  <LocalShippingOutlined />
                  <span
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}
                  >
                    {eta === ""
                      ? "Calculating Estimated Date of Delivery"
                      : `Estimated delivery by ${eta}`}
                  </span>
                </div>
              </div>
              <Card
                elevation={4}
                sx={{
                  width: "calc(100% - 40px)",
                  height: "3rem",
                  display: "flex",
                  borderRadius: "10px",
                  padding: "20px",
                  paddingBottom: "25px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginBottom: "3px",
                    }}
                  >
                    City Located
                  </div>
                  <div
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      marginTop: "3px",
                      color: "grey",
                    }}
                  >
                    {currentPositionAddress.length > 0
                      ? currentPositionAddress
                      : "Detecting your location"}
                  </div>
                </div>
                <div
                  style={{ marginLeft: "auto", width: "30%", height: "100%" }}
                >
                  <p
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "#A36E29",
                      textAlign: "right ",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPincode(currentPositionPincode);
                      localStorage.setItem(
                        "default_pincode",
                        currentPositionPincode
                      );
                      setLocationModalOpen(false);
                    }}
                  >
                    Submit
                  </p>
                </div>
              </Card>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
      {/* Mobile */}
      <Modal
        open={mobileLocationModalOpen}
        onClose={() => {
          setMobileLocationModalOpen(false);
        }}
      >
        <ModalOverflow>
          <ModalDialog style={{ padding: "30px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1.2rem",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  Locate Me now
                </p>
                <Close
                  onClick={() => {
                    setMobileLocationModalOpen(false);
                  }}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "30%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50px",
                }}
              >
                <PinDropOutlinedIcon
                  style={{ fontSize: "4.5rem", color: "#a36e29" }}
                />
                <p
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                >
                  Add your Pincode to
                  <br />
                  Browse Better
                </p>
              </div>
              <div style={{ width: "100%", height: "max-content" }}>
                <Input
                  sx={{
                    width: "100%",
                    height: "3rem",
                    backgroundColor: "#F9F5EC",
                    border: 0,
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                  placeholder="Enter your pincode"
                  inputProps={{ "aria-label": "Enter your Pincode" }}
                  startDecorator={
                    <MyLocationIcon
                      style={{
                        paddingRight: "10px",
                      }}
                    />
                  }
                  endDecorator={
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#A36E29",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (pincode == 6) {
                          setPincode(pincode);
                          localStorage.setItem("default_pincode", pincode);
                          setMobileLocationModalOpen(false);
                        }
                      }}
                    >
                      Add
                    </p>
                  }
                  onChange={(event) => {
                    console.log(event.target.value);
                    if (event.target.value.length == 6) {
                      setPincode(event.target.value);
                      localStorage.setItem(
                        "default_pincode",
                        event.target.value
                      );
                      getETAFromInput(event.target.value, items[0]["id"]);
                    }
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "max-content",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    color: "#A36E29",
                    paddingLeft: "20px",
                    paddingTop: "12px",
                    paddingBottom: "20px",
                  }}
                >
                  <LocalShippingOutlined />
                  <span
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}
                  >
                    {eta === ""
                      ? "Calculating Estimated Date of Delivery"
                      : `Estimated delivery by ${eta}`}
                  </span>
                </div>
              </div>
              <Card
                elevation={4}
                sx={{
                  width: "calc(100% - 40px)",
                  height: "3rem",
                  display: "flex",
                  borderRadius: "10px",
                  padding: "20px",
                  paddingBottom: "25px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginBottom: "3px",
                    }}
                  >
                    City Located
                  </div>
                  <div
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.6rem",
                      fontWeight: "bold",
                      marginTop: "3px",
                      color: "grey",
                    }}
                  >
                    {currentPositionAddress.length > 0
                      ? currentPositionAddress
                      : "Detecting your location"}
                  </div>
                </div>
                <div
                  style={{ marginLeft: "auto", width: "30%", height: "100%" }}
                >
                  <p
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "#A36E29",
                      textAlign: "right ",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPincode(currentPositionPincode);
                      localStorage.setItem(
                        "default_pincode",
                        currentPositionPincode
                      );
                      setMobileLocationModalOpen(false);
                    }}
                  >
                    Submit
                  </p>
                </div>
              </Card>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
      {/* Web */}
      <div
        style={{
          display: matches ? "block" : "none",
        }}
      >
        <Box
          style={{
            width: "100%",
            height: "30vh",
            display: "flex",
            flexDirection: "column",
            marginTop: "10%",
            justifyContent: "space-between",
          }}
        >
          <Card
            style={{
              width: "90%",
              minHeight: 65,
              height: "7vh",
              borderRadius: "10px",
              backgroundColor: "white",
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
            }}
            elevation={1}
          >
            <MonetizationOnRoundedIcon
              style={{ fontSize: "2rem", color: "#A36E29" }}
            />
            <Typography
              style={{
                marginLeft: "2%",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                marginRight: "auto",
              }}
            >
              Coins Available :{" "}
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {coinsRedeem}
              </span>
            </Typography>
            <Button
              variant="outlined"
              style={{
                border: 0,
                fontSize: "0.8rem",
                color: "#A36E29",
                fontWeight: "bold",
                textTransform: "none",
                fontFamily: '"Open Sans", sans-serif',
              }}
              onClick={() => {
                setCoinsApplied(!coinsApplied);
              }}
            >
              {coinsApplied ? "Remove" : "Apply"}
            </Button>
          </Card>
          <Card
            style={{
              width: "90%",
              minHeight: 65,
              height: "7vh",
              borderRadius: "10px",
              backgroundColor: "white",
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
            }}
            elevation={1}
          >
            <PinDropIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                marginRight: "auto",
                marginLeft: "2%",
              }}
            >
              Delivering to :{" "}
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {localStorage.getItem("default_pincode")}
              </span>
            </Typography>
            <Button
              variant="outlined"
              style={{
                border: 0,
                fontSize: "0.8rem",
                color: "#A36E29",
                fontWeight: "bold",
                textTransform: "none",
                fontFamily: '"Open Sans", sans-serif',
              }}
              onClick={openLocationModal}
            >
              Change Pincode
            </Button>
          </Card>
          <Card
            style={{
              width: "90%",
              minHeight: 65,
              height: "7vh",
              borderRadius: "10px",
              backgroundColor: "white",
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
              textAlign: "left",
            }}
            elevation={1}
          >
            <LocalOfferIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
            <Typography
              style={{
                marginLeft: "5%",
                marginRight: "auto",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                color: selectedCouponCode ? "#A36E29" : "black",
                fontWeight: selectedCouponCode ? "bold" : "normal",
              }}
            >
              {selectedCouponCode
                ? `Applied ${selectedCouponCode}`
                : "Apply Coupon"}
            </Typography>
            <Button
              variant="outlined"
              style={{ border: 0, color: "#A36E29", fontWeight: "bold" }}
              onClick={() => handleCouponChange()}
            >
              {!selectedCouponCode ? <ArrowForwardIosIcon /> : <CloseIcon />}
            </Button>
          </Card>
          <Card
            style={{
              width: "90%",
              minHeight: 200,
              height: "max-content",
              borderRadius: "10px",
              backgroundColor: "white",
              padding: "5%",
              paddingTop: "3%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "flex-start",
              marginBottom: "5%",
              textAlign: "left",
            }}
            elevation={1}
          >
            <Typography
              style={{
                textAlign: "left",
                fontWeight: "bold",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1.2rem",
              }}
            >
              Order Summary
            </Typography>
            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "gray",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                Subtotal:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                ₹ {Number(totalPrice).toFixed(2)}
              </Typography>
            </Box>

            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "gray",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                Discount:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                ₹ {Number(discountValue).toFixed(2)}
              </Typography>
            </Box>
            {coinsApplied ? (
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "gray",
                }}
              >
                <Typography
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                >
                  Coins Redeemed:
                </Typography>
                <Typography
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {Number(coinsRedeem).toFixed(2)}
                </Typography>
              </Box>
            ) : null}
            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "gray",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                You Saved:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                ₹{" "}
                {(
                  Number(discountValue) +
                  (coinsApplied ? Number(coinsRedeem) : 0)
                ).toFixed(2)}
              </Typography>
            </Box>
            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#050505",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Total:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.1rem",
                  color: "#A36E29",
                  fontWeight: "bold",
                }}
              >
                ₹{" "}
                {(
                  Number(totalPrice) -
                  discountValue -
                  (coinsApplied ? coinsRedeem : 0)
                ).toFixed(2)}
              </Typography>
            </Box>
          </Card>
          <Button
            variant="contained"
            style={{
              marginBottom: "5%",
              backgroundColor: "#a36e29",
              borderRadius: "10px",
              elevation: "0",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "600",
              background: "#a36e29",
            }}
            component={Link}
            to={
              localStorage.getItem("token")
                ? `/checkout?discount=${selectedCouponId}&coins=${
                    coinsApplied ? coinsRedeem : 0
                  }`
                : "/signin"
            }
            fullWidth
          >
            {localStorage.getItem("token") ? "CHECKOUT" : "SIGN IN TO PROCEED"}
          </Button>
        </Box>
      </div>
      {/* Mobile */}
      <div
        style={{
          display: matches ? "none" : "block",
        }}
      >
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: "5%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "90%",
              minHeight: 65,
              height: "7vh",
              borderRadius: "10px",
              backgroundColor: "white",
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
            }}
            elevation={1}
          >
            <MonetizationOnRoundedIcon
              style={{ fontSize: "2rem", color: "#A36E29" }}
            />
            <Typography
              style={{
                marginLeft: "2%",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                marginRight: "auto",
              }}
            >
              Coins Available :{" "}
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {coinsRedeem}
              </span>
            </Typography>
            <Button
              variant="outlined"
              style={{
                border: 0,
                fontSize: "0.8rem",
                color: "#A36E29",
                fontWeight: "bold",
                textTransform: "none",
                fontFamily: '"Open Sans", sans-serif',
              }}
              onClick={() => {
                setCoinsApplied(!coinsApplied);
              }}
            >
              {coinsApplied ? "Remove" : "Apply"}
            </Button>
          </Card>
          <Card
            style={{
              width: "90%",
              minHeight: 65,
              height: "7vh",
              borderRadius: "10px",
              backgroundColor: "white",
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
            }}
            elevation={1}
          >
            <PinDropIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
            <Typography
              style={{
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                marginRight: "auto",
                marginLeft: "2%",
              }}
            >
              Delivering to :{" "}
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {localStorage.getItem("default_pincode")}
              </span>
            </Typography>
            <Button
              variant="outlined"
              style={{
                border: 0,
                fontSize: "0.8rem",
                color: "#A36E29",
                fontWeight: "bold",
                textTransform: "none",
                fontFamily: '"Open Sans", sans-serif',
              }}
              onClick={() => setMobileLocationModalOpen(true)}
            >
              Change Pincode
            </Button>
          </Card>
          <Card
            style={{
              width: "90%",
              minHeight: 65,
              height: "7vh",
              borderRadius: "10px",
              backgroundColor: "white",
              paddingLeft: "5%",
              paddingRight: "5%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%",
              textAlign: "left",
            }}
            elevation={1}
          >
            <LocalOfferIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
            <Typography
              style={{
                marginLeft: "5%",
                marginRight: "auto",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                color: selectedCouponCode ? "#A36E29" : "black",
                fontWeight: selectedCouponCode ? "bold" : "normal",
              }}
            >
              {selectedCouponCode
                ? `Applied ${selectedCouponCode}`
                : "Apply Coupon"}
            </Typography>
            <Button
              variant="outlined"
              style={{ border: 0, color: "#A36E29", fontWeight: "bold" }}
              onClick={() => handleCouponChange()}
            >
              {!selectedCouponCode ? <ArrowForwardIosIcon /> : <CloseIcon />}
            </Button>
          </Card>
          <Card
            style={{
              width: "90%",
              minHeight: 200,
              height: "max-content",
              borderRadius: "10px",
              backgroundColor: "white",
              padding: "5%",
              paddingTop: "3%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "flex-start",
              marginBottom: "5%",
              textAlign: "left",
            }}
            elevation={1}
          >
            <Typography
              style={{
                textAlign: "left",
                fontWeight: "bold",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "1.2rem",
              }}
            >
              Order Summary
            </Typography>
            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "gray",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                Subtotal:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                ₹ {Number(totalPrice).toFixed(2)}
              </Typography>
            </Box>

            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "gray",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                Discount:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                ₹ {Number(discountValue).toFixed(2)}
              </Typography>
            </Box>
            {coinsApplied ? (
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "gray",
                }}
              >
                <Typography
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                >
                  Coins Redeemed:
                </Typography>
                <Typography
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {Number(coinsRedeem).toFixed(2)}
                </Typography>
              </Box>
            ) : null}
            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "gray",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                You Saved:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                ₹{" "}
                {(
                  Number(discountValue) +
                  (coinsApplied ? Number(coinsRedeem) : 0)
                ).toFixed(2)}
              </Typography>
            </Box>
            <Box
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#050505",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Total:
              </Typography>
              <Typography
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.1rem",
                  color: "#A36E29",
                  fontWeight: "bold",
                }}
              >
                ₹{" "}
                {(
                  Number(totalPrice) -
                  discountValue -
                  (coinsApplied ? coinsRedeem : 0)
                ).toFixed(2)}
              </Typography>
            </Box>
          </Card>
          <Button
            variant="contained"
            style={{
              marginBottom: "5%",
              backgroundColor: "#a36e29",
              borderRadius: "10px",
              elevation: "0",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              fontWeight: "600",
              background: "#a36e29",
            }}
            component={Link}
            to={
              localStorage.getItem("token")
                ? `/checkout?discount=${selectedCouponId}&coins=${
                    coinsApplied ? coinsRedeem : 0
                  }`
                : "/signin"
            }
            fullWidth
          >
            {localStorage.getItem("token") ? "CHECKOUT" : "SIGN IN TO PROCEED"}
          </Button>
        </Box>
      </div>
    </div>
  );
}
