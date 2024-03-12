import {
  LocalShippingOutlined,
  LocationOnOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import DimensionsIcon from "@mui/icons-material/AspectRatio";
import PurityIcon from "@mui/icons-material/CheckCircleOutline";
import WeightIcon from "@mui/icons-material/ScaleOutlined";
import {
  Box,
  Button,
  Card,
  Drawer,
  Grid,
  OutlinedInput,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./productdetail.styles.scss";

import JwelleryCard from "../../components/card/jwellerycard.component";
import Navbar from "../../components/navbar/navbar.component";
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

function ProductDetail() {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const { product } = useParams();
  const [menuItemName, hashId] = product.split("-");

  const [customizationOptions, setCustomizationOptions] = useState({
    metal: [],
    diamondQuality: [],
    size: [],
  });

  const [productDetail, setProductDetail] = useState({
    images: [],
    recommended: [],
    price: 0,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedDiamondType, setSelectedDiamondType] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [variants, setVariants] = useState([]); //for variant
  const [selectedVariant, setSelectedVariant] = useState({});
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(""); //for variant price
  const [pincode, setPincode] = useState();

  const isLoggedIn = () => Boolean(localStorage.getItem("token"));

  const addToCart = () => {
    const cartProduct = {
      ...selectedVariant,
      id: productDetail.id, 
      name: productDetail.name,
      price: selectedVariant.price || productDetail.price, 
      quantity: 1,
    };

    if (!isLoggedIn()) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productIndex = cart.findIndex((item) => item.id === cartProduct.id);

      if (productIndex !== -1) {
        cart[productIndex].quantity += 1; 
      } else {
        cart.push(cartProduct); 
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      const token = localStorage.getItem("token");
      axios
        .put(
          "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
          { product: cartProduct.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          console.log("Product added to cart");
        })
        .catch((error) => {
          console.error("Error adding product to cart", error);
        });
    }
  };

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
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/details.php?name=${menuItemName}&hash=${hashId}`
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

  return (
    <div className="product-detail">
      <Navbar />
      <div className="web">
        <div className="container">
          <div className="product-content">
            <div className="product-image-section">
              {/* Placeholder for product images */}
              <ImageVideoCarousel images={images} video={video} />
            </div>
            <div className="product-detail-section">
              <div className="title">
                <Typography variant="h5" component="h1">
                  {menuItemName}
                </Typography>
              </div>
              <div className="rating-reviews">4.9 ★ 45</div>
              <Grid container spacing={0}>
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
                          <Button
                            onClick={handleDrawerOpen}
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
                            onClick={handleDrawerOpen}
                            fullWidth
                            sx={{
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
                          open={drawerOpen}
                          onClose={handleDrawerClose}
                        >
                          <Box
                            sx={{
                              padding: 2,
                              width: 500,
                            }}
                          >
                            <Typography variant="h6">
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
                                        "&.selected": {
                                          backgroundColor: "primary.main",
                                          color: "primary.contrastText",
                                          "&:hover": {
                                            backgroundColor: "#a36e29",
                                          },
                                        },
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
                                        sx={{ color: "#a36e29" }}
                                      >
                                        {metalOption}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#a36e29" }}
                                      >
                                        Made on Order
                                      </Typography>
                                    </Button>
                                  </Grid>
                                )
                              )}
                            </Grid>

                            <Typography variant="h6" sx={{ marginTop: 2 }}>
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
                                        sx={{ color: "#a36e29" }}
                                      >
                                        {diamondOption}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#a36e29" }}
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
                                      sx={{ color: "#a36e29" }}
                                    >
                                      {size}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#a36e29" }}
                                    >
                                      Made On Order
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
                              onClick={handleDrawerClose}
                            >
                              Confirm Customization
                            </Button>
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
                      ₹9,010
                    </Typography>
                  </div>
                  <Typography variant="body1" className="discount">
                    Flat 50% off on Making Charges
                  </Typography>
                  <div className="actions">
                    <Button
                      variant="contained"
                      className="button"
                      fullWidth
                      onClick={addToCart}
                    >
                      Add to Cart
                      <ShoppingCart className="button-icon" />
                    </Button>
                  </div>
                </Grid>

                <Grid item xs={6} className="location-grid">
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
                <Grid item xs={12} className="detail-grid">
                  <Card className="card">
                    <Typography variant="subtitle2" className="sku">
                      {productDetail.hash}
                    </Typography>
                    <Typography variant="h6" className="title">
                      Product Details
                    </Typography>
                    <Typography variant="body1" className="desc">
                      {typeof productDetail.description !== "undefined"
                        ? parse(productDetail.description)
                        : ""}
                    </Typography>

                    <Grid container spacing={0} justifyContent="center">
                      <Grid item xs={4} className="detail">
                        <WeightIcon className="icon" />
                        <Typography className="text">
                          Weight
                          <br />
                          {productDetail.weight} g
                        </Typography>
                      </Grid>

                      <Grid item xs={4} className="detail">
                        <PurityIcon className="icon" />
                        <Typography className="text">
                          Purity
                          <br />
                          {productDetail.purity} KT
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className="detail">
                        <DimensionsIcon className="icon" />
                        <Typography className="text">
                          Dimensions
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
        </div>
        {productDetail.recommended && productDetail.recommended.length > 0 && (
          <div className="container-similar">
            <div className="similar-product-section">
              <h2 className="title">Similar Products</h2>
              <div className="products-scroll-container">
                {productDetail.recommended.map((product) => (
                  <JwelleryCard
                    key={product.id}
                    image={product.images[0].file}
                    name={product.name}
                    price={product.price}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
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
                  <div className="rating-reviews">4.9 ★ 45</div>
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
                        marginTop: "20px",
                        display: "flex",
                        alignItems: "start",
                        color: "#666",
                      }}
                    >
                      Select Size
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
            <h2 className="title">Similar Products</h2>
            <div className="products-scroll-container">
              {productDetail.recommended?.map((product) => (
                <JwelleryCard
                  key={product.id}
                  image={product.images[0].file}
                  name={product.name}
                  price={product.price}
                />
              )) || null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
