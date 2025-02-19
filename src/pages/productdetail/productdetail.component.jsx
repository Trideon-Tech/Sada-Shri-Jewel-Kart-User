import {
  Close,
  CloseSharp,
  FavoriteBorderOutlined,
  LocalShippingOutlined,
  MonetizationOnRounded,
  NavigateBefore,
  NavigateNext,
  ShoppingBagOutlined,
  ShoppingCartOutlined,
  StarBorderRounded,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import ShareIcon from "@mui/icons-material/Share";
import ListItem from "@mui/joy/ListItem";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,

} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalToastStyle } from "../../utils/toast.styles";

import "./productdetail.styles.scss";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Input } from "@mui/joy";
import JwelleryCard from "../../components/card/jwellerycard.component";
import PriceBreakoutDrawer from "../../components/drawers/PriceBreakoutDrawer";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import Reviews from "../../components/reviews/reviews.component";
import { useRefresh } from "../../RefreshContent";
import ImageVideoCarousel from "./carousal.component";
import CarouselScheme from "./carousal.scheme";
import ModalAddCustomization from "./modal.addCustomization.component";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ProductDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  const [currentPositionCity, setCurrentPositionCity] = useState("");
  const [currentPositionState, setCurrentPositionState] = useState("");
  const [currentPositionCountry, setCurrentPositionCountry] = useState("");
  const [eta, setETA] = useState("");
  const mediaQuery = useMediaQuery("(min-width:600px)");
  const [openShareDialog, setOpenShareDialog] = React.useState(false);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [localWishlisted, setLocalWishlisted] = useState(false);
  const [buyNowDrawer, setBuyNowDrawer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [coinsRedeem, setCoinsRedeem] = useState(0);
  const [coinsIsRedeemed, setCoinsIsRedeemed] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState();
  const [selectedCouponCode, setSelectedCouponCode] = useState();
  const [discountAmount, setDiscountAmount] = useState();
  const [addCustomizationModalOpen, setAddCustomizationModalOpen] =
    useState(false);
  const [makingChargePercentage, setMakingChargePercentage] = useState(0);
  const [isPriceBreakoutOpen, setIsPriceBreakoutOpen] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [city, setCity] = useState(localStorage.getItem("default_city") || "");
  const [state, setState] = useState(
    localStorage.getItem("default_state") || ""
  );
  const [country, setCountry] = useState(
    localStorage.getItem("default_country") || ""
  );

  useEffect(() => {
    if (productDetail?.customizations?.variants?.options[0]) {
      setMakingChargePercentage(
        Math.ceil(
          productDetail.customizations.variants.options[0]?.metal_info
            ?.making_charge_value
        )
      );
      setDiscountPercentage(parseFloat(productDetail.discount_perc));
    }
  }, [productDetail]);

  // Add useEffect to reset drawer state when productDetail changes
  useEffect(() => {
    setIsPriceBreakoutOpen(false);
  }, [productDetail]);

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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/cart.php`,
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
        `${process.env.REACT_APP_API_URL
        }/v1.0.0/user/products/cart.php?user_id=${localStorage.getItem(
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

  const scrollRef = useRef(null);
  const scrollRef1 = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const container1 = scrollRef1.current;
    if (container) {
      const scrollAmount = direction === 1 ? container.scrollWidth / 3 : -container.scrollWidth / 3; // Adjust scroll amount as needed
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    if (container1) {
      const scrollAmount = direction === 1 ? container1.scrollWidth / 3 : -container1.scrollWidth / 3; // Adjust scroll amount as needed
      container1.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/cart.php`,
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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/details.php?name=${menuItemName}&hash=${hashId}&user_id=${userId}`
      )
      .then((response) => {
        const detail = response?.data?.response;

        if (detail?.images?.length > 0) {
          const fetchedImages = detail.images
            .filter((item) => item.type === "img")
            .sort((a, b) => a.file.localeCompare(b.file))
            .map(
              (item) => `${process.env.REACT_APP_API_URL}/assets/${item?.file}`
            );

          setImages(fetchedImages);
        }

        if (detail.video !== "Product Infographics doesn't exist.") {
          const fetchedVideo = detail.video
            ? `${process.env.REACT_APP_API_URL}/assets/${detail?.video?.file}`
            : "";
          setVideo(fetchedVideo);
        }

        setProductDetail((_) => detail);
        console.log("detail", detail);
        setDiscountPercentage(parseFloat(detail.discount_perc));
        setMakingChargePercentage(
          Math.ceil(
            detail.customizations?.variants?.options[0]?.metal_info
              ?.making_charge_value
          )
        );
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
        getETA(localStorage.getItem("default_pincode"), detail.id);
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

    if (query === "open") {
      mediaQuery ? setDrawerOpen(true) : setBottomDrawerOpen(true);
    }

    getJwelleryDetail();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(
        `${process.env.REACT_APP_API_URL
        }/v1.0.0/user/wallet.php?type=wallet&user_id=${localStorage.getItem(
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
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1.0.0/user/coupons/all.php?type=all_coupons`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (Array.isArray(data?.response)) setCouponList(data?.response);
      } catch (err) {
        console.log("fetching coupons failed ", err);
      }
    })();
  }, []);

  const handleClickOpen = () => {
    setOpenShareDialog(true);
  };

  const handleClose = () => {
    setOpenShareDialog(false);
  };

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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/reviews.php?type=all&page=1&page_size=10&product_id=${productDetail.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setTotalReviewsCount(
          response?.data?.response?.totalPages > 1
            ? Number(response?.data?.response?.totalPages) * 5
            : response?.data?.response?.reviews?.length
        );
        const sum = response?.data?.response?.reviews.map((item) =>
          Number(item.rating)
        );
        if (sum && sum?.length > 0)
          setAverageRating(sum?.reduce((a, b) => a + b) / sum.length);
      })
      .catch((error) => { });
  }, [productDetail]);

  const handleWishList = async () => {
    if (productDetail.exists_in_wishlist || localWishlisted) {
      const token = localStorage.getItem("token");
      if (!token) {
        removeFromLocalWishlist();
        return;
      }
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/wishlist.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            type: "wishlist_item",
            wishlist_item_id: productDetail.wishlist_item[0].id,
          },
        }
      );
      // triggerRefresh();
      window.location.reload();
    } else {
      await handleCreateWishList();
      navigate(0);
    }
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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/wishlist.php`,
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
          setCurrentPositionCity(locationResponse.data.address.city);
          setCurrentPositionState(locationResponse.data.address.state);
          setCurrentPositionCountry(locationResponse.data.address.country);
          setCity(locationResponse.data.address.city);

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

    return `${dayOfMonth}${daySuffix(dayOfMonth)} ${monthNames[date.getMonth()]
      }, ${date.getFullYear()}`;
  };

  const getETA = async (pincode, id) => {
    let etaResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1.0.0/user/sequel.php?type=estimated_date&pincode=${pincode}&product_id=${id}`
    );
    setCurrentPosition([1, 2]);
    setETA(() => formatDate(etaResponse.data.response.data.estimated_delivery));
  };

  const getETAFromInput = async (pincode, id) => {
    let etaResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1.0.0/user/sequel.php?type=estimated_date&pincode=${pincode}&product_id=${id}`
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
        setCurrentPositionCity(
          address.address_components.find((component) =>
            component.types.includes("locality")
          )?.long_name || ""
        );
        setCurrentPositionState(
          address.address_components.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || ""
        );
        setCurrentPositionCountry(
          address.address_components.find((component) =>
            component.types.includes("country")
          )?.long_name || ""
        );
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
        `/checkout?action=buy-now&prod=${productDetail?.name}&hash=${productDetail?.hash
        }&customization=${productDetail?.customizations?.variants?.options[0]?.id || -1
        }&discount=${selectedCouponId || 0}&coins=${coinsIsRedeemed ? coinsRedeem : 0
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
                    fontFamily: '"Roboto", sans-serif',
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
                    fontFamily: '"Roboto", sans-serif',
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
                  }}
                  placeholder="Locate Me"
                  inputProps={{ "aria-label": "Locate Me" }}
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
                        fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginBottom: "3px",
                    }}
                  >
                    City Located
                  </div>
                  <div
                    style={{
                      fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "#A36E29",
                      textAlign: "right ",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPincode(currentPositionPincode);
                      setCity(currentPositionCity);
                      setState(currentPositionState);
                      setCountry(currentPositionCountry);
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

      {addCustomizationModalOpen && (
        <ModalAddCustomization
          addCustomizationModalOpen={addCustomizationModalOpen}
          setAddCustomizationModalOpen={setAddCustomizationModalOpen}
        />
      )}
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
                    fontFamily: '"Roboto", sans-serif',
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
                    fontFamily: '"Roboto", sans-serif',
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
                  }}
                  placeholder="Locate Me"
                  inputProps={{ "aria-label": "Locate Me" }}
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
                        fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginBottom: "3px",
                    }}
                  >
                    City Located
                  </div>
                  <div
                    style={{
                      fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
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
              fontFamily: '"Roboto", sans-serif',
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
                fontFamily: '"Roboto", sans-serif',
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
                title={`${productDetail.name} from Sadāshrī Jewelkart`}
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
                fontFamily: '"Roboto", sans-serif',
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
            fontFamily: '"Roboto", sans-serif',
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

      {/* Buy Now Drawer */}
      <Drawer
        anchor={mediaQuery ? "right" : "bottom"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: mediaQuery ? 700 : "100%", p: mediaQuery ? 3 : 2 }}>
          {productDetail && Object.keys(productDetail).length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <Typography
                  style={{
                    textAlign: !mediaQuery ? "left" : "center",
                    fontWeight: "bold",
                    color: "black",
                    marginBottom: mediaQuery ? "3%" : "4%",
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: mediaQuery ? "1.5rem" : "1.2rem",
                  }}
                >
                  Order Summary
                </Typography>
                {!mediaQuery && (
                  <IconButton
                    onClick={() => setDrawerOpen(false)}
                    style={{
                      marginBottom: "4%",
                    }}
                  >
                    <Close />
                  </IconButton>
                )}
              </Box>

              <Card
                sx={{
                  borderRadius: "10px",
                  display: "flex",
                  padding: mediaQuery ? "3%" : "2%",
                  width: mediaQuery ? "90%" : "88%",
                  height: mediaQuery ? "max-content" : "140px",
                  aspectRatio: mediaQuery ? "4/1" : "3/1",
                  marginBottom: "3%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
                elevation={1}
              >
                <Box
                  style={{
                    border: "2px solid #e7e7e7",
                    borderRadius: "10px",
                    height: "100%",
                    aspectRatio: "1/1",
                    overflow: "hidden",
                  }}
                >
                  {productDetail?.images ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/assets/${productDetail?.images[0]?.file}`}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                      alt={productDetail?.name}
                    />
                  ) : null}
                </Box>
                <Box
                  style={{
                    height: "100%",
                    width: mediaQuery ? "70%" : "65%",
                    padding: mediaQuery ? "10px" : "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: mediaQuery ? "20px" : "12px",
                  }}
                >
                  <Typography
                    style={{
                      textAlign: "left",
                      fontWeight: "bold",
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: mediaQuery ? "1rem" : "0.8rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {productDetail?.name}
                  </Typography>
                  <Box
                    style={{
                      width: "100%",
                      marginTop: "2%",
                      height: "max-content",
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        marginRight: "auto",
                        width: "max-content",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{
                          color: "gray",
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                        }}
                      >
                        Quantity :
                      </Typography>
                      <Typography
                        style={{
                          color: "gray",
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                          marginLeft: "10px",
                        }}
                      >
                        1 Pcs.
                      </Typography>
                    </Box>
                  </Box>
                  {productDetail.customization === "-1" ? null : (
                    <Box
                      style={{
                        width: "100%",
                        marginTop: "2%",
                        height: "max-content",
                        display: "flex",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          marginRight: "auto",
                          width: "max-content",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            color: "gray",
                            fontFamily: '"Roboto", sans-serif',
                            fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                            marginRight: "10px",
                          }}
                        >
                          Size : {productDetail?.size}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <Box
                    style={{
                      width: "100%",
                      marginTop: "2%",
                      height: "max-content",
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        marginRight: "auto",
                        width: "max-content",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{
                          color: "gray",
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                        }}
                      >
                        HSN Code :
                      </Typography>
                      <Typography
                        style={{
                          color: "gray",
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                          marginLeft: "10px",
                        }}
                      >
                        {productDetail?.hsn}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    style={{
                      marginTop: "auto",
                      marginBottom: "10px",
                      fontSize: mediaQuery ? "1rem" : "0.8rem",
                      fontWeight: "bold",
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    <span style={{ fontWeight: "normal" }}>Price :</span> ₹
                    {productDetail.customizations.variants.options[0].price}
                  </Typography>
                </Box>
              </Card>

              <Card
                sx={{
                  p: mediaQuery ? 2 : 1.5,
                  mb: mediaQuery ? 3 : 1,
                  width: mediaQuery ? "90%" : "85%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <MonetizationOnRounded
                        sx={{
                          color: "#a36e29",
                          mr: 1,
                          fontSize: mediaQuery ? "24px" : "20px",
                        }}
                      />
                      <Typography
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: 600,
                          fontSize: mediaQuery ? "1rem" : "0.8rem",
                        }}
                      >
                        Available Coins: {coinsRedeem}
                      </Typography>
                    </Box>
                    <Typography
                      style={{
                        color: "gray",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                      }}
                    >
                      Use your coins to get instant discount on this purchase
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size={mediaQuery ? "small" : "small"}
                    onClick={() => {
                      setCoinsIsRedeemed(!coinsIsRedeemed);
                    }}
                    sx={{
                      color: "#a36e29",
                      borderColor: "#a36e29",
                      height: "fit-content",
                      fontSize: mediaQuery ? "0.875rem" : "0.8rem",
                      "&:hover": {
                        borderColor: "#a36e29",
                        backgroundColor: "rgba(163, 110, 41, 0.04)",
                      },
                    }}
                  >
                    {coinsIsRedeemed ? "Remove Coins" : "Apply Coins"}
                  </Button>
                </Box>
              </Card>

              <Card
                sx={{
                  p: mediaQuery ? 2 : 1.5,
                  mb: mediaQuery ? 3 : 1,
                  width: mediaQuery ? "90%" : "85%",
                  marginTop: mediaQuery ? "" : "18px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "max-content",
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: mediaQuery ? "1.2rem" : "1rem",
                        fontFamily: '"Roboto", sans-serif',
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      Available Coupons
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      overflowX: "scroll",
                      maxHeight: mediaQuery ? "none" : "200px",
                    }}
                  >
                    {couponList.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          p: mediaQuery ? 2 : 1.5,
                          mb: 2,
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "#a36e29",
                            backgroundColor: "rgba(163, 110, 41, 0.04)",
                          },
                        }}
                        onClick={() => {
                          if (selectedCouponId === item.id) {
                            setSelectedCouponId(null);
                            setSelectedCouponCode(null);
                            setDiscountAmount(0);
                          } else {
                            setSelectedCouponId(item.id);
                            setSelectedCouponCode(item.code);
                            const discount =
                              item.amount === "0"
                                ? (productDetail.customizations?.variants
                                  ?.options[0]?.price *
                                  item.percentage) /
                                100
                                : item.amount;
                            setDiscountAmount(discount);
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: '"Roboto", sans-serif',
                                fontWeight: "bold",
                                fontSize: mediaQuery ? "1rem" : "0.8rem",
                                color: "#a36e29",
                              }}
                            >
                              {item.code}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: mediaQuery ? "0.8rem" : "0.75rem",
                                color: "gray",
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size={mediaQuery ? "small" : "small"}
                            sx={{
                              color: "#a36e29",
                              borderColor: "#a36e29",
                              fontSize: mediaQuery ? "0.875rem" : "0.8rem",
                              "&:hover": {
                                borderColor: "#a36e29",
                                backgroundColor: "rgba(163, 110, 41, 0.04)",
                              },
                            }}
                          >
                            {selectedCouponId === item.id ? "Remove" : "Apply"}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Card>

              <Card
                sx={{
                  p: mediaQuery ? 2 : 1.5,
                  mb: mediaQuery ? 3 : 1,
                  width: mediaQuery ? "90%" : "85%",
                  marginTop: mediaQuery ? "" : "18px",
                }}
              >
                <Typography
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: "bold",
                    fontSize: mediaQuery ? "1rem" : "0.8rem",
                    marginBottom: "16px",
                  }}
                >
                  Price Details
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.85rem",
                        color: "gray",
                      }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.85rem",
                      }}
                    >
                      ₹
                      {(
                        productDetail.customizations?.variants?.options[0]
                          ?.price || 0
                      ).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.85rem",
                        color: "gray",
                      }}
                    >
                      Coins Redeemed
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.85rem",
                        color: "#d32f2f",
                      }}
                    >
                      - ₹{coinsIsRedeemed ? coinsRedeem : 0}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.85rem",
                        color: "gray",
                      }}
                    >
                      Discount
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: mediaQuery ? "0.8rem" : "0.85rem",
                        color: "#2e7d32",
                      }}
                    >
                      - ₹{parseInt(discountAmount || 0)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      Net Total
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      ₹
                      {(
                        (productDetail.customizations?.variants?.options[0]
                          ?.price || 0) -
                        (coinsIsRedeemed ? coinsRedeem : 0) -
                        (discountAmount || 0)
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#a36e29",
                  fontFamily: '"Roboto", sans-serif',
                  width: mediaQuery ? "95%" : "90%",
                  marginTop: mediaQuery ? "" : "18px",
                  "&:hover": {
                    bgcolor: "white",
                    color: "#a36e29",
                    border: "1px solid #a36e29",
                  },
                }}
                onClick={buyNow}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <div className="web">
        <Grid container>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              {productDetail.images &&
                productDetail.images
                  .sort((a, b) => a.file.localeCompare(b.file))
                  .map((image, index) => (
                    <Grid item xs={6} key={image.id}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/assets/${image.file}`}
                        alt={`Product ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setImageModalOpen(true);
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
                      loop={true}
                      muted={true}
                    >
                      <source
                        src={`${process.env.REACT_APP_API_URL}/assets/${productDetail.video.file}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </Grid>
                )}
            </Grid>
            {productDetail && Object.keys(productDetail).length > 0 && (
              <Dialog
                open={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                maxWidth="lg"
                fullWidth
              >
                <DialogContent style={{ display: "flex", gap: "20px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      overflowY: "auto",
                      p: 1,
                    }}
                  >
                    {productDetail.images?.map((image, index) => (
                      <Box
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        sx={{
                          border:
                            selectedImageIndex === index
                              ? "2px solid #E0B872"
                              : "2px solid transparent",
                          cursor: "pointer",
                          borderRadius: "10px",
                        }}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}/assets/${image.file}`}
                          alt={`Thumbnail ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>
                    ))}
                    {productDetail.video &&
                      productDetail.video !==
                      "Product Infographics doesn't exist." && (
                        <Box
                          onClick={() =>
                            setSelectedImageIndex(productDetail.images?.length)
                          }
                          sx={{
                            border:
                              selectedImageIndex ===
                                productDetail.images?.length
                                ? "2px solid #E0B872"
                                : "2px solid transparent",
                            cursor: "pointer",
                            borderRadius: "10px",
                          }}
                        >
                          <video
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          >
                            <source
                              src={`${process.env.REACT_APP_API_URL}/assets/${productDetail.video.file}`}
                              type="video/mp4"
                            />
                          </video>
                        </Box>
                      )}
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "85vh",
                      borderRadius: "10px",
                    }}
                  >
                    {selectedImageIndex < productDetail.images?.length ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/assets/${productDetail.images[selectedImageIndex]?.file}`}
                        alt={`Product ${selectedImageIndex + 1}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "cover",
                          height: "85vh",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      <video
                        controls
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          height: "85vh",
                          borderRadius: "10px",
                        }}
                        autoPlay={true}
                        loop={true}
                        muted={true}
                      >
                        <source
                          src={`${process.env.REACT_APP_API_URL}/assets/${productDetail.video?.file}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <IconButton
                    onClick={() => {
                      const totalItems = productDetail.video
                        ? productDetail.images.length + 1
                        : productDetail.images.length;
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? totalItems - 1 : prev - 1
                      );
                    }}
                  >
                    <NavigateBefore />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      const totalItems = productDetail.video
                        ? productDetail.images.length + 1
                        : productDetail.images.length;
                      setSelectedImageIndex((prev) =>
                        prev === totalItems - 1 ? 0 : prev + 1
                      );
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                </DialogActions>
              </Dialog>
            )}
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
                    fontFamily: '"Roboto", sans-serif',
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
                    fontFamily: '"Roboto", sans-serif',
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
              <ListItem>
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: "#a36e29",
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1.2rem",
                  }}
                >
                  ₹{productDetail?.customizations?.variants?.options[0]?.price}
                </Typography>
              </ListItem>
              <Typography
                style={{
                  marginRight: "10px",
                  marginLeft: "3%",
                  color: "gray",
                  textDecoration: "line-through",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1rem",
                }}
              >
                ₹
                {parseFloat(
                  productDetail?.customizations?.variants?.options[0]?.price *
                  ((discountPercentage + 100) / 100)
                ).toFixed(2)}
              </Typography>
              <Typography
                style={{
                  marginRight: "auto",
                  color: "green",
                  fontFamily: '"Roboto", sans-serif',
                }}
              >
                ({discountPercentage}% OFF)
              </Typography>
            </Box>
            <div
              style={{
                marginRight: "auto",
                color: "gray",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              (MRP is inclusive of all taxes)
            </div>

            <Typography
              style={{
                marginRight: "8vh",
                marginTop: "10px",
                fontFamily: '"Roboto", sans-serif',
                color: productDetail.quantity > 0 ? "#4CAF50" : "#f44336",
                fontSize: "0.8rem",
                fontWeight: "600",
              }}
            >
              {productDetail.quantity > 0
                ? `Only ${productDetail.quantity} pieces left`
                : "Out of Stock"}
            </Typography>

            <div
              style={{
                marginRight: "auto",
                color: "#a36e29",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1.2rem",
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
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              <div
                style={{
                  width: "100%",
                  paddingLeft: "15px",
                }}
              >
                <div style={{ fontSize: "0.7rem" }}>Size</div>
                <div
                  style={{
                    fontSize: "0.8rem",
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
                  paddingLeft: "15px",
                }}
              >
                <div style={{ fontSize: "0.7rem" }}>Metal</div>
                <div
                  style={{
                    fontSize: "0.8rem",
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
                  paddingLeft: "15px",
                }}
              >
                <div style={{ fontSize: "0.7rem" }}>Stone</div>
                <div
                  style={{
                    fontSize: "0.8rem",
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
            {productDetail.customizations?.variants?.options[0]?.metal_info?.metal_type?.toLowerCase() !==
              "silver" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "10px",
                      marginBottom: "12px",
                      fontFamily: '"Roboto", sans-serif',
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      background: "linear-gradient(to right, #d4a76a, #a36e29)",
                      borderRadius: "10px",
                      textAlign: "center",
                      width: "100%",
                      marginRight: "8vh",
                      textTransform: "uppercase",
                      height: "100%",
                      padding: "0.6rem",
                    }}
                    onClick={() => setAddCustomizationModalOpen(true)}
                  >
                    Add Customization
                  </Button>
                </div>
              )}
            {productDetail.admin_verified == 1 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    marginRight: "8vh",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      fontWeight: "bold",
                      color: "#a36e29",
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      marginRight: "5px",
                      background: "transparent",
                      border: "2px solid #a36e29",
                      backgroundColor: "white",
                    }}
                    onClick={
                      productDetail.quantity > 0
                        ? addToCartHandler
                        : handleCreateWishList
                    }
                  >
                    {productDetail.quantity > 0
                      ? productDetail.exists_in_cart
                        ? "Go to Cart"
                        : "Add to Cart"
                      : "Add to Wishlist"}
                    {productDetail.quantity > 0 && (
                      <ShoppingCartOutlined
                        style={{
                          marginLeft: "10px",
                        }}
                      />
                    )}
                  </Button>
                  {productDetail.quantity > 0 && (
                    <Button
                      variant="contained"
                      fullWidth
                      style={{
                        fontWeight: "bold",
                        background:
                          "linear-gradient(to right, #d4a76a, #a36e29)",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "0.8rem",
                        marginLeft: "5px",
                      }}
                      onClick={() => setDrawerOpen(true)}
                    >
                      Buy Now
                      <ShoppingBagOutlined
                        style={{
                          marginLeft: "10px",
                          color: "white",
                        }}
                      />
                    </Button>
                  )}
                </div>
              </>
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
                  }}
                >
                  Currently Unavailable
                </Button>
              </div>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginRight: "6vh",
                marginTop: "20px",
              }}
            >
              <Typography
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "-8px",
                }}
              >
                Saving Schemes
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Create image carousel for the schemes */}
                <CarouselScheme />
              </Box>
            </Box>

            <div
              style={{
                width: "25.3rem",
                marginTop: "20px",
                paddingRight: "1rem",
                borderRadius: "10px",
                fontFamily: '"Roboto", sans-serif',
                border: "1px solid #e1e1e1",
                boxShadow: "0px 0px 5px 0px #a36e29",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "24.3rem",
                  marginTop: "0.5rem",
                  borderRadius: "10px",
                  padding: "10px 10px",
                  fontFamily: '"Roboto", sans-serif',
                  marginBottom: "1rem",
                }}
              >
                <Typography
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  SadāShrī Jewelkart Promise:
                </Typography>

                <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                  At SadāShrī Jewelkart, we are committed to delivering timeless
                  elegance and unmatched quality. Our promise is to offer
                  authentic, certified jewelry and exceptional customer service,
                  ensuring every purchase brings joy and trust. From carefully
                  sourced gemstones to exquisite craftsmanship, we strive to
                  make every moment precious for you.
                </Typography>
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  borderRadius: "10px",
                  padding: "10px 10px",
                  fontFamily: '"Roboto", sans-serif',
                  width: "26.3rem",
                }}
              >
                <Grid
                  container
                  xs={11.3}
                  spacing={0}
                  sx={{
                    marginTop: "0.5rem",
                    marginBottom: "10px",
                    justifyContent: "flex-start",
                  }}
                >
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        "https://blogs.sadashrijewelkart.com/sadashri-jewelkart-jewelry-certification-and-quality-policy/",
                        "_blank"
                      )
                    }
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/17.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        "https://blogs.sadashrijewelkart.com/lifetime-buy-back-exchange-and-15-day-return-policy/",
                        "_blank"
                      )
                    }
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/3.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        "https://blogs.sadashrijewelkart.com/lifetime-buy-back-and-exchange-policy/",
                        "_blank"
                      )
                    }
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/2.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        "https://blogs.sadashrijewelkart.com/sadashri-jewelkart-diamond-and-gemstone-certification-policy/",
                        "_blank"
                      )
                    }
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/1.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>

            <div
              style={{
                width: "25.3rem",
                marginTop: "1rem",
                paddingRight: "1rem",
                borderRadius: "10px",
                fontFamily: '"Roboto", sans-serif',
                border: "1px solid #e1e1e1",
                boxShadow: "0px 0px 5px 0px #a36e29",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  marginTop: "0.5rem",
                  borderRadius: "10px",
                  padding: "10px 10px",
                  fontFamily: '"Roboto", sans-serif',
                  width: "26.3rem",
                }}
              >
                {/* Verify Product Credentials */}

                <Typography
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1rem",
                    fontWeight: "bold",
                    marginBottom: "2rem",
                    marginTop: "0.5rem",
                    paddingLeft: "1rem",
                  }}
                >
                  Verify Product Credentials
                </Typography>
                <Grid
                  container
                  spacing={0.5}
                  xs={11.3}
                  sx={{
                    display: "flex",
                    marginTop: "10px",
                    marginBottom: "20px",
                    width: "100%",
                  }}
                >
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/14.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/15.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/4.svg"}
                      alt="Delivery Icon"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </div>

            <Typography
              sx={{
                display: "flex",
                alignItems: "start",
                color: "#666",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "500",
                marginTop: "30px",
              }}
            >
              Locate Me
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
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                fontWeight: "bold",
                color: "#A36E29",
                marginRight: "8vh",
              }}
              onClick={openLocationModal}
            >
              {`${city}, ${state}, ${country}`}
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
                    fontFamily: '"Roboto", sans-serif',
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
                fontFamily: '"Roboto", sans-serif',
                paddingBottom: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Product Description
                </div>
                <Typography
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#a36e29",
                    cursor: "pointer",
                    marginTop: "0.5rem",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setIsPriceBreakoutOpen(true)}
                >
                  <AddIcon /> Price Breakup
                </Typography>
              </div>

              <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                #{productDetail.hash?.toUpperCase()}
              </Typography>

              <div
                dangerouslySetInnerHTML={{
                  __html: productDetail.description,
                }}
                style={{ fontSize: "0.8rem", marginTop: "12px" }}
              ></div>

              <Accordion
                sx={{
                  marginTop: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 5px 0px #a36e29",
                  border: "1px solid #e1e1e1",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Metal Details
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2} style={{ marginTop: "8px" }}>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Gross Weight
                        <div
                          style={{
                            fontSize: "1rem",
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
                            fontSize: "1rem",
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
                            fontSize: "1rem",
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
                            fontSize: "1rem",
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
                        Purity
                        <div
                          style={{
                            fontSize: "1rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.display_name
                          }
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Wastage
                        <div
                          style={{
                            fontSize: "1rem",
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
                            fontSize: "1rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {parseFloat(
                            productDetail.customizations?.variants?.options[0]
                              ?.metal_info?.net_wt_after_wastage
                          ).toFixed(2)}{" "}
                          g
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Making Charge
                        <div
                          style={{
                            fontSize: "1rem",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {makingChargePercentage}%
                        </div>
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                        Stone Amount
                        <div
                          style={{
                            fontSize: "1rem",
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
                            fontSize: "1rem",
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
                            fontSize: "1rem",
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
                            fontSize: "1rem",
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
                </AccordionDetails>
              </Accordion>

              {productDetail.customizations?.variants?.options[0]?.stone_info
                ?.stone_type && (
                  <Accordion
                    sx={{
                      marginTop: "20px",
                      borderRadius: "10px",
                      boxShadow: "0px 0px 5px 0px #a36e29",
                      border: "1px solid #e1e1e1",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography
                        style={{ fontSize: "1rem", fontWeight: "bold" }}
                      >
                        Stone Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} style={{ marginTop: "8px" }}>
                        <Grid item xs={4}>
                          <Typography
                            style={{ fontSize: "0.8rem", color: "grey" }}
                          >
                            Stone Type
                            <div
                              style={{
                                fontSize: "0.8rem",
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
                            Clarity
                            <div
                              style={{
                                fontSize: "1rem",
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
                            Color
                            <div
                              style={{
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants?.options[0]
                                  ?.stone_info?.color
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
                                fontSize: "0.8rem",
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
                            Cut
                            <div
                              style={{
                                fontSize: "0.8rem",
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
                            Carat
                            <div
                              style={{
                                fontSize: "1rem",
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
                                fontSize: "1rem",
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
                                fontSize: "1rem",
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
                                fontSize: "1rem",
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
                    </AccordionDetails>
                  </Accordion>
                )}
            </div>
          </Grid>
        </Grid>

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
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1.2rem",
                  marginLeft: "2rem"
                }}
              >
                You may also{" "}
                <span style={{ color: "#A36E29" }}> {` like `}</span> these
              </Typography>

              <div className="scroll-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                <IconButton className="scroll-btn left" style={{ height: "max-content"}} onClick={() => scroll(-1)}>
                  <ArrowBackIcon />
                </IconButton>

                <div className="products-scroll-container" ref={scrollRef1}>
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
                      quantity={product.quantity}
                      wishlistItem={product.wishlist_item_id}
                    />
                  ))}
                </div>

                <IconButton className="scroll-btn right" style={{ height: "max-content" }} onClick={() => scroll(1)}>
                  <ArrowForwardIcon />
                </IconButton>
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1.2rem",
                  }}
                >
                  {menuItemName}
                </Typography>
              </div>
              <Box
                style={{
                  height: "30px",
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
                      fontFamily: '"Roboto", sans-serif',
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
                      fontFamily: '"Roboto", sans-serif',
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
              <div className="price-section">
                <Typography className="price">
                  ₹ {productDetail?.customizations?.variants?.options[0]?.price}
                </Typography>
                <Typography className="original-price">
                  ₹
                  {parseFloat(
                    (productDetail?.customizations?.variants?.options[0]
                      ?.price *
                      (discountPercentage + 100)) /
                    100
                  ).toFixed(2)}
                </Typography>
                <Typography className="discount">
                  ({discountPercentage}% OFF)
                </Typography>
              </div>
              <Typography
                style={{
                  fontSize: "0.7rem",
                  color: "#666",
                  marginTop: "4px",
                  fontFamily: '"Roboto", sans-serif',
                }}
              >
                (MRP inclusive of all taxes)
              </Typography>
              <div
                style={{
                  marginTop: "20px",
                  height: "50px",
                  background: "white",
                  border: "1px solid #a36e29",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  fontFamily: '"Roboto", sans-serif',
                  paddingRight: "10px",
                  width: "85vw",
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
                      fontSize: "0.8rem",
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
                      fontSize: "0.8rem",
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
                      fontSize: "0.8rem",
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
              {productDetail.customizations?.variants?.options[0]?.metal_info?.metal_type?.toLowerCase() !==
                "silver" && (
                  <div
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      style={{
                        fontSize: "0.8rem",
                        fontFamily: '"Roboto", sans-serif',
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        background: "linear-gradient(to right, #d4a76a, #a36e29)",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        borderRadius: "10px",
                        textAlign: "center",
                        width: "88vw",
                        textTransform: "uppercase",
                      }}
                      onClick={() => setAddCustomizationModalOpen(true)}
                    >
                      Add Customization
                    </Button>
                  </div>
                )}
              {productDetail.admin_verified == 1 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      style={{
                        fontWeight: "bold",
                        color: "#a36e29",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "0.8rem",
                        marginRight: "5px",
                        background: "transparent",
                        border: "2px solid #a36e29",
                        backgroundColor: "white",
                      }}
                      onClick={
                        productDetail.quantity > 0
                          ? addToCartHandler
                          : handleCreateWishList
                      }
                    >
                      {productDetail.quantity > 0
                        ? productDetail.exists_in_cart
                          ? "Go to Cart"
                          : "Add to Cart"
                        : "Add to Wishlist"}
                      {productDetail.quantity > 0 && (
                        <ShoppingCartOutlined
                          style={{
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </Button>
                    {productDetail.quantity > 0 && (
                      <Button
                        variant="contained"
                        fullWidth
                        style={{
                          fontWeight: "bold",
                          fontFamily: '"Roboto", sans-serif',
                          background:
                            "linear-gradient(to right, #d4a76a, #a36e29)",
                          fontSize: "0.8rem",
                          marginLeft: "5px",
                        }}
                        onClick={() => setDrawerOpen(true)}
                      >
                        Buy Now
                        <ShoppingBagOutlined
                          style={{
                            marginLeft: "5px",
                            color: "white",
                          }}
                        />
                      </Button>
                    )}
                  </div>
                </>
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
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    Currently Unavailable
                  </Button>
                </div>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginTop: "0.5rem",
                }}
              >
                <Typography
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "-8px",
                  }}
                >
                  Saving Schemes
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <CarouselScheme />
                </Box>
              </Box>

              <div
                style={{
                  marginTop: "0.5rem",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontFamily: '"Roboto", sans-serif',
                  border: "1px solid #e1e1e1",
                  boxShadow: "0px 0px 5px 0px #a36e29",
                }}
              >
                <div
                  style={{
                    marginTop: "0.5rem",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    SadāShrī Jewelkart Promise:
                  </Typography>

                  <Typography
                    style={{
                      fontSize: "0.8rem",
                      color: "grey",
                      lineHeight: "1.5",
                    }}
                  >
                    At SadāShrī Jewelkart, we are committed to delivering
                    timeless elegance and unmatched quality. Our promise is to
                    offer authentic, certified jewelry and exceptional customer
                    service, ensuring every purchase brings joy and trust. From
                    carefully sourced gemstones to exquisite craftsmanship, we
                    strive to make every moment precious for you.
                  </Typography>
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    borderRadius: "10px",
                    padding: "10px 10px",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    xs={12}
                    sx={{
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "https://blogs.sadashrijewelkart.com/sadashri-jewelkart-jewelry-certification-and-quality-policy/",
                          "_blank"
                        )
                      }
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/17.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "https://blogs.sadashrijewelkart.com/lifetime-buy-back-exchange-and-15-day-return-policy/",
                          "_blank"
                        )
                      }
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/3.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "https://blogs.sadashrijewelkart.com/lifetime-buy-back-and-exchange-policy/",
                          "_blank"
                        )
                      }
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/2.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          "https://blogs.sadashrijewelkart.com/sadashri-jewelkart-diamond-and-gemstone-certification-policy/",
                          "_blank"
                        )
                      }
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/1.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontFamily: '"Roboto", sans-serif',
                  border: "1px solid #e1e1e1",
                  boxShadow: "0px 0px 5px 0px #a36e29",
                }}
              >
                <div
                  style={{
                    marginTop: "0.5rem",
                    borderRadius: "10px",
                    padding: "10px 10px",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Verify Product Credentials
                  </Typography>
                  <Grid
                    container
                    spacing={1}
                    xs={12}
                    sx={{
                      display: "flex",
                      marginRight: "10vh",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/14.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/15.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                        padding: "10px",
                      }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/assets/4.svg"}
                        alt="Delivery Icon"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>

              <Grid container spacing={3}>
                <Grid item xs={11} className="location-grid">
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      color: "#666",
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      marginTop: "20px",
                    }}
                  >
                    Locate Me
                  </Typography>
                  <div
                    style={{
                      width: "85vw",
                      height: "2.5rem",
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "flex-start",
                      paddingLeft: "10px",
                      marginTop: "5px",
                      alignItems: "center",
                      border: "2px solid #e1e1e1",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#A36E29",
                    }}
                    onClick={openLocationModal}
                  >
                    {`${city}, ${state}, ${country}`}
                  </div>
                  {currentPosition.length > 0 ? (
                    <Typography className="delivery-info">
                      <LocalShippingOutlined className="delivery-icon" />
                      <span
                        style={{
                          fontFamily: '"Roboto", sans-serif',
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
                    fontFamily: '"Roboto", sans-serif',
                    paddingBottom: "20px",
                    width: "85vw",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginTop: "0.5rem",
                      }}
                    >
                      Product Description
                    </div>
                    <Typography
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#a36e29",
                        cursor: "pointer",
                        display: "flex",
                      }}
                      onClick={() => setIsPriceBreakoutOpen(true)}
                    >
                      <AddIcon
                        style={{ fontSize: "1rem", marginTop: "0.2rem" }}
                      />{" "}
                      Price Breakup
                    </Typography>
                  </div>

                  <Typography style={{ fontSize: "0.8rem", color: "grey" }}>
                    #{productDetail.hash?.toUpperCase()}
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: productDetail.description,
                    }}
                    style={{ fontSize: "0.8rem", marginTop: "12px" }}
                  ></div>

                  <Accordion
                    sx={{
                      marginTop: "20px",
                      borderRadius: "10px",
                      boxShadow: "0px 0px 5px 0px #a36e29",
                      border: "1px solid #e1e1e1",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography
                        style={{ fontSize: "1rem", fontWeight: "bold" }}
                      >
                        Metal Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} style={{ marginTop: "8px" }}>
                        <Grid item xs={4}>
                          <Typography
                            style={{ fontSize: "0.8rem", color: "grey" }}
                          >
                            Gross Weight
                            <div
                              style={{
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.gross_wt
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.net_wt
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.stone_wt
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                                textTransform: "capitalize",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.metal
                              }
                            </div>
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            style={{ fontSize: "0.8rem", color: "grey" }}
                          >
                            Purity
                            <div
                              style={{
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.display_name
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.wastage_prec
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {parseFloat(
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.net_wt_after_wastage
                              ).toFixed(2)}{" "}
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {makingChargePercentage}%
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              ₹
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.stone_amount
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              ₹
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.hallmark_charge
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              ₹
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.rodium_charge
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
                                fontSize: "1rem",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                productDetail.customizations?.variants
                                  ?.options[0]?.metal_info?.gst_perc
                              }
                              %
                            </div>
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {productDetail.customizations?.variants?.options[0]
                    ?.stone_info?.stone_type && (
                      <Accordion
                        sx={{
                          marginTop: "20px",
                          borderRadius: "10px",
                          boxShadow: "0px 0px 5px 0px #a36e29",
                          border: "1px solid #e1e1e1",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2a-content"
                          id="panel2a-header"
                        >
                          <Typography
                            style={{ fontSize: "1rem", fontWeight: "bold" }}
                          >
                            Stone Details
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid
                            container
                            spacing={2}
                            style={{ marginTop: "8px" }}
                          >
                            <Grid item xs={4}>
                              <Typography
                                style={{ fontSize: "0.8rem", color: "grey" }}
                              >
                                Stone Type
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.stone_type
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
                                    fontSize: "1rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.clarity
                                  }
                                </div>
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography
                                style={{ fontSize: "0.8rem", color: "grey" }}
                              >
                                Color
                                <div
                                  style={{
                                    fontSize: "1rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.color
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
                                    fontSize: "0.8rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.pieces
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
                                    fontSize: "0.8rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.cut
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
                                    fontSize: "1rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.carat
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
                                    fontSize: "1rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.stone_wt
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
                                    fontSize: "1rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ₹
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.stone_rate
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
                                    fontSize: "1rem",
                                    color: "black",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {
                                    productDetail.customizations?.variants
                                      ?.options[0]?.stone_info?.gst_perc
                                  }
                                  %
                                </div>
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    )}
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
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1rem",
                }}
              >
                You May Also{" "}
                <span style={{ color: "#A36E29" }}> {` Like `}</span> These
              </Typography>
                <div className="products-scroll-container" ref={scrollRef}>
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
                      quantity={product.quantity}
                    />
                  ))}
              </div>
              <IconButton
                  className="scroll-btn left"
                  style={{
                    // position: "absolute",
                    left: "5px", // Adjust this value to control overlap
                    height: "max-content",
                    zIndex: 1,
                    background: "linear-gradient(to right, #d4a76a, #a36e29)",
                    color: "white",
                    margin: "1rem"
                  }}
                  onClick={() => scroll(-1)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  className="scroll-btn right"
                  style={{
                    // position: "absolute",
                    right: "5px", // Adjust this value to control overlap
                    height: "max-content",
                    zIndex: 1,
                    background: "linear-gradient(to right, #d4a76a, #a36e29)",
                    color: "white"
                  }}
                  onClick={() => scroll(1)}
                >
                  <ArrowForwardIcon />
                </IconButton>
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
      <PriceBreakoutDrawer
        open={isPriceBreakoutOpen}
        onClose={() => setIsPriceBreakoutOpen(false)}
        productDetails={productDetail}
      />
    </div>
  );
}

export default ProductDetail;
