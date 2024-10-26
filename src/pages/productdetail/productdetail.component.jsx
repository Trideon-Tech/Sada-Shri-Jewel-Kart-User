import {
  Close,
  CloseSharp,
  FavoriteBorderOutlined,
  KeyboardArrowDownOutlined,
  LocalShippingOutlined,
  ShoppingBagOutlined,
  ShoppingCartOutlined,
  StarBorderOutlined,
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
  const [selectedCustomization, setSelectedCustomization] = useState({});
  const [selctedVariantId, setSelectedVariantId] = useState();
  const [selectedCustomizationPrice, setSelectedCustomizationPrice] =
    useState();

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
          customization: selctedVariantId || -1,
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
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);

  const [pincode, setPincode] = useState("");
  const [locationModalOpen, setLocationModalOpen] = useState();
  const [mobileLocationModalOpen, setMobileLocationModalOpen] = useState();
  const [currentPosition, setCurrentPosition] = useState([]);
  const [currentPositionAddress, setCurrentPositionAddresss] = useState("");
  const [currentPositionPincode, setCurrentPositionPincode] = useState("");
  const [eta, setETA] = useState("");

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

  const handleDrawerOpen = () => {
    mediaQuery ? setDrawerOpen(true) : setBottomDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    mediaQuery ? setDrawerOpen(false) : setBottomDrawerOpen(false);

    // Calculate Variant Price
    if (
      customizationTypes.length === Object.keys(selectedCustomization).length
    ) {
      let options = Object.values(selectedCustomization);
      let variant;

      customizationVariants.forEach((o) => {
        let isMatch =
          o.for_customization_options.sort().toString() ===
          options.sort().toString();

        if (isMatch) {
          variant = o;
        }
      });

      console.log(variant);
      setSelectedVariantId(variant.id);
      setSelectedCustomizationPrice(variant.price);
    } else {
      setSelectedCustomizationPrice(() => product.price);
    }
  };

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

  const buyNow = async () => {
    if (
      customizationTypes.length === Object.keys(selectedCustomization).length
    ) {
      const userId = localStorage.getItem("user_id")
        ? localStorage.getItem("user_id")
        : -1;

      if (userId !== -1) {
        // getAddress();
        // setBuyNowDrawer(true);
        navigate(
          `/checkout?action=buy-now&prod=${productDetail?.name}&hash=${
            productDetail?.hash
          }&customization=${selctedVariantId || -1}`
        );
      } else {
        navigate(
          `/signin?redirect_to=/item/${productDetail?.category}/${productDetail?.name}-${productDetail?.hash}`
        );
      }
    } else {
      toast("Select Customization", generalToastStyle);
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
        <div className="container">
          <div className="product-content">
            <div
              className="product-image-section"
              style={{
                position: "relative",
                padding: "20px",
                marginTop: "30px",
              }}
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
                      marginRight: "7%",
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
                      marginRight: "7%",
                      marginTop: "5%",
                      color: "#ffffff",
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
                    fontSize: "1.8rem",
                    marginTop: "40px",
                  }}
                >
                  {menuItemName}
                </Typography>
              </div>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
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
                  <StarBorderOutlined
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
                  onClick={() => handleClickOpen()}
                >
                  <ShareIcon style={{ fontSize: "1.2rem", color: "#a36e29" }} />
                </Box>
              </Box>
              <Grid container spacing={3} style={{ marginTop: "1%" }}>
                <Grid item xs={6} className="customization-grid">
                  {hasCustomization ? (
                    <Box>
                      <Box sx={{ marginBottom: 2 }}>
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            color: "#666",
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          Select Customization
                        </Typography>
                        <Box
                          onClick={handleDrawerOpen}
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
                          }}
                        >
                          {Object.keys(selectedCustomization).map((type) => (
                            <Box
                              style={{
                                borderRadius: "20px",
                                width: "max-content",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                marginTop: "5px",
                                marginBottom: "5px",
                                height: "25px",
                                backgroundColor: "#A36E29",
                                color: "white",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                marginRight: "8px",
                              }}
                            >
                              <Typography
                                style={{
                                  fontFamily: '"Open Sans", sans-serif',
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                }}
                              >
                                {selectedCustomization[type]}
                              </Typography>
                            </Box>
                          ))}
                          <KeyboardArrowDownOutlined
                            style={{
                              marginLeft: "auto",
                              color: "darkgray",
                              fontSize: "1.5rem",
                            }}
                          />
                        </Box>
                        {selectedCustomizationPrice === product.price ? (
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.7rem",
                              marginTop: "5px",
                            }}
                          >
                            Select all customization to seel the updated price.
                          </div>
                        ) : null}
                      </Box>
                      <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={handleDrawerClose}
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
                          Select Customization
                        </div>

                        <Box
                          sx={{
                            padding: "18px",
                            paddingLeft: "25px",
                            width: "30vw",
                          }}
                        >
                          {customizationTypes.map((type) => (
                            <>
                              <Typography
                                sx={{
                                  fontFamily: '"Open Sans", sans-serif',
                                  fontSize: "1.2rem",
                                  fontWeight: "600",
                                  marginBottom: "10px",
                                }}
                              >
                                {type}
                              </Typography>
                              <Grid container>
                                {customizationOptions[type].map((option) => (
                                  <Grid item xs={3} key={option}>
                                    <Button
                                      variant="outlined"
                                      sx={{
                                        height: "8rem",
                                        width: "8rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        textAlign: "center",
                                        borderColor:
                                          selectedCustomization[type] === option
                                            ? "#a36e29"
                                            : "divider",
                                        borderRadius: "15px",
                                        boxShadow: 2,
                                        marginRight: "15px",
                                        marginBottom: "15px",

                                        "&:hover": {
                                          borderColor: "#a36e29",
                                          backgroundColor:
                                            "rgba(163, 110, 41, 0.05)",
                                        },
                                      }}
                                      onClick={() => {
                                        setSelectedCustomization(
                                          (prevState) => {
                                            const newCustomization = {
                                              ...prevState,
                                            };
                                            newCustomization[type] = option;
                                            return newCustomization;
                                          }
                                        );

                                        console.log(selectedCustomization);
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontFamily: '"Open Sans", sans-serif',
                                          fontSize: "0.85rem",
                                          fontWeight: "600",
                                          color: "black",
                                        }}
                                      >
                                        {option}
                                      </Typography>
                                      <Box
                                        style={{
                                          backgroundColor:
                                            selectedCustomization[type] ===
                                            option
                                              ? "#a36e29"
                                              : "transparent",
                                          border: "1px solid #a36e29",
                                          padding: "4px 10px",
                                          borderRadius: "10px",
                                          marginTop: "8px",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            color:
                                              selectedCustomization[type] ===
                                              option
                                                ? "white"
                                                : "#a36e29",
                                            fontFamily:
                                              '"Open Sans", sans-serif',
                                            fontSize: "0.75rem",
                                            textTransform: "none",
                                            fontWeight: "600",
                                          }}
                                        >
                                          Made On Order
                                        </Typography>
                                      </Box>
                                    </Button>
                                  </Grid>
                                ))}
                              </Grid>
                            </>
                          ))}
                        </Box>
                      </Drawer>
                    </Box>
                  ) : null}
                  <div className="price-section">
                    <Typography className="price">
                      ₹{selectedCustomizationPrice || productDetail.price}
                    </Typography>
                    <Typography className="original-price">
                      MRP ₹9,010
                    </Typography>
                  </div>
                  <Typography className="discount">
                    Flat 50% off on Making Charges
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      style={{
                        width: "325px",
                        padding: "10px",
                        fontWeight: "bold",
                        background: "#a36e29",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "1rem",
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
                        width: "325px",
                        padding: "10px",
                        fontWeight: "bold",
                        color: "#a36e29",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "1rem",
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
                </Grid>

                <Grid item xs={6} className="location-grid">
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      color: "#666",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "500",
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
                <Grid item xs={12} className="detail-grid">
                  <Card className="card" style={{ backgroundColor: "white" }}>
                    <Typography className="sku">
                      #{productDetail.hash?.toUpperCase()}
                    </Typography>
                    <Typography className="title">Product Details</Typography>
                    <Typography className="desc">
                      {typeof productDetail.description !== "undefined"
                        ? parse(productDetail.description)
                        : ""}
                    </Typography>

                    <Grid
                      container
                      spacing={0}
                      justifyContent="left"
                      rowSpacing={1}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Weight :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            Gross: {productDetail.weight} g
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Purity :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {productDetail.purity} KT
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Width :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {productDetail.width} mm
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Height :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {productDetail.height} mm
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </div>
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

        <div className="container-similar">
          <Reviews
            productDetails={productDetail}
            rating={averageRating}
            reviewsCount={totalReviewsCount}
          />
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
                  ₹{selectedCustomizationPrice || productDetail.price}
                </Typography>
                <Typography className="original-price">
                  MRP ₹
                  {(selectedCustomizationPrice || productDetail.price) * 1.2}
                </Typography>
              </div>
              <Typography
                style={{
                  fontWeight: "bold",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1.2rem",
                }}
              >
                {product.price}
              </Typography>
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
                {/* Customization */}

                {hasCustomization ? (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "start",
                          color: "#666",
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          marginTop: "10px",
                        }}
                      >
                        Select Customization
                      </Typography>
                      <Box
                        onClick={handleDrawerOpen}
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
                        }}
                      >
                        {Object.keys(selectedCustomization).map((type) => (
                          <Box
                            style={{
                              borderRadius: "20px",
                              width: "max-content",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              marginTop: "5px",
                              marginBottom: "5px",
                              height: "25px",
                              backgroundColor: "#A36E29",
                              color: "white",
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              marginRight: "8px",
                            }}
                          >
                            <Typography
                              style={{
                                fontFamily: '"Open Sans", sans-serif',
                                fontSize: "0.8rem",
                                fontWeight: "600",
                              }}
                            >
                              {selectedCustomization[type]}
                            </Typography>
                          </Box>
                        ))}
                        <KeyboardArrowDownOutlined
                          style={{
                            marginLeft: "auto",
                            color: "darkgray",
                            fontSize: "1.5rem",
                          }}
                        />
                      </Box>
                      {selectedCustomizationPrice === product.price ? (
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.7rem",
                            marginTop: "5px",
                          }}
                        >
                          Select all customization to seel the updated price.
                        </div>
                      ) : null}
                    </Grid>
                    <Drawer
                      anchor="bottom"
                      open={bottomDrawerOpen}
                      onClose={handleDrawerClose}
                    >
                      <div
                        style={{
                          backgroundColor: "#E0B872",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingLeft: "25px",
                          paddingRight: "25px",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "1.6rem",
                            fontWeight: "600",

                            color: "white",
                            padding: "18px",
                          }}
                        >
                          Select Customization
                        </div>
                        <Close
                          style={{
                            color: "white",
                          }}
                          onClick={handleDrawerClose}
                        />
                      </div>

                      <Box
                        sx={{
                          padding: "18px",
                          paddingLeft: "25px",
                        }}
                      >
                        {customizationTypes.map((type) => (
                          <>
                            <Typography
                              sx={{
                                fontFamily: '"Open Sans", sans-serif',
                                fontSize: "1.2rem",
                                fontWeight: "600",
                                marginBottom: "10px",
                              }}
                            >
                              {type}
                            </Typography>
                            <Grid container>
                              {customizationOptions[type].map((option) => (
                                <Grid item xs={6} key={option}>
                                  <Button
                                    variant="outlined"
                                    sx={{
                                      height: "8rem",
                                      width: "8rem",
                                      display: "flex",
                                      flexDirection: "column",
                                      textAlign: "center",
                                      borderColor:
                                        selectedCustomization[type] === option
                                          ? "#a36e29"
                                          : "divider",
                                      borderRadius: "15px",
                                      boxShadow: 2,
                                      marginRight: "15px",
                                      marginBottom: "15px",

                                      "&:hover": {
                                        borderColor: "#a36e29",
                                        backgroundColor:
                                          "rgba(163, 110, 41, 0.05)",
                                      },
                                    }}
                                    onClick={() => {
                                      setSelectedCustomization((prevState) => {
                                        const newCustomization = {
                                          ...prevState,
                                        };
                                        newCustomization[type] = option;
                                        return newCustomization;
                                      });

                                      console.log(selectedCustomization);
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontFamily: '"Open Sans", sans-serif',
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        color: "black",
                                      }}
                                    >
                                      {option}
                                    </Typography>
                                    <Box
                                      style={{
                                        backgroundColor:
                                          selectedCustomization[type] === option
                                            ? "#a36e29"
                                            : "transparent",
                                        border: "1px solid #a36e29",
                                        padding: "4px 10px",
                                        borderRadius: "10px",
                                        marginTop: "8px",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          color:
                                            selectedCustomization[type] ===
                                            option
                                              ? "white"
                                              : "#a36e29",
                                          fontFamily: '"Open Sans", sans-serif',
                                          fontSize: "0.75rem",
                                          textTransform: "none",
                                          fontWeight: "600",
                                        }}
                                      >
                                        Made On Order
                                      </Typography>
                                    </Box>
                                  </Button>
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        ))}
                      </Box>
                    </Drawer>
                  </>
                ) : null}
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

                <Grid item xs={12} className="detail-grid">
                  <Card
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#666",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                      }}
                    >
                      #{productDetail.hash?.toUpperCase()}
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: "bold",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "1.2rem",
                      }}
                    >
                      Product Details
                    </Typography>
                    <Typography
                      style={{
                        color: "#666",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                      }}
                    >
                      {typeof productDetail.description !== "undefined"
                        ? parse(productDetail.description)
                        : ""}
                    </Typography>

                    <Grid
                      container
                      spacing={0}
                      justifyContent="left"
                      rowSpacing={1}
                    >
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Weight :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            Gross: {productDetail.weight} g
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Purity :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {productDetail.purity} KT
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Width :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {productDetail.width} mm
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.8rem",
                          }}
                        >
                          Height :-
                          <br />
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {productDetail.height} mm
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
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
