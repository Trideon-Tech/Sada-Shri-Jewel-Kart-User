import {
  FavoriteBorderOutlined,
  LocalShippingOutlined,
  LocationOnOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import DimensionsIcon from "@mui/icons-material/AspectRatio";
import PurityIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import WeightIcon from "@mui/icons-material/ScaleOutlined";
import ShareIcon from "@mui/icons-material/Share";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import {
  Box,
  Button,
  Card,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  Slide,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalToastStyle } from "../../utils/toast.styles";

import "./productdetail.styles.scss";

import { Input } from "@mui/joy";
import JwelleryCard from "../../components/card/jwellerycard.component";
import Navbar from "../../components/navbar/navbar.component";
import Reviews from "../../components/reviews/reviews.component";
import { useRefresh } from "../../RefreshContent";
import ImageVideoCarousel from "./carousal.component";
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
  const matches = useMediaQuery("(min-width:600px)");

  const { triggerRefresh } = useRefresh();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const { product } = useParams();
  const navigate = useNavigate();
  const [menuItemName, hashId] = product.split("-");

  const location = useLocation();

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
    if (productDetail.exists_in_cart) {
      navigate("/cart");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      let existingList = localStorage.getItem("cart_list") || "";
      existingList = existingList.split(",");
      existingList.push(productDetail.id);
      existingList = Array.from(new Set(existingList));
      localStorage.setItem("cart_list", existingList.join(","));
      toast.info("Product Added to Cart", generalToastStyle);
      navigate(0);
      return;
    }

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
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php?user_id=${localStorage.getItem(
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
  const [pincode, setPincode] = useState("");
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
    const pinCode = localStorage.getItem("default_pincode");
    setPincode(pinCode);
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
        const detail = response?.data?.response;

        const fetchedImages = detail.images
          .filter((item) => item.type === "img")
          .map(
            (item) => `https://api.sadashrijewelkart.com/assets/${item?.file}`
          );
        setImages(fetchedImages);

        if (detail.video !== "Product Infographics doesn't exist.") {
          const fetchedVideo = detail.video
            ? `https://api.sadashrijewelkart.com/assets/${detail?.video?.file}`
            : "";
          setVideo(fetchedVideo);
        }

        setProductDetail(detail);
        setCustomizationOptions({
          metal:
            detail?.customizations.options_per_field["Choice Of Metal"] || [],
          diamondQuality:
            detail?.customizations.options_per_field["Diamond Quality"] || [],
          size: detail?.customizations.options_per_field["Select Size"] || [],
        });

        setVariants(detail?.customizations.variants.options);
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
    const searchParams = new URLSearchParams(location.search);

    const query = searchParams.get("drawer");

    console.log(query, "query");
    if (query === "open") {
      setDrawerOpen(true);
    }

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

  const [totalPages, setTotalPages] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [localWishlisted, setLocalWishlisted] = useState(false);

  const getWishListItemsNonAuth = () => {
    const wishListExists = localStorage.getItem("wish_list");
    if (wishListExists && wishListExists.length > 0) {
      const wishListItems = wishListExists.split(",");
      setLocalWishlisted(wishListItems.includes(productDetail.id));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("productDetails", productDetail);
    console.log("productDetail id", productDetail.id);
    getWishListItemsNonAuth();
    if (!productDetail.id) return;
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/reviews.php?type=all&page=1&page_size=10&product_id=${productDetail.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("response", response?.data?.response?.totalPages);
        setTotalPages(Number(response?.data?.response?.totalPages));
        const sum = response?.data?.response?.reviews.map((item) =>
          Number(item.rating)
        );
        console.log(sum, " sum ");
        if (sum && sum?.length > 0)
          setAverageRating(sum?.reduce((a, b) => a + b) / sum.length);
      })
      .catch((error) => {});
  }, [productDetail]);

  const handleWishList = async () => {
    if (productDetail.exists_in_wishlist || localWishlisted) {
      const token = localStorage.getItem("token");
      if (!token) {
        removeFromLocalWishlist();
        return;
      }
      await axios.delete(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            type: "wishlist_item",
            wishlist_item_id: productDetail.id,
          },
        }
      );
      triggerRefresh();
    }
    await handleCreateWishList();
    navigate(0);
  };

  const handleCreateWishList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      let wishListItems = localStorage.getItem("wish_list");
      if (!wishListItems) {
        localStorage.setItem("wish_list", productDetail.id);
      } else {
        wishListItems = wishListItems.split(",");
        wishListItems.push(productDetail.id);
        wishListItems = Array.from(new Set(wishListItems));
        localStorage.setItem("wish_list", wishListItems.join(","));
      }
      // navigate(0);
      triggerRefresh();

      return;
    }
    try {
      const formData = new FormData();
      formData.append("type", "add_item");
      formData.append("wishlist_id", localStorage.getItem("default_wishlist"));
      formData.append("product_id", productDetail.id);
      await axios.post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // triggerRefresh();
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromLocalWishlist = () => {
    const localWishList = localStorage.getItem("wish_list");
    if (localWishList && localWishList?.length > 0) {
      const items = localWishList.split(",");
      const filteredItems = items?.filter((item) => !item === productDetail.id);
      localStorage.setItem(filteredItems.join(","));
    }
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
                  onChange={(event) => {
                    setPincode(event.target.value);
                    localStorage.setItem("default_pincode", event.target.value);
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
              <WhatsappShareButton
                title={`Sharing ${productDetail.name}`}
                round={true}
                url={window.location}
              >
                <WhatsappIcon round={true} size={32}></WhatsappIcon>
              </WhatsappShareButton>
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
                  cursor: "pointer",
                }}
              >
                {productDetail.exists_in_wishlist || localWishlisted ? (
                  <FavoriteIcon
                    style={{
                      fontSize: "2.5rem",
                      marginLeft: "auto",
                      marginRight: "5%",
                      marginTop: "5%",
                      color: "#a36e29",
                    }}
                    onClick={() => {
                      handleWishList();
                    }}
                  />
                ) : (
                  <FavoriteBorderOutlined
                    style={{
                      fontSize: "2.5rem",
                      marginLeft: "auto",
                      marginRight: "5%",
                      marginTop: "5%",
                      color: "#ffffff",
                    }}
                    onClick={() => {
                      handleWishList();
                    }}
                  />
                )}
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
                    width: "max-content",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                  }}
                >
                  <Typography>{averageRating?.toFixed(2)}</Typography>
                  <StarBorderRoundedIcon
                    style={{ fontSize: "1.5rem", color: "orange" }}
                  />
                  <Typography>({totalPages * 5} reviews)</Typography>
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
                  <div style={{ width: "max-content" }}>
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
                      {productDetail.exists_in_cart
                        ? "Go to Cart"
                        : "Add to Cart"}
                      <ShoppingCart className="button-icon" />
                    </Button>
                  </div>
                </Grid>

                <Grid item xs={6} className="location-grid">
                  <Typography style={{ color: "gray" }}>Pincodee</Typography>
                  <div
                    style={{
                      width: "100%",
                      height: "55px",
                      padding: 0,
                      top: 0,
                    }}
                    onClick={() => setLocationModalOpen(true)}
                  >
                    <Input
                      variant="solid"
                      className="pincode"
                      value={pincode}
                      size="lg"
                      style={{
                        backgroundColor: "white",
                        height: "55px",
                        color: "black",
                        border: "1ps solid #a36e29",
                      }}
                      disabled
                      endDecorator={
                        <LocationOnOutlined
                          onClick={() => setLocationModalOpen(true)}
                        />
                      }
                      fullWidth
                    />
                  </div>
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
                    width: "max-content",
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
                <Grid item xs={12} className="customization-grid">
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
                              width: "95%",
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
                              width: "95%",
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
                          open={drawerOpen && !matches}
                          onClose={handleDrawerClose}
                        >
                          <Box
                            sx={{
                              padding: 2,
                              width: 400,
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      className="button"
                      style={{
                        width: "90%",
                        padding: "10px",
                        fontWeight: "bold",
                        background:
                          "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
                      }}
                      fullWidth
                      onClick={addToCartHandler}
                    >
                      {productDetail.exists_in_cart
                        ? "Go to Cart"
                        : "Add to Cart"}
                      <ShoppingCart className="button-icon" />
                    </Button>
                  </div>
                </Grid>

                <Grid item xs={12} className="location-grid">
                  <Typography style={{ color: "gray" }}>Pincodee</Typography>
                  <div
                    style={{
                      width: "100%",
                      height: "55px",
                      padding: 0,
                      top: 0,
                    }}
                    onClick={() => setLocationModalOpen(true)}
                  >
                    <Input
                      variant="solid"
                      className="pincode"
                      value={pincode}
                      size="lg"
                      style={{
                        backgroundColor: "white",
                        height: "55px",
                        color: "black",
                        border: "1ps solid #a36e29",
                      }}
                      disabled
                      endDecorator={
                        <LocationOnOutlined
                          onClick={() => setLocationModalOpen(true)}
                        />
                      }
                      fullWidth
                    />
                  </div>
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
    </div>
  );
}

export default ProductDetail;
