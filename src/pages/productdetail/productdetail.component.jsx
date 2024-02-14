import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar.component";
import {
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Drawer,
  Chip,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  createTheme,
  ThemeProvider,
  Select,
  Card,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import "./productdetail.styles.scss";
import ImageVideoCarousel from "./carousal.component";
import { useLocation } from "react-router-dom";
import DimensionsIcon from "@mui/icons-material/AspectRatio";
import WeightIcon from "@mui/icons-material/ScaleOutlined";
import PurityIcon from "@mui/icons-material/CheckCircleOutline";
import {
  LocalShippingOutlined,
  LocationCity,
  LocationOnOutlined,
  ShoppingBasket,
  ShoppingCart,
} from "@mui/icons-material";

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

const sizes = [
  { label: "1", detail: "44.8 mm", availability: "Made to Order" },
  { label: "2", detail: "44.8 mm", availability: "Made to Order" },
  { label: "3", detail: "44.8 mm", availability: "Made to Order" },
  { label: "4", detail: "44.8 mm", availability: "Made to Order" },
  { label: "5", detail: "44.8 mm", availability: "Made to Order" },
  // ... more sizes
];

const customization = [
  { label: "1", metal: "14KT Gold", availability: "Made to Order" },
  { label: "2", metal: "18KT Gold", availability: "Made to Order" },
  { label: "3", metal: "24KT Gold", availability: "Made to Order" },
];

function ProductDetail() {
  const location = useLocation();
  const { state } = location;
  const { categoryName, menuItemId, menuItemName } = state;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCustomization, setSelectedCustomization] = useState("");

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setDrawerOpen(false); // Close the drawer
  };

  const handleCustomizationSelect = (customization) => {
    setSelectedCustomization(customization);
    setDrawerOpen(false); // Close the drawer
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [pincode, setPincode] = useState();
  const images = [
    `${process.env.PUBLIC_URL + "/assets/fav.png"}`,
    `${process.env.PUBLIC_URL + "/assets/logoNew.png"}`,
  ];
  const videos =
    "https://cdn.caratlane.com/media/catalog/product/U/R/UR00660-1Y0000_16_video.mp4";

  return (
    <div className="product-detail">
      <Navbar />
      <div className="breadcrumbs-container">
        <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: "5vw" }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/jwellery/rings">
            {categoryName}
          </Link>
          <Typography color="text.primary">{menuItemName}</Typography>
        </Breadcrumbs>
      </div>
      <div className="container">
        <div className="product-content">
          <div className="product-image-section">
            {/* Placeholder for product images */}
            <ImageVideoCarousel images={images} video={videos} />
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
                      {selectedCustomization || "Select Customization"}
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
                      <Typography variant="h6">Choice of Metal</Typography>
                      {/* Add Buttons or another component to select metal choice */}
                      <Grid container>
                        {customization.map((size, index) => (
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
                              onClick={() => handleCustomizationSelect(size.metal)}
                              className={
                                selectedSize === size.label ? "selected" : ""
                              }
                            >
                              <Typography variant="body1">
                                {size.label}
                              </Typography>
                              <Typography variant="caption">
                                {size.metal}
                              </Typography>
                              <Typography variant="caption">
                                {size.availability}
                              </Typography>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>

                      <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Select Size
                      </Typography>
                      <Grid container>
                        {sizes.map((size, index) => (
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
                              onClick={() => handleSizeSelect(size.detail)}
                              className={
                                selectedSize === size.label ? "selected" : ""
                              }
                            >
                              <Typography variant="body1">
                                {size.label}
                              </Typography>
                              <Typography variant="caption">
                                {size.detail}
                              </Typography>
                              <Typography variant="caption">
                                {size.availability}
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

                <div className="price-section">
                  <Typography variant="h4" component="p" className="price">
                    ₹7,604
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
                    SKU UR00660-1Y0000
                  </Typography>
                  <Typography variant="h6" className="title">
                    Product Details
                  </Typography>
                  <Typography variant="body1" className="desc">
                    Set in 14 KT Yellow Gold (1.390 g)
                  </Typography>

                  <Grid container spacing={0} justifyContent="center">
                    <Grid item xs={4} className="detail">
                      <DimensionsIcon className="icon" />
                      <Typography className="text">
                        Dimensions
                        <br />
                        Width - 2.1 mm
                        <br />
                        Height - 1.6 mm
                        <br />
                        Size - 12 (51.8 mm)
                      </Typography>
                    </Grid>

                    <Grid item xs={4} className="detail">
                      <WeightIcon className="icon" />
                      <Typography className="text">
                        Weight
                        <br />
                        Gross 1.390 g
                      </Typography>
                    </Grid>

                    <Grid item xs={4} className="detail">
                      <PurityIcon className="icon" />
                      <Typography className="text">
                        Purity
                        <br />
                        14 KT
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
