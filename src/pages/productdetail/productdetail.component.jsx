import {
  LocalShippingOutlined,
  LocationOnOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import DimensionsIcon from "@mui/icons-material/AspectRatio";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PurityIcon from "@mui/icons-material/CheckCircleOutline";
import WeightIcon from "@mui/icons-material/ScaleOutlined";
import ShareIcon from "@mui/icons-material/Share";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { generalToastStyle } from "../../utils/toast.styles";
import { toast, ToastContainer } from "react-toastify";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import "react-toastify/dist/ReactToastify.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Grid,
  OutlinedInput,
  Slide,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";

import "./productdetail.styles.scss";

import JwelleryCard from "../../components/card/jwellerycard.component";
import Navbar from "../../components/navbar/navbar.component";
import ImageVideoCarousel from "./carousal.component";
import { Input, Textarea } from "@mui/joy";
import Reviews from "../../components/reviews/reviews.component";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a36e29",
    },
  },
  typography: {
    fontFamily: '"Work Sans", sans-serif',
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ProductDetail() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const { product } = useParams();
  const navigate = useNavigate();
  const [menuItemName, hashId] = product.split("-");

  const [customizationOptions, setCustomizationOptions] = useState({
    metal: [],
    diamondQuality: [],
    size: [],
  });

  const [productDetail, setProductDetail] = useState({
    images: [],
    recommended: [],
  });

  const addToCartHandler = () => {
    const token = localStorage.getItem("token");

    axios
      .put(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
        {
          product: productDetail.id,
          customization: -1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        console.log(`Product with ID ${productDetail.id} sent to API`);
        toast.info("Product Added to Cart", generalToastStyle);
        navigate("/cart");
      })
      .catch((error) => {
        console.error(
          `Error sending product with ID ${productDetail.id} to API`,
          error
        );
        toast.error(error.response.data.message, generalToastStyle);
      });

    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        sessionStorage.setItem("cart", response.data.response.length);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedDiamondType, setSelectedDiamondType] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [variants, setVariants] = useState([]); //for variant
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(""); //for variant price
  const [pincode, setPincode] = useState();
  const [locationModalOpen, setLocationModalOpen] = useState();

  const updateSelectedVariantPrice = () => {
    const selectedOptions = [selectedMetal, selectedDiamondType, selectedSize];

    const matchingVariant = variants.find((variant) =>
      selectedOptions.every(
        (option, index) => variant.for_customization_options[index] === option
      )
    );

    if (matchingVariant) {
      setSelectedVariantPrice(matchingVariant.price);
    } else {
      setSelectedVariantPrice(productDetail.price);
    }
  };

  const handleCustomizationSelect = (metal) => {
    setSelectedMetal(metal);
    setDrawerOpen(false);
  };

  const handleDiamondTypeSelect = (diamondType) => {
    setSelectedDiamondType(diamondType);
    setDrawerOpen(false);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setDrawerOpen(false); // Close the drawer
  };

  useEffect(() => {
    updateSelectedVariantPrice();
  }, [selectedMetal, selectedDiamondType, selectedSize]);

  const getJwelleryDetail = () => {
    const userId = localStorage.getItem("user_id")
      ? localStorage.getItem("user_id")
      : -1;
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/details.php?name=${menuItemName}&hash=${hashId}&user_id=${userId}`
      )
      .then((response) => {
        const detail = response.data.response;

        const fetchedImages = detail.images
          .filter((item) => item.type === "img")
          .map(
            (item) => `https://api.sadashrijewelkart.com/assets/${item.file}`
          );
        setImages(fetchedImages);

        if (detail.video !== "Product Infographics doesn't exist.") {
          const fetchedVideo = detail.video
            ? `https://api.sadashrijewelkart.com/assets/${detail.video.file}`
            : "";
          setVideo(fetchedVideo);
        }

        setProductDetail(detail);
        setCustomizationOptions({
          metal:
            detail.customizations.options_per_field["Choice Of Metal"] || [],
          diamondQuality:
            detail.customizations.options_per_field["Diamond Quality"] || [],
          size: detail.customizations.options_per_field["Select Size"] || [],
        });

        setVariants(detail.customizations.variants.options);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCardClick = (productName, hash) => {
    navigate(`/item/${menuItemName}/${productName}-${hash}`);
    navigate(0);
  };

  useEffect(() => {
    getJwelleryDetail();
  }, []);

  const handleMobileDrawerOpen = () => {
    setMobileDrawerOpen(true);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [openShareDialog, setOpenShareDialog] = React.useState(false);
  const handleClickOpen = () => {
    console.log("trigereed");
    setOpenShareDialog(true);
  };

  const handleClose = () => {
    setOpenShareDialog(false);
  };
  return (
    <div className="product-detail">
      <Navbar />
      <ToastContainer />
      <Modal
        open={locationModalOpen}
        onClose={() => {
          setLocationModalOpen(false);
        }}
      >
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="modal-dialog-overflow"
            style={{ width: "500px", height: "600px", padding: "30px" }}
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
                }}
              >
                <p style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
                  Locate me now
                </p>
                <ModalClose />
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
                  style={{ fontSize: "5rem", color: "#a36e29" }}
                />
                <p
                  style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    width: "300px",
                    fontWeight: 600,
                  }}
                >
                  Add your Pincode to Browse Better
                </p>
              </div>
              <div style={{ width: "100%", height: "max-content" }}>
                <Input
                  sx={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#F9F5EC",
                    border: 0,
                  }}
                  placeholder="Enter your Pincode"
                  inputProps={{ "aria-label": "Enter your Pincode" }}
                  startDecorator={<MyLocationIcon />}
                  endDecorator={
                    <p style={{ fontWeight: 600, color: "#A36E29" }}>ADD</p>
                  }
                />
                <div
                  style={{
                    width: "100%",
                    height: "max-content",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    color: "#A36E29",
                    fontWeight: 600,
                    paddingLeft: "20px",
                  }}
                >
                  <LocalShippingOutlinedIcon />
                  <p>{"  "}Estimated delivery by 12 July</p>
                </div>
              </div>
              <Card
                elevation={4}
                sx={{
                  width: "calc(100% - 40px)",
                  height: "60px",
                  display: "flex",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <div style={{ width: "70%", height: "100%" }}>
                  <h4
                    style={{
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    City Location
                  </h4>
                  <p style={{ margin: 0, color: "gray", fontWeight: 600 }}>
                    Jamshedpur, Jharkhand
                  </p>
                </div>
                <div
                  style={{ marginLeft: "auto", width: "30%", height: "100%" }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#A36E29",
                      textAlign: "right ",
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
      <Dialog
        open={openShareDialog}
        maxWidth={200}
        style={{
          borderRadius: "20px",
          margin: "auto",
          width: "100%",
        }}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Share product</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions
          style={{
            display: "flex",
            padding: "20px",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "150px",
              height: "100px",
              border: "2px solid #a36e29",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Typography style={{ color: "#707070" }}>
              Share On WhatsApp
            </Typography>
            <Button
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#e7e7e7",
              }}
            >
              <WhatsAppIcon style={{ fontSize: "1.5rem", color: "#a36e29" }} />
            </Button>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "150px",
              height: "100px",
              border: "2px solid #a36e29",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography style={{ color: "#707070" }}>Click To Copy</Typography>
            <Button
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#e7e7e7",
              }}
              onClick={() => navigator.clipboard.writeText(window.location)}
            >
              <ContentCopyIcon
                style={{ fontSize: "1.5rem", color: "#a36e29" }}
              />
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <div className="web">
        <div className="container">
          <div className="product-content">
            <div
              className="product-image-section"
              style={{ position: "relative" }}
            >
              <Box
                style={{
                  position: "absolute",
                  zIndex: 2,
                  width: "100%",
                  display: "flex",
                }}
              >
                <FavoriteIcon
                  style={{
                    fontSize: "2.5rem",
                    marginLeft: "auto",
                    marginRight: "5%",
                    marginTop: "5%",
                    color: productDetail.exists_in_wishlist
                      ? "#a36e29"
                      : "#bfbfbf",
                  }}
                />
              </Box>
              {/* Placeholder for product images */}
              <ImageVideoCarousel images={images} video={video} />
            </div>
            <div className="product-detail-section">
              <div className="title">
                <Typography
                  variant="h5"
                  component="h1"
                  style={{ marginTop: "2%", fontWeight: "bold" }}
                >
                  {menuItemName}
                </Typography>
              </div>
              <Box
                style={{
                  width: "100%",
                  height: "5%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <Box
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "100px",
                    width: "20%",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                  }}
                >
                  <Typography>3.5</Typography>
                  <StarBorderRoundedIcon
                    style={{ fontSize: "1.5rem", color: "orange" }}
                  />
                  <Typography>(500 reviews)</Typography>
                </Box>
                <Box
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "auto",
                    width: "30%",
                    paddingLeft: "2%",
                  }}
                >
                  <Box
                    style={{
                      marginLeft: "auto",
                      width: "50px",
                      height: "50px",
                      borderRadius: "15px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: "2%",
                      paddingRight: "2%",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickOpen()}
                  >
                    <ShareIcon
                      style={{ fontSize: "1.5rem", color: "#a36e29" }}
                    />
                  </Box>
                </Box>
              </Box>
              <Grid container spacing={3} style={{ marginTop: "2%" }}>
                <Grid item xs={6} className="customization-grid">
                  {customizationOptions.metal.length > 0 &&
                    customizationOptions.diamondQuality.length > 0 &&
                    customizationOptions.size.length > 0 && (
                      <Box>
                        <Box sx={{ marginBottom: 2 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              display: "flex",
                              alignItems: "start",
                              color: "#666",
                            }}
                          >
                            Select Size
                          </Typography>

                          <Box
                            onClick={handleDrawerOpen}
                            style={{
                              width: "325px",
                              height: "55px",
                              backgroundColor: "white",
                              display: "flex",
                              justifyContent: "flex-start",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              alignItems: "center",
                              border: "2px solid #e1e1e1",
                              borderRadius: "10px",
                            }}
                          >
                            {selectedSize ? (
                              <Box
                                style={{
                                  borderRadius: "10px",
                                  width: "max-content",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                  height: "35px",
                                  backgroundColor: "#A36E29",
                                  color: "white",
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                }}
                              >
                                <Typography style={{ fontWeight: "bold" }}>
                                  {selectedSize}
                                </Typography>
                              </Box>
                            ) : null}
                            <KeyboardArrowDownIcon
                              style={{
                                marginLeft: "auto",
                                color: "darkgray",
                                fontSize: "1.5rem",
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              display: "flex",
                              alignItems: "start",
                              color: "#666",
                            }}
                          >
                            Select Customization
                          </Typography>
                          <Box
                            onClick={handleDrawerOpen}
                            style={{
                              width: "325px",
                              height: "55px",
                              backgroundColor: "white",
                              display: "flex",
                              justifyContent: "flex-start",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              alignItems: "center",
                              border: "2px solid #e1e1e1",
                              borderRadius: "10px",
                            }}
                          >
                            {selectedMetal ? (
                              <Box
                                style={{
                                  borderRadius: "10px",
                                  width: "max-content",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                  marginRight: "10px",
                                  height: "35px",
                                  backgroundColor: "#A36E29",
                                  color: "white",
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                }}
                              >
                                <Typography style={{ fontWeight: "bold" }}>
                                  {selectedMetal}
                                </Typography>
                              </Box>
                            ) : null}
                            {selectedDiamondType ? (
                              <Box
                                style={{
                                  borderRadius: "10px",
                                  width: "max-content",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                  height: "35px",
                                  backgroundColor: "#A36E29",
                                  color: "white",
                                  display: "flex",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                }}
                              >
                                <Typography style={{ fontWeight: "bold" }}>
                                  {selectedDiamondType}
                                </Typography>
                              </Box>
                            ) : null}
                            <KeyboardArrowDownIcon
                              style={{
                                marginLeft: "auto",
                                color: "darkgray",
                                fontSize: "1.5rem",
                              }}
                            />
                          </Box>
                        </Box>
                        <Drawer
                          anchor="right"
                          open={drawerOpen}
                          onClose={handleDrawerClose}
                        >
                          <Box
                            sx={{
                              padding: 2,
                              width: 500,
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ fontWeight: "bold" }}
                            >
                              Choice of Metal
                            </Typography>
                            {/* Add Buttons or another component to select metal choice */}
                            <Grid container>
                              {customizationOptions.metal.map(
                                (metalOption, index) => (
                                  <Grid item xs={4} key={index}>
                                    <Button
                                      variant="outlined"
                                      sx={{
                                        margin: 1,
                                        padding: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        textAlign: "center",
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        // "&.selected": {
                                        //   backgroundColor: "primary.main",
                                        //   color: "primary.contrastText",
                                        //   "&:hover": {
                                        //     backgroundColor: "#a36e29",
                                        //   },
                                        // },
                                      }}
                                      onClick={() =>
                                        handleCustomizationSelect(metalOption)
                                      }
                                      className={
                                        selectedSize === metalOption
                                          ? "selected"
                                          : ""
                                      }
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontWeight: "bold",
                                          color: "black",
                                        }}
                                      >
                                        {metalOption}
                                      </Typography>
                                      <Box
                                        style={{
                                          backgroundColor:
                                            selectedMetal === metalOption
                                              ? "#e0b872"
                                              : "transparent",

                                          border: "3px solid #a36e29",
                                          padding: "2px",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#a36e29" }}
                                        >
                                          Made on Order
                                        </Typography>
                                      </Box>
                                    </Button>
                                  </Grid>
                                )
                              )}
                            </Grid>

                            <Typography
                              variant="h6"
                              sx={{ marginTop: 2, fontWeight: "bold" }}
                            >
                              Diamond Type
                            </Typography>
                            {/* Add Buttons or another component to select metal choice */}
                            <Grid container>
                              {customizationOptions.diamondQuality.map(
                                (diamondOption, index) => (
                                  <Grid item xs={4} key={index}>
                                    <Button
                                      variant="outlined"
                                      sx={{
                                        margin: 1,
                                        padding: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        textAlign: "center",
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        "&.selected": {
                                          backgroundColor: "primary.main",
                                          color: "primary.contrastText",
                                          "&:hover": {
                                            backgroundColor: "primary.dark",
                                          },
                                        },
                                      }}
                                      onClick={() =>
                                        handleDiamondTypeSelect(diamondOption)
                                      }
                                      className={
                                        selectedSize === diamondOption
                                          ? "selected"
                                          : ""
                                      }
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontWeight: "bold",
                                          color: "black",
                                        }}
                                      >
                                        {diamondOption}
                                      </Typography>
                                      <Box
                                        style={{
                                          backgroundColor:
                                            selectedDiamondType ===
                                            diamondOption
                                              ? "#e0b872"
                                              : "transparent",
                                          border: "3px solid #a36e29",
                                          padding: "2px",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{ color: "#a36e29" }}
                                        >
                                          Made on Order
                                        </Typography>
                                      </Box>
                                    </Button>
                                  </Grid>
                                )
                              )}
                            </Grid>

                            <Typography
                              variant="h6"
                              sx={{ marginTop: 2, fontWeight: "bold" }}
                            >
                              Select Size
                            </Typography>
                            <Grid container>
                              {customizationOptions.size.map((size, index) => (
                                <Grid item xs={4} key={index}>
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      margin: 1,
                                      padding: 2,
                                      display: "flex",
                                      flexDirection: "column",
                                      textAlign: "center",
                                      border: 1,
                                      borderColor: "divider",
                                      borderRadius: 1,
                                      boxShadow: 1,
                                      // "&.selected": {
                                      //   backgroundColor: "primary.main",
                                      //   color: "primary.contrastText",
                                      //   "&:hover": {
                                      //     backgroundColor: "primary.dark",
                                      //   },
                                      // },
                                    }}
                                    onClick={() => handleSizeSelect(size)}
                                    className={
                                      selectedSize === size ? "selected" : ""
                                    }
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "black",
                                      }}
                                    >
                                      {size}
                                    </Typography>
                                    <Box
                                      style={{
                                        backgroundColor:
                                          selectedSize === size
                                            ? "#e0b872"
                                            : "transparent",
                                        border: "3px solid #a36e29",
                                        padding: "2px",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#a36e29" }}
                                      >
                                        Made On Order
                                      </Typography>
                                    </Box>
                                  </Button>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Drawer>
                        {/* Additional code for customization drawer will be similar to size drawer */}
                      </Box>
                    )}
                  <div className="price-section">
                    <Typography variant="h4" component="p" className="price">
                      ₹{selectedVariantPrice || productDetail.price}
                    </Typography>
                    <Typography variant="body1" className="original-price">
                      MRP ₹9,010
                    </Typography>
                  </div>
                  <Typography
                    variant="body1"
                    className="discount"
                    style={{ fontWeight: "bold" }}
                  >
                    Flat 50% off on Making Charges
                  </Typography>
                  <div className="actions">
                    <Button
                      variant="contained"
                      className="button"
                      style={{
                        width: "325px",
                        padding: "10px",
                        fontWeight: "bold",
                        background:
                          "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
                      }}
                      fullWidth
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                      <ShoppingCart className="button-icon" />
                    </Button>
                  </div>
                </Grid>

                <Grid item xs={6} className="location-grid">
                  <Typography style={{ color: "gray" }}>Pincode</Typography>
                  <Input
                    variant="solid"
                    className="pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                    }}
                    size="lg"
                    style={{
                      backgroundColor: "white",
                      height: "55px",
                      color: "black",
                    }}
                    endDecorator={
                      <LocationOnOutlined
                        onClick={() => setLocationModalOpen(true)}
                      />
                    }
                    fullWidth
                  />
                  <Typography variant="body" className="delivery-info">
                    <LocalShippingOutlined className="delivery-icon" /> Free
                    Delivery by 24th Feb
                  </Typography>
                  <Typography variant="subtitle" style={{ color: "gray" }}>
                    Order in 12hr : 20 mins
                  </Typography>
                </Grid>
                <Grid item xs={12} className="detail-grid">
                  <Card className="card" style={{ backgroundColor: "white" }}>
                    <Typography variant="subtitle2" className="sku">
                      {productDetail.hash}
                    </Typography>
                    <Typography variant="h5" className="title">
                      Product Details
                    </Typography>
                    <Typography variant="body1" className="desc">
                      {typeof productDetail.description !== "undefined"
                        ? parse(productDetail.description)
                        : ""}
                    </Typography>

                    <Grid container spacing={0} justifyContent="center">
                      <Grid item xs={4}>
                        <Box
                          style={{
                            width: "90%",
                            height: "15vh",
                            backgroundColor: "#E0B872",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                            color: "white",
                          }}
                        >
                          <Box
                            style={{
                              width: "100%",
                              height: "10%",
                              display: "flex",
                              justifyContent: "center",
                              color: "white",
                              alignItems: "center",
                            }}
                          >
                            <Typography>Weight </Typography>
                            <WeightIcon />
                          </Box>
                          <Box
                            style={{
                              width: "80%",
                              textAlign: "left",
                              height: "50%",
                              fontWeight: "bold",
                            }}
                          >
                            <Typography>
                              Gross:
                              {productDetail.weight} g
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          style={{
                            width: "90%",
                            height: "15vh",
                            backgroundColor: "#E0B872",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                            color: "white",
                          }}
                        >
                          <Box
                            style={{
                              width: "100%",
                              height: "10%",
                              display: "flex",
                              justifyContent: "center",
                              color: "white",
                              alignItems: "center",
                            }}
                          >
                            <Typography>Purity </Typography>
                            <PurityIcon />
                          </Box>
                          <Box
                            style={{
                              width: "80%",
                              textAlign: "left",
                              height: "50%",
                              fontWeight: "bold",
                            }}
                          >
                            <Typography>
                              Purity:
                              {productDetail.purity} KT
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          style={{
                            width: "90%",
                            height: "15vh",
                            backgroundColor: "#E0B872",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                            color: "white",
                          }}
                        >
                          <Box
                            style={{
                              width: "100%",
                              height: "10%",
                              display: "flex",
                              justifyContent: "center",
                              color: "white",
                              alignItems: "center",
                            }}
                          >
                            <Typography>Dimensions </Typography>
                            <DimensionsIcon />
                          </Box>
                          <Box
                            style={{
                              width: "80%",
                              textAlign: "left",
                              height: "50%",
                              fontWeight: "bold",
                            }}
                          >
                            <Typography>
                              Width : {productDetail.width} mm
                            </Typography>
                            <Typography>
                              Height : {productDetail.height} mm
                            </Typography>
                            <Typography>Size : 12 (51.8 mm)</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
        {productDetail.recommended && productDetail.recommended.length > 0 && (
          <div className="container-similar" style={{ marginTop: "10%" }}>
            <div className="similar-product-section">
              <Typography
                variant="h5"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: "2%",
                }}
              >
                You May Also{" "}
                <span style={{ color: "#A36E29" }}> {` Like `}</span> These
              </Typography>

              <div className="products-scroll-container">
                {productDetail.recommended.map((product) => (
                  <JwelleryCard
                    key={product.id}
                    image={product.images[0].file}
                    name={product.name}
                    hash={product.hash}
                    price={product.price}
                    clickHandler={handleCardClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div>
          <div style={{ width: "100%", height: "100vh" }}>
            <Reviews productDetails={productDetail} />
          </div>
        </div>
      </div>
      <div className="mobile">
        <div className="container">
          <div className="product-content">
            <Grid container spacing={0}>
              <Grid item xs={12} className="product-image-grid">
                <div className="product-image-section">
                  {/* Placeholder for product images */}
                  <ImageVideoCarousel images={images} video={video} />
                </div>
              </Grid>
              <Grid item xs={12} className="product-detail-grid">
                <div className="product-detail-section">
                  <div className="title">
                    <Typography variant="h5" component="h1">
                      {menuItemName}
                    </Typography>
                  </div>
                  <Box
                    style={{
                      backgroundColor: "white",

                      color: "black",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderRadius: "100px",
                      width: "20%",
                      paddingLeft: "2%",
                      paddingRight: "2%",
                    }}
                  >
                    <Typography>3.5</Typography>
                    <StarBorderRoundedIcon
                      style={{ fontSize: "1.5rem", color: "orange" }}
                    />
                    <Typography>(500 reviews)</Typography>
                  </Box>
                  <Box
                    style={{
                      width: "20%",
                      height: "20px",
                      paddingLeft: "2%",
                      paddingRight: "2%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <StarBorderRoundedIcon
                      style={{ fontSize: "1.5rem", color: "orange" }}
                    />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} className="product-detail-grid">
                <div className="price-section">
                  <Typography variant="h4" component="p" className="price">
                    ₹{productDetail.price}
                  </Typography>
                  <Typography variant="body1" className="original-price">
                    ₹9,010
                  </Typography>
                </div>
                <Typography variant="body1" className="discount">
                  Flat 50% off on Making Charges
                </Typography>
                <div className="actions">
                  <Button variant="contained" className="button" fullWidth>
                    Add to Cart
                    <ShoppingCart className="button-icon" />
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} className="product-customization-grid">
                <Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        marginTop: "20px",
                        display: "flex",
                        alignItems: "start",
                        color: "#666",
                      }}
                    >
                      Size
                    </Typography>
                    <Button
                      onClick={handleMobileDrawerOpen}
                      fullWidth
                      sx={{
                        textAlign: "left",
                        paddingTop: 2,
                        paddingBottom: 2,
                        color: "#a36e29",
                        paddingLeft: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        backgroundColor: "background.paper",
                        "::after": {
                          content: '"▼"',
                          float: "right",
                          paddingRight: 1,
                        },
                      }}
                    >
                      {selectedSize || "Select Size"}
                    </Button>
                  </Box>
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        color: "#666",
                      }}
                    >
                      Select Customization
                    </Typography>
                    <Button
                      onClick={handleMobileDrawerOpen}
                      fullWidth
                      sx={{
                        fontWeight: "bold",
                        textAlign: "left",
                        paddingTop: 2,
                        paddingBottom: 2,
                        paddingLeft: 1,
                        color: "#a36e29",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        backgroundColor: "background.paper",
                        "::after": {
                          content: '"▼"',
                          float: "right",
                          paddingRight: 1,
                        },
                      }}
                    >
                      {selectedMetal || "Choice of Metal"} -{" "}
                      {selectedDiamondType || "Diamond Type"}
                    </Button>
                  </Box>
                  <Drawer
                    anchor="right"
                    open={mobileDrawerOpen}
                    onClose={handleMobileDrawerClose}
                  >
                    <Box
                      sx={{
                        padding: 2,
                        width: 300,
                      }}
                    >
                      <Typography variant="h6">Choice of Metal</Typography>
                      {/* Add Buttons or another component to select metal choice */}
                      <Grid container>
                        {customizationOptions.metal.map(
                          (metalOption, index) => (
                            <Grid item xs={4} key={index}>
                              <Button
                                variant="outlined"
                                sx={{
                                  margin: 1,
                                  padding: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  textAlign: "center",
                                  border: 1,
                                  borderColor: "divider",
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  "&.selected": {
                                    backgroundColor: "primary.main",
                                    color: "primary.contrastText",
                                    "&:hover": {
                                      backgroundColor: "primary.dark",
                                    },
                                  },
                                }}
                                onClick={() =>
                                  handleCustomizationSelect(metalOption)
                                }
                                className={
                                  selectedSize === metalOption ? "selected" : ""
                                }
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "small", color: "#a36e29" }}
                                >
                                  {metalOption}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "small", color: "#a36e29" }}
                                >
                                  Made on Order
                                </Typography>
                              </Button>
                            </Grid>
                          )
                        )}
                      </Grid>

                      <Typography variant="h6">Diamond Type</Typography>
                      {/* Add Buttons or another component to select metal choice */}
                      <Grid container>
                        {customizationOptions.diamondQuality.map(
                          (diamondOption, index) => (
                            <Grid item xs={4} key={index}>
                              <Button
                                variant="outlined"
                                sx={{
                                  margin: 1,
                                  padding: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  textAlign: "center",
                                  border: 1,
                                  borderColor: "divider",
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  "&.selected": {
                                    backgroundColor: "primary.main",
                                    color: "primary.contrastText",
                                    "&:hover": {
                                      backgroundColor: "primary.dark",
                                    },
                                  },
                                }}
                                onClick={() =>
                                  handleDiamondTypeSelect(diamondOption)
                                }
                                className={
                                  selectedSize === diamondOption
                                    ? "selected"
                                    : ""
                                }
                              >
                                <Typography
                                  sx={{ fontSize: "small", color: "#a36e29" }}
                                  variant="body2"
                                >
                                  {diamondOption}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "small", color: "#a36e29" }}
                                  variant="body2"
                                >
                                  Made on Order
                                </Typography>
                              </Button>
                            </Grid>
                          )
                        )}
                      </Grid>

                      <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Select Size
                      </Typography>
                      <Grid container>
                        {customizationOptions.size.map((size, index) => (
                          <Grid item xs={4} key={index}>
                            <Button
                              variant="outlined"
                              sx={{
                                margin: 1,
                                padding: 2,
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                                boxShadow: 1,
                                "&.selected": {
                                  backgroundColor: "primary.main",
                                  color: "primary.contrastText",
                                  "&:hover": {
                                    backgroundColor: "primary.dark",
                                  },
                                },
                              }}
                              onClick={() => handleSizeSelect(size)}
                              className={
                                selectedSize === size ? "selected" : ""
                              }
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "#a36e29" }}
                              >
                                {size}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#a36e29" }}
                              >
                                Made on Order
                              </Typography>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>

                      <Button
                        sx={{
                          marginTop: 2,
                          height: "60px",
                          width: "100%",
                          backgroundColor: "#a36e29",
                          color: "primary.contrastText",
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                        onClick={handleMobileDrawerClose}
                      >
                        Confirm Customization
                      </Button>
                    </Box>
                  </Drawer>
                  {/* Additional code for customization drawer will be similar to size drawer */}
                </Box>
              </Grid>
              <Grid item xs={12} className="product-location-grid">
                <div className="label">Pincode</div>
                <ThemeProvider theme={theme}>
                  <OutlinedInput
                    className="pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                    }}
                    endAdornment={<LocationOnOutlined />}
                    fullWidth
                  />
                </ThemeProvider>
                <Typography variant="body2" className="delivery-info">
                  <LocalShippingOutlined className="delivery-icon" /> Free
                  Delivery by 24th Feb
                </Typography>
              </Grid>
              <Grid item xs={12} className="product-detail-grid">
                <Card className="card">
                  <Typography variant="subtitle2" className="sku">
                    {productDetail.hash}
                  </Typography>
                  <Typography variant="h6" className="title">
                    Product Details
                  </Typography>
                  <Typography variant="body1" className="desc">
                    {productDetail.description}
                  </Typography>

                  <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={6} className="detail">
                      <WeightIcon className="icon" />
                      <Typography className="text">
                        <strong>Weight</strong>
                        <br />
                        {productDetail.weight} g
                      </Typography>
                    </Grid>

                    <Grid item xs={5} className="detail">
                      <PurityIcon className="icon" />
                      <Typography className="text">
                        <strong>Purity</strong>
                        <br />
                        {productDetail.purity} KT
                      </Typography>
                    </Grid>
                    <Grid item xs={8} className="detail">
                      <DimensionsIcon className="icon" />
                      <Typography className="text">
                        <strong>Dimensions</strong>
                        <br />
                        Width - {productDetail.width} mm
                        <br />
                        Height - {productDetail.height} mm
                        <br />
                        Size - 12 (51.8 mm)
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="container-similar">
          <div className="similar-product-section">
            <Typography
              variant="h5"
              style={{
                textAlign: "left",
                fontWeight: "bold",
                marginTop: "2%",
              }}
            >
              You May Also <span style={{ color: "#A36E29" }}> {` Like `}</span>{" "}
              These
            </Typography>
            <div className="products-scroll-container">
              {productDetail.recommended?.map((product) => (
                <JwelleryCard
                  key={product.id}
                  image={product.images[0].file}
                  name={product.name}
                  hash={product.hash}
                  price={product.price}
                  clickHandler={handleCardClick}
                />
              )) || null}
            </div>
          </div>
        </div>
        <div>
          <div style={{ width: "100%", height: "100vh" }}>
            <Reviews productDetails={productDetail} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
