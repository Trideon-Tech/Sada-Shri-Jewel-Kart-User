import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar.component";
import {
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Drawer,
  OutlinedInput,
  createTheme,
  ThemeProvider,
  Card,
  Box,
  Grid,
} from "@mui/material";
import Parser from 'html-react-parser';
import "./productdetail.styles.scss";
import ImageVideoCarousel from "./carousal.component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DimensionsIcon from "@mui/icons-material/AspectRatio";
import WeightIcon from "@mui/icons-material/ScaleOutlined";
import PurityIcon from "@mui/icons-material/CheckCircleOutline";
import {
  LocalShippingOutlined,
  LocationOnOutlined,
  ShoppingCart,
} from "@mui/icons-material";
import axios from "axios";
import JwelleryCard from "../../components/card/jwellerycard.component";

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
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState("");
  const {product} = useParams();
  const [menuItemName, hashId] = product.split("-");
  //const location = useLocation();
  //const { state } = location;
  //const { categoryName, menuItemId, menuItemName, hashId } = state;
  const [customizationOptions, setCustomizationOptions] = useState({
    metal: [],
    diamondQuality: [],
    size: [],
  });
  const [productDetail, setProductDetail] = useState({
    images: [],
    recommended: [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedDiamondType, setSelectedDiamondType] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [variants, setVariants] = useState([]); //for variant
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(""); //for variant price

  const updateSelectedVariantPrice = () => {
    const selectedOptions = [selectedMetal, selectedDiamondType, selectedSize];
    console.log(selectedOptions);

    const matchingVariant = variants.find((variant) =>
      selectedOptions.every(
        (option, index) => variant.for_customization_options[index] === option
      )
    );

    console.log(matchingVariant);

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
    console.log(product);
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/details.php?name=${menuItemName}&hash=${hashId}`
      )
      .then((response) => {
        const detail = response.data.response;
        // console.log(detail);

        const fetchedImages = detail.images
          .filter((item) => item.type === "img")
          .map(
            (item) => `https://api.sadashrijewelkart.com/assets/${item.file}`
          );
        setImages(fetchedImages);

        const fetchedVideo = detail.video
          ? `https://api.sadashrijewelkart.com/assets/${detail.video.file}`
          : "";
        setVideo(fetchedVideo);

        setCustomizationOptions({
          metal:
            detail.customizations.options_per_field["Choice Of Metal"] || [],
          diamondQuality:
            detail.customizations.options_per_field["Diamond Quality"] || [],
          size: detail.customizations.options_per_field["Select Size"] || [],
        });

        setVariants(detail.customizations.variants.options);
        setProductDetail(detail);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getJwelleryDetail();
  }, []);

  const handleCardClick = (productId, productName, hash) => {
    console.log(hash);
    navigate(`/jwellery/${menuItemName}/${productName}`, {
      state: {
        categoryName: menuItemName,
        menuItemId: productId,
        menuItemName: productName,
        hashId: hash,
      },
    });
  };

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

  const [pincode, setPincode] = useState();

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
                    <Button variant="contained" className="button" fullWidth>
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
                      {/* <td>{Parser(productDetail.description)}</td> */}
                      {productDetail.description}
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
                    onClick={() =>
                      handleCardClick(product.id, product.name, product.hash)
                    }
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
                  onClick={handleCardClick(
                    product.id,
                    product.name,
                    product.hash
                  )}
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
