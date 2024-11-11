import {
  Close,
  CloseSharp,
  FavoriteBorderOutlined,
  LocalShippingOutlined,
  ShoppingBagOutlined,
  ShoppingCartOutlined,
  StarBorderRounded,
} from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import ShareIcon from "@mui/icons-material/Share";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogTitle,
  Drawer,
  Grid,
  Slide,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalToastStyle } from "../../utils/toast.styles";

import "./productdetail.styles.scss";

import { Input } from "@mui/joy";
import JwelleryCard from "../../components/card/jwellerycard.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import Reviews from "../../components/reviews/reviews.component";
import { useRefresh } from "../../RefreshContent";
import ImageVideoCarousel from "./carousal.component";

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

  const [productDetail, setProductDetail] = useState({});
  const [hasCustomization, setHasCustomization] = useState();
  const [customizationTypes, setCustomizationTypes] = useState([]);
  const [customizationOptions, setCustomizationOptions] = useState({});
  const [customizationVariants, setCustomizationVariants] = useState({});
  const [selctedVariantId, setSelectedVariantId] = useState();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

  const [pincode, setPincode] = useState("");
  const [locationModalOpen, setLocationModalOpen] = useState();
  const [mobileLocationModalOpen, setMobileLocationModalOpen] = useState();
  const [currentPosition, setCurrentPosition] = useState([]);
  const [currentPositionAddress, setCurrentPositionAddresss] = useState("");
  const [currentPositionPincode, setCurrentPositionPincode] = useState("");
  const [eta, setETA] = useState("");

  const addToCartHandler = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(
        `/signin?redirect_to=/item/${productDetail?.category}/${productDetail?.name}-${productDetail?.hash}`
      );
      return;
    }

    if (productDetail.exists_in_cart) {
      navigate("/cart");
      return;
    }

    axios
      .put(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
        {
          product: productDetail.id,
          customization:
            productDetail?.customizations?.variants?.options[0]?.id || -1,
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

  const addToCartHandlerForRecommendations = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(
        `/signin?redirect_to=/item/${productDetail?.category}/${productDetail?.name}-${productDetail?.hash}`
      );
      return;
    }

    axios
      .put(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
        {
          product: id,
          customization:
            productDetail.recommended.find((item) => item.id === id)
              ?.customizations?.variants?.options[0]?.id || -1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        console.log(`Product with ID ${id} sent to API`);
        navigate("/cart");
      })
      .catch((error) => {
        console.error(`Error sending product with ID ${id} to API`, error);
      });
  };

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

        setProductDetail((_) => detail);
        setHasCustomization(detail.hasOwnProperty("customizations"));
        if (detail.hasOwnProperty("customizations")) {
          setCustomizationTypes(detail["customizations"]["fields"]);
          setCustomizationOptions(
            detail["customizations"]["options_per_field"]
          );
          setCustomizationVariants(
            detail["customizations"]["variants"]["options"]
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCardClick = (productName, hash) => {
    navigate(`/item/${menuItemName}/${productName}-${hash}`);
    navigate(0);
  };

  const mediaQuery = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const query = searchParams.get("drawer");

    console.log(query, "query");
    if (query === "open") {
      mediaQuery ? setDrawerOpen(true) : setBottomDrawerOpen(true);
    }

    getJwelleryDetail();
  }, []);

  const [openShareDialog, setOpenShareDialog] = React.useState(false);
  const handleClickOpen = () => {
    setOpenShareDialog(true);
  };

  const handleClose = () => {
    setOpenShareDialog(false);
  };

  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [buyNowDrawer, setBuyNowDrawer] = useState(false);
  const [addresses, setAddresses] = useState();

  const getWishListItemsNonAuth = () => {
    const wishListExists = localStorage.getItem("wish_list");
    if (wishListExists && wishListExists.length > 0) {
      const wishListItems = wishListExists.split(",");
      setLocalWishlisted(wishListItems.includes(productDetail.id));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

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
        setTotalReviewsCount(
          response?.data?.response?.totalPages > 1
            ? Number(response?.data?.response?.totalPages) * 5
            : response?.data?.response?.reviews?.length
        );
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
    console.log(productDetail.exists_in_wishlist || localWishlisted);
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
      navigate(
        `/signin?redirect_to=/item/${productDetail?.category}/${productDetail?.name}-${productDetail?.hash}`
      );
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
          getETA(locationResponse.data.address.postcode, productDetail.id);
        });
      }
    }

    mediaQuery ? setLocationModalOpen(true) : setMobileLocationModalOpen(true);
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

    // Getting lat lng from Pincode using Google Geocoding API
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&components=country:IN|postal_code:${pincode}&key=AIzaSyDD2ek0oaYCGCsN7T5MvyV8z-GSXpsLgfg`
    );

    if (geocodeResponse.data.results.length > 0) {
      const location = geocodeResponse.data.results[0];
      const lat = location.geometry.location.lat;
      const lng = location.geometry.location.lng;

      // Getting address from lat lng using Google Reverse Geocoding
      const reverseGeocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDD2ek0oaYCGCsN7T5MvyV8z-GSXpsLgfg`
      );

      if (reverseGeocodeResponse.data.results.length > 0) {
        const address = reverseGeocodeResponse.data.results[0];

        // Find postcode from address components
        const postcodeComponent = address.address_components.find((component) =>
          component.types.includes("postal_code")
        );

        setCurrentPositionAddresss(address.formatted_address);
        setCurrentPositionPincode(postcodeComponent?.long_name || pincode);
        setETA(() =>
          formatDate(etaResponse.data.response.data.estimated_delivery)
        );
      }
    }
  };

  const buyNow = async () => {
    const userId = localStorage.getItem("user_id")
      ? localStorage.getItem("user_id")
      : -1;

    if (userId !== -1) {
      navigate(
        `/checkout?action=buy-now&prod=${productDetail?.name}&hash=${
          productDetail?.hash
        }&customization=${
          productDetail?.customizations?.variants?.options[0]?.id || -1
        }`
      );
    } else {
      navigate(
        `/signin?redirect_to=/item/${productDetail?.category}/${productDetail?.name}-${productDetail?.hash}`
      );
    }
  };

  return (
    <div className="product-detail">
      <Navbar />
      <ToastContainer />
      {/* Web */}
      <Modal
        open={locationModalOpen}
        onClose={() => {
          setLocationModalOpen(false);
        }}
      >
        <ModalOverflow>
          <ModalDialog
            style={{ width: "30vw", height: "25vw", padding: "30px" }}
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
                      getETAFromInput(event.target.value, productDetail.id);
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
                      getETAFromInput(event.target.value, productDetail.id);
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
      <Dialog
        open={openShareDialog}
        style={{
          borderRadius: "20px",
          margin: "auto",
          width: "100%",
        }}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Share Product
          </div>
          <CloseSharp
            style={{
              cursor: "pointer",
            }}
            onClick={handleClose}
          />
        </DialogTitle>
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
            <Typography
              style={{
                color: "#707070",
                fontFamily: '"Open Sans", sans-serif',
              }}
            >
              Via WhatsApp
            </Typography>
            <Button
              style={{
                width: "50px",
                height: "50px",
              }}
            >
              <WhatsappShareButton
                title={`${productDetail.name} from Sada Shri Jewel Kart`}
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
            <Typography
              style={{
                color: "#707070",
                fontFamily: '"Open Sans", sans-serif',
              }}
            >
              Copy URL
            </Typography>
            <Button
              style={{
                width: "50px",
                height: "50px",
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
      <Drawer
        open={buyNowDrawer}
        onClose={() => {
          setBuyNowDrawer(false);
        }}
        anchor="right"
      >
        <div
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.6rem",
            fontWeight: "600",
            backgroundColor: "#E0B872",
            color: "white",
            padding: "18px",
            paddingLeft: "25px",
          }}
        >
          Select Address
        </div>
      </Drawer>

      <div className="web">
        <div>
          <Grid container>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                {productDetail.images &&
                  productDetail.images.map((image, index) => (
                    <Grid item xs={6} key={image.id}>
                      <ReactImageMagnify
                        {...{
                          smallImage: {
                            alt: `Product ${index + 1}`,
                            isFluidWidth: true,
                            src: `https://api.sadashrijewelkart.com/assets/${image.file}`,
                          },
                          largeImage: {
                            src: `https://api.sadashrijewelkart.com/assets/${image.file}`,
                            width: 2400,
                            height: 2400,
                          },
                          enlargedImagePosition: "over",
                          isHintEnabled: false,
                          shouldHideHintAfterFirstActivation: false,
                          enlargedImageContainerDimensions: {
                            width: "200%",
                            height: "200%",
                          },
                          hoverDelayInMs: 100,
                          hoverOffDelayInMs: 150,
                        }}
                      />
                    </Grid>
                  ))}
                {productDetail.video &&
                  productDetail.video !==
                    "Product Infographics doesn't exist." && (
                    <Grid item xs={6}>
                      <video
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        autoPlay={true}
                      >
                        <source
                          src={`https://api.sadashrijewelkart.com/assets/${productDetail.video.file}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Grid>
                  )}
              </Grid>
            </Grid>
            <Grid item xs={4} style={{ paddingLeft: "6vh" }}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "60px",
                }}
              >
                <Box
                  style={{
                    height: "2rem",
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
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      marginRight: "5px",
                      color: "grey",
                    }}
                  >
                    {averageRating?.toFixed(2)}
                  </Typography>
                  <StarBorderRounded
                    style={{ fontSize: "1.5rem", color: "orange" }}
                  />
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      marginLeft: "5px",
                      color: "grey",
                    }}
                  >
                    ({totalReviewsCount} reviews)
                  </Typography>
                </Box>
                <Box
                  style={{
                    height: "2rem",
                    display: "flex",
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "10px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "15%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleWishList()}
                >
                  {productDetail.exists_in_wishlist || localWishlisted ? (
                    <FavoriteIcon
                      style={{ fontSize: "1.2rem", color: "#a36e29" }}
                    />
                  ) : (
                    <FavoriteBorderOutlined
                      style={{ fontSize: "1.2rem", color: "#a36e29" }}
                    />
                  )}
                </Box>
                <Box
                  style={{
                    height: "2rem",
                    display: "flex",
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "10px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "15%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickOpen()}
                >
                  <ShareIcon style={{ fontSize: "1.2rem", color: "#a36e29" }} />
                </Box>
              </Box>

              <Box
                style={{
                  widht: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "3%",
                }}
              >
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: "#a36e29",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1.2rem",
                  }}
                >
                  ₹{productDetail?.customizations?.variants?.options[0]?.price}
                </Typography>
                <Typography
                  style={{
                    marginRight: "auto",
                    marginLeft: "3%",
                    color: "gray",
                    textDecoration: "line-through",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1rem",
                  }}
                >
                  ₹
                  {(
                    productDetail?.customizations?.variants?.options[0]?.price *
                    1.2
                  ).toFixed(2)}
                </Typography>
              </Box>
              <div
                style={{
                  marginRight: "auto",
                  color: "gray",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                (MRP is inclusive of all taxes)
              </div>

              <div
                style={{
                  marginRight: "auto",
                  color: "#a36e29",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.4rem",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                {menuItemName}
              </div>

              <div
                style={{
                  marginTop: "30px",
                  height: "50px",
                  background: "white",
                  marginRight: "8vh",
                  border: "1px solid #a36e29",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  fontFamily: '"Open Sans", sans-serif',
                }}
              >
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "30px",
                  }}
                >
                  <div style={{ fontSize: "0.8rem" }}>Size</div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#a36e29",
                      fontWeight: "bold",
                    }}
                  >
                    {productDetail?.size}
                  </div>
                </div>
                <div
                  style={{
                    borderRight: "1px solid #a36e29",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "30px",
                  }}
                >
                  <div style={{ fontSize: "0.8rem" }}>Metal</div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#a36e29",
                      fontWeight: "bold",
                    }}
                  >
                    {
                      productDetail?.customizations?.variants?.options[0]
                        ?.metal_info?.display_name
                    }
                  </div>
                </div>
                <div
                  style={{
                    borderRight: "1px solid #a36e29",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "30px",
                  }}
                >
                  <div style={{ fontSize: "0.8rem" }}>Stone</div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#a36e29",
                      fontWeight: "bold",
                    }}
                  >
                    {
                      productDetail?.customizations?.variants?.options[0]
                        ?.stone_info?.display_stone_type
                    }
                  </div>
                </div>
              </div>
              {productDetail.admin_verified == 1 ? (
                <div
                  style={{
                    display: "flex",
                    marginRight: "8vh",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      fontWeight: "bold",
                      background: "#a36e29",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                    onClick={addToCartHandler}
                  >
                    {productDetail.exists_in_cart
                      ? "Go to Cart"
                      : "Add to Cart"}
                    <ShoppingCartOutlined
                      style={{
                        marginLeft: "10px",
                      }}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      fontWeight: "bold",
                      color: "#a36e29",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      marginLeft: "5px",
                      background: "transparent",
                      border: "2px solid #a36e29",
                      backgroundColor: "white",
                    }}
                    onClick={buyNow}
                  >
                    Buy Now
                    <ShoppingBagOutlined
                      style={{
                        marginLeft: "10px",
                        color: "#a36e29",
                      }}
                    />
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    marginRight: "8vh",
                    marginTop: "30px",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    disabled
                    style={{
                      fontWeight: "bold",
                      background: "#cccccc",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    Currently Unavailable
                  </Button>
                </div>
              )}

              <Typography
                sx={{
                  display: "flex",
                  alignItems: "start",
                  color: "#666",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  marginTop: "30px",
                }}
              >
                Enter your Pincode
              </Typography>
              <div
                style={{
                  height: "2.5rem",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  marginTop: "5px",
                  alignItems: "center",
                  border: "2px solid #e1e1e1",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: "#A36E29",
                  marginRight: "8vh",
                }}
                onClick={openLocationModal}
              >
                {pincode}
              </div>
              {currentPosition.length > 0 ? (
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocalShippingOutlined className="delivery-icon" />
                  <span
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      color: "grey",
                      marginLeft: "10px",
                    }}
                  >
                    {`Free delivery by ${eta}`}
                  </span>
                </Typography>
              ) : null}

              <div
                style={{
                  marginRight: "8vh",
                  backgroundColor: "white",
                  marginTop: "20px",
                  borderRadius: "10px",
                  padding: "10px 25px",
                  fontFamily: '"Open Sans", sans-serif',
                  paddingBottom: "20px",
                }}
              >
                <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Product Description
                </div>
                <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                  #{productDetail.hash?.toUpperCase()}
                </Typography>

                <div
                  dangerouslySetInnerHTML={{
                    __html: productDetail.description,
                  }}
                  style={{ fontSize: "0.9rem", marginTop: "12px" }}
                ></div>

                <div
                  style={{
                    marginTop: "20px",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontFamily: '"Open Sans", sans-serif',
                    border: "1px solid #e1e1e1",
                    boxShadow: "0px 0px 5px 0px #a36e29",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Metal Details
                  </div>
                  <Grid container spacing={2} style={{ marginTop: "8px" }}>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Gross Weight
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.gross_wt
                          }{" "}
                          g
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Net Weight
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.net_wt
                          }{" "}
                          g
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Stone Weight
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.stone_wt
                          }{" "}
                          g
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Metal
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.metal
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Quality
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.quality
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Wastage
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.wastage_prec
                          }
                          %
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Net Weight After Wastage
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.net_wt_after_wastage
                          }{" "}
                          g
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Making Charge
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          ₹
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.making_charge_amount
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Stone Amount
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          ₹
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.stone_amount
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Hallmark Charge
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          ₹
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.hallmark_charge
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Rodium Charge
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          ₹
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.rodium_charge
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        GST
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.gst_perc
                          }
                          %
                        </div>
                      </Typography>
                    </Grid>
                  </Grid>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontFamily: '"Open Sans", sans-serif',
                    border: "1px solid #e1e1e1",
                    boxShadow: "0px 0px 5px 0px #a36e29",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Stone Details
                  </div>
                  <Grid container spacing={2} style={{ marginTop: "8px" }}>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Stone Type
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.stone_type
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Class
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.class
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Clarity
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.clarity
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Cut
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.cut
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Pieces
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.pieces
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Carat
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.carat
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Stone Weight
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.stone_wt
                          }{" "}
                          g
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Stone Rate
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          ₹
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.stone_rate
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        GST
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.stone_info?.gst_perc
                          }
                          %
                        </div>
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>

        {productDetail.recommended && productDetail.recommended.length > 0 && (
          <div className="container-similar">
            <div className="similar-product-section">
              <Typography
                variant="h5"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: "5%",
                  marginBottom: "2%",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.2rem",
                }}
              >
                You may also{" "}
                <span style={{ color: "#A36E29" }}> {` like `}</span> these
              </Typography>

              <div className="products-scroll-container">
                {productDetail.recommended.map((product) => (
                  <JwelleryCard
                    id={product.id}
                    key={product.id}
                    image={product.images[0].file}
                    name={product.name}
                    hash={product.hash}
                    price={product.customizations?.variants?.options[0]?.price}
                    isWishlisted={product.exists_in_wishlist}
                    isInCart={product.exists_in_cart}
                    clickHandler={handleCardClick}
                    addToCartClick={addToCartHandlerForRecommendations}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container-similar">
          <Reviews
            productDetails={productDetail}
            rating={averageRating}
            reviewsCount={totalReviewsCount}
          />
        </div>
      </div>

      {/* Mobile UI */}
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
                {productDetail.exists_in_wishlist || localWishlisted ? (
                  <FavoriteIcon
                    style={{
                      fontSize: "2rem",
                      marginLeft: "auto",
                      marginRight: "8%",
                      marginTop: "8%",
                      color: "#a36e29",
                    }}
                    onClick={() => {
                      handleWishList();
                    }}
                  />
                ) : (
                  <FavoriteBorderOutlined
                    style={{
                      fontSize: "2rem",
                      marginLeft: "auto",
                      marginRight: "8%",
                      marginTop: "8%",
                      color: "grey",
                    }}
                    onClick={() => {
                      handleWishList();
                    }}
                  />
                )}
              </Box>
              <ImageVideoCarousel images={images} video={video} />
            </div>
            <div className="product-detail-section">
              <div className="title">
                <Typography
                  style={{
                    fontWeight: "bold",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "1.2rem",
                  }}
                >
                  {menuItemName}
                </Typography>
              </div>
              <Box
                style={{
                  height: "5%",
                  display: "flex",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "100px",
                    paddingLeft: "2%",
                    paddingRight: "2%",
                    paddingTop: "3%",
                    paddingBottom: "3%",
                    marginTop: "2%",
                    border: "1px solid grey",
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      color: "grey",
                      marginRight: "5px",
                    }}
                  >
                    {averageRating?.toFixed(2)}
                  </Typography>
                  <StarBorderRounded
                    style={{ fontSize: "1.5rem", color: "orange" }}
                  />
                  <Typography
                    style={{
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      color: "grey",
                      marginLeft: "5px",
                    }}
                  >
                    ({totalReviewsCount} reviews)
                  </Typography>
                </Box>
                <Box
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "2%",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      marginTop: "100%",
                      marginBottom: "50%",
                    }}
                    onClick={() => handleClickOpen()}
                  >
                    <ShareIcon
                      style={{ fontSize: "1.2rem", color: "#a36e29" }}
                    />
                  </Box>
                </Box>
              </Box>
              <div
                style={{
                  marginTop: "30px",
                  height: "50px",
                  background: "white",
                  border: "1px solid #a36e29",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  fontFamily: '"Open Sans", sans-serif',
                }}
              >
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "10px",
                  }}
                >
                  <div style={{ fontSize: "0.7rem" }}>Size</div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#a36e29",
                      fontWeight: "bold",
                    }}
                  >
                    {productDetail?.size}
                  </div>
                </div>
                <div
                  style={{
                    borderRight: "1px solid #a36e29",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "10px",
                  }}
                >
                  <div style={{ fontSize: "0.7rem" }}>Metal</div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#a36e29",
                      fontWeight: "bold",
                    }}
                  >
                    {
                      productDetail?.customizations?.variants?.options[0]
                        ?.metal_info?.display_name
                    }
                  </div>
                </div>
                <div
                  style={{
                    borderRight: "1px solid #a36e29",
                    height: "100%",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    paddingLeft: "10px",
                  }}
                >
                  <div style={{ fontSize: "0.7rem" }}>Stone</div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#a36e29",
                      fontWeight: "bold",
                    }}
                  >
                    {
                      productDetail?.customizations?.variants?.options[0]
                        ?.stone_info?.display_stone_type
                    }
                  </div>
                </div>
              </div>
              <div className="price-section">
                <Typography className="price">
                  ₹ {productDetail?.customizations?.variants?.options[0]?.price}
                </Typography>
                <Typography className="original-price">
                  ₹
                  {(
                    productDetail?.customizations?.variants?.options[0]?.price *
                    1.2
                  ).toFixed(2)}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    height: "40px",
                    padding: "10px",

                    fontWeight: "bold",
                    background: "#a36e29",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    marginRight: "5px",
                  }}
                  onClick={addToCartHandler}
                >
                  {productDetail.exists_in_cart ? "Go to Cart" : "Add to Cart"}
                  <ShoppingCartOutlined
                    style={{
                      marginLeft: "10px",
                    }}
                  />
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    height: "40px",
                    padding: "10px",
                    fontWeight: "bold",
                    color: "#a36e29",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    marginLeft: "5px",
                    background: "transparent",
                    border: "2px solid #a36e29",
                  }}
                  onClick={buyNow}
                >
                  Buy Now
                  <ShoppingBagOutlined
                    style={{
                      marginLeft: "10px",
                      color: "#a36e29",
                    }}
                  />
                </Button>
              </div>
              <Grid container spacing={3}>
                <Grid item xs={12} className="location-grid">
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      color: "#666",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      marginTop: "20px",
                    }}
                  >
                    Enter your Pincode
                  </Typography>
                  <div
                    style={{
                      width: "20rem",
                      height: "2.5rem",
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "flex-start",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      marginTop: "5px",
                      alignItems: "center",
                      border: "2px solid #e1e1e1",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#A36E29",
                    }}
                    onClick={openLocationModal}
                  >
                    {pincode}
                  </div>
                  {currentPosition.length > 0 ? (
                    <Typography className="delivery-info">
                      <LocalShippingOutlined className="delivery-icon" />
                      <span
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          color: "grey",
                        }}
                      >
                        {`Free delivery by ${eta}`}
                      </span>
                    </Typography>
                  ) : null}
                </Grid>

                <div
                  style={{
                    backgroundColor: "white",
                    marginTop: "20px",
                    borderRadius: "10px",
                    padding: "10px 25px",
                    fontFamily: '"Open Sans", sans-serif',
                    paddingBottom: "20px",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Product Description
                  </div>
                  <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                    #{productDetail.hash?.toUpperCase()}
                  </Typography>
                  <div style={{ fontSize: "0.9rem", marginTop: "12px" }}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontFamily: '"Open Sans", sans-serif',
                      border: "1px solid #e1e1e1",
                      boxShadow: "0px 0px 5px 0px #a36e29",
                    }}
                  >
                    <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Metal Details
                    </div>
                    <Grid container spacing={2} style={{ marginTop: "8px" }}>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Gross Weight
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.gross_wt
                            }{" "}
                            g
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Net Weight
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.net_wt
                            }{" "}
                            g
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Stone Weight
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.stone_wt
                            }{" "}
                            g
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Metal
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.metal
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Quality
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.quality
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Wastage
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.wastage_prec
                            }
                            %
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Net Weight After Wastage
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.net_wt_after_wastage
                            }{" "}
                            g
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Making Charge
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            ₹
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.making_charge_amount
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Stone Amount
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            ₹
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.stone_amount
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Hallmark Charge
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            ₹
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.hallmark_charge
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Rodium Charge
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            ₹
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.rodium_charge
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          GST
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.metal_info?.gst_perc
                            }
                            %
                          </div>
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontFamily: '"Open Sans", sans-serif',
                      border: "1px solid #e1e1e1",
                      boxShadow: "0px 0px 5px 0px #a36e29",
                    }}
                  >
                    <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      Stone Details
                    </div>
                    <Grid container spacing={2} style={{ marginTop: "8px" }}>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Stone Type
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.stone_type
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Class
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.class
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Clarity
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.clarity
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Cut
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.cut
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Pieces
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.pieces
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Carat
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.carat
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Stone Weight
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.stone_wt
                            }{" "}
                            g
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          Stone Rate
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            ₹
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.stone_rate
                            }
                          </div>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{ fontSize: "0.8rem", color: "grey" }}
                        >
                          GST
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            {
                              productDetail.customizations?.variants?.options[0]
                                ?.stone_info?.gst_perc
                            }
                            %
                          </div>
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </div>
          </div>
        </div>
        {productDetail.recommended && productDetail.recommended.length > 0 && (
          <div className="container-similar">
            <div className="similar-product-section">
              <Typography
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: "2%",
                  paddingTop: "3%",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                }}
              >
                You May Also{" "}
                <span style={{ color: "#A36E29" }}> {` Like `}</span> These
              </Typography>

              <div className="products-scroll-container">
                {productDetail.recommended.map((product) => (
                  <JwelleryCard
                    key={product.id}
                    id={product.id}
                    image={product.images[0].file}
                    name={product.name}
                    hash={product.hash}
                    price={product.customizations?.variants?.options[0]?.price}
                    isWishlisted={product.exists_in_wishlist}
                    isInCart={product.exists_in_cart}
                    clickHandler={handleCardClick}
                    addToCartClick={addToCartHandlerForRecommendations}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div>
          <div style={{ width: "100%", height: "100vh" }}>
            <Reviews
              productDetails={productDetail}
              rating={averageRating}
              reviewsCount={totalReviewsCount}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
