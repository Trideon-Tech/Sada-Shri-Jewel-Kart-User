import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import "./productpage.styles.scss";

import JwelleryCard from "../../components/card/jwellerycard.component";
import Navbar from "../../components/navbar/navbar.component";
import PriceFilter from "./productFilter.component";
import { Button } from "@mui/joy";

function Productpage() {
  const location = useLocation();
  const { state } = location;
  const { menuItemId, menuItemName, isSubCategory } = state;
  const [jwellery, setJwellery] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [selectedPriceRange, setSelectedPriceRange] = useState({});

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleCardClick = async (productName, hash, cartAdd = false) => {
    const selectedProduct = jwellery.filter((item) => item.hash === hash)[0];
    if (!selectedProduct.customizations) {
      if (cartAdd) addToCartHandler(selectedProduct.id);
      else {
        navigate(`/item/${menuItemName}/${productName}-${hash}`);
      }
    }
    navigate(`/item/${menuItemName}/${productName}-${hash}`);
  };
  // const handleDirectAddToCart = async();

  const addToCartHandler = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      let existingList = localStorage.getItem("cart_list") || "";
      existingList = existingList.split(",");
      existingList.push(id);
      existingList = Array.from(new Set(existingList));
      localStorage.setItem("cart_list", existingList.join(","));
      navigate(0);
      return;
    }

    axios
      .put(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
        {
          product: id,
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
        console.log(`Product with ID ${id} sent to API`);
        navigate("/cart");
      })
      .catch((error) => {
        console.error(`Error sending product with ID ${id} to API`, error);
      });

    //UNDER TEST
    // axios
    //   .get(
    //     `https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php?user_id=${localStorage.getItem(
    //       "user_id"
    //     )}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     sessionStorage.setItem("cart", response.data.response.length);
    //   })
    //   .catch((error) => console.log("Error while fetching cart items", error));
  };

  const [weightFilter, setWeightFilter] = useState([0, 100]);
  const [purityFilter, setPurityFilter] = useState([0, 24]);
  const [heightFilter, setHeightFilter] = useState([0, 50]);
  const [widthFilter, setWidthFilter] = useState([0, 50]);

  const handleFetchFilteredData = async () => {
    // const products = await axios.get(
    //   "https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=all&user_id=13&min_weight=1&max_weight=100&min_height=1&max_height=100&min_width=1&max_width=100&min_purity=10&max_purity=200&min_price=0&max_price=400000"
    // );

    const params = {};
    params.user_id = localStorage.getItem("user_id") || -1;

    params.min_height = heightFilter[0];
    params.max_height = heightFilter[1];

    params.min_width = widthFilter[0];
    params.max_width = widthFilter[1];

    params.min_price = selectedPriceRange.low || 0;
    params.max_price = selectedPriceRange.high || 1000000000;

    params.min_weight = weightFilter[0];
    params.max_weight = weightFilter[1];

    params.min_purity = purityFilter[0];
    params.max_purity = purityFilter[1];

    // Define the API endpoint
    const apiUrl = `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=category&category=${menuItemId}`;

    // Make the GET request with query parameters
    const response = await axios.get(apiUrl, { params });
    setJwellery(response?.data?.response);
    setProductsLoaded(true);
    console.log("pproducts", response);
  };

  useEffect(() => {
    (async () => {
      await handleFetchFilteredData();
    })();
  }, [
    weightFilter,
    purityFilter,
    heightFilter,
    widthFilter,
    selectedPriceRange,
    menuItemId,
    isSubCategory,
  ]);

  const handleFilterChange = (selectedRangeLabel) => {
    // setSelectedPriceRanges((prevSelectedRanges) => {
    //   if (prevSelectedRanges.includes(selectedRangeLabel)) {
    //     return prevSelectedRanges.filter(
    //       (range) => range !== selectedRangeLabel
    //     );
    //   } else {
    //     return [...prevSelectedRanges, selectedRangeLabel];
    //   }
    // });
  };

  const isProductInRange = (product) => {
    // Convert product price to a number by removing currency symbol and commas
    const price = Number(product.price.replace(/[₹,]/g, ""));

    return selectedPriceRanges.some((rangeLabel) => {
      if (rangeLabel.startsWith("Over")) {
        // Extract the number after "Over ₹", remove commas and convert to Number
        const overPrice = Number(rangeLabel.replace(/[^\d]/g, ""));
        return price > overPrice;
      } else {
        // Extract the lower and upper bounds of the price range
        const [lowStr, highStr] = rangeLabel.split(" - ");
        const low = Number(lowStr.replace(/[₹,]/g, ""));
        const high = Number(highStr.replace(/[₹,]/g, ""));
        return price >= low && price <= high;
      }
    });
  };

  // Filtered jwellery based on the selected price ranges
  const filteredJwellery =
    selectedPriceRanges.length > 0
      ? jwellery.filter(isProductInRange)
      : jwellery;

  const getProduct = () => {
    let userId = localStorage.getItem("user_id")
      ? localStorage.getItem("user_id")
      : -1;

    console.log(isSubCategory, "isSubCategory");

    const endpoint = isSubCategory
      ? `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=sub-category&sub_category=${menuItemId}&user_id=${userId}`
      : `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=category&category=${menuItemId}&user_id=${userId}`;

    axios
      .get(endpoint)
      .then((response) => {
        setJwellery(response.data.response);
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect(() => {
  //   getProduct();
  // }, [isSubCategory]);

  // Check if state is defined to prevent errors
  if (!state) {
    // Handle the case when state is not defined
    console.log("No state data found");
  }

  return (
    <div className="product-page">
      <Navbar />
      <div className="web">
        <Box
          style={{
            width: "100vw",
            height: "max-content",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/assets/productList bg.jpg"}
            style={{ width: "100%" }}
          />
        </Box>
        <div className="product-container">
          <Grid container spacing={0}>
            <Grid item xs={3} className="filter">
              <Box
                style={{
                  width: "100%",
                  height: "max-content",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div className="heading">Filters</div>
                <Button
                  style={{
                    border: 0,
                    marginRight: "6%",
                    backgroundColor: "rgba(0,0,0,0)",
                    color: "#A36E29",
                    height: "max-content",
                    marginTop: "auto",
                  }}
                >
                  Clear All
                </Button>
              </Box>
              <Divider style={{ width: "90%" }} />
              <PriceFilter
                selectedPriceRange={selectedPriceRange}
                handleSelectedPriceRange={setSelectedPriceRange}
                onFilterChange={handleFilterChange}
                weightFilter={weightFilter}
                purityFilter={purityFilter}
                heightFilter={heightFilter}
                widthFilter={widthFilter}
                handleWeightFilter={setWeightFilter}
                handlePurityFilter={setPurityFilter}
                handleHeightFilter={setHeightFilter}
                handleWidthFilter={setWidthFilter}
              />
            </Grid>

            <Grid
              item
              xs={9}
              className="products"
              style={{ marginTop: "30px" }}
            >
              <Box
                style={{
                  width: "100%",
                  height: "5%",
                  marginBottom: "2%",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Typography style={{ marginLeft: "auto", marginRight: "1%" }}>
                  Sort by
                </Typography>
                <Select
                  defaultValue={["dog"]}
                  onChange={() => {}}
                  sx={{
                    minWidth: "13rem",
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                      },
                    },
                  }}
                >
                  <Option value="dog">Price: High - Low</Option>
                  <Option value="cat">Price: Low - High</Option>
                  <Option value="fish">Avg. Reviews</Option>
                  <Option value="bird">Latest</Option>
                </Select>
              </Box>
              <Grid container spacing={1}>
                {productsLoaded === false ? (
                  <CircularProgress
                    style={{
                      margin: "auto",
                      display: "flex",
                      height: "100%",
                    }}
                  />
                ) : (
                  jwellery.map((item, index) => (
                    <Grid item xs={3} className="product-card">
                      <JwelleryCard
                        id={item.id}
                        key={item.id}
                        image={item.images[0].file}
                        name={item.name}
                        hash={item.hash}
                        price={item.price}
                        isWishlisted={item.exists_in_wishlist}
                        clickHandler={handleCardClick}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="mobile">
        <div className="block-with-background">
          <Typography variant="h4" className="page-heading">
            {menuItemName}
          </Typography>

          <div className="breadcrumbs-container">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
              <Typography className="breadcrumb-link" color="textPrimary">
                Jwellery
              </Typography>
              <Typography className="breadcrumb-link" color="textPrimary">
                {menuItemName}
              </Typography>
            </Breadcrumbs>
          </div>
        </div>
        <div className="product-container">
          <div className="heading">Products</div>
          <Grid container spacing={2}>
            {productsLoaded === false ? (
              <CircularProgress
                style={{ margin: "auto", display: "flex", height: "100%" }}
              />
            ) : (
              jwellery.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <JwelleryCard
                    id={item.id}
                    key={item.id}
                    image={item.images[0].file}
                    name={item.name}
                    hash={item.hash}
                    price={item.price}
                    isWishlisted={item.exists_in_wishlist}
                    clickHandler={handleCardClick}
                  />
                </Grid>
              ))
            )}
          </Grid>
          <div className="bottom-navigation">
            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                boxShadow: "0 -2px 10px -2px rgba(0,0,0,0.2)",
              }}
              elevation={3}
            >
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction
                  label={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Filter
                      <FilterListIcon style={{ marginLeft: "5px" }} />
                    </span>
                  }
                  onClick={toggleDrawer(true)}
                />
                <BottomNavigationAction
                  label={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      Sort
                      <SortIcon style={{ marginLeft: "5px" }} />
                    </span>
                  }
                />
              </BottomNavigation>
            </Paper>
          </div>

          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
          >
            {/* Contents of the drawer */}
            <div style={{ width: 250 }}>
              <div
                className="heading"
                style={{
                  marginLeft: "20px",
                  marginTop: "10px",
                  textAlign: "start",
                  color: "#a36e29",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Filters
              </div>

              <Divider />
              <PriceFilter
                selectedPriceRanges={selectedPriceRanges}
                handleSelectedPriceRange={setSelectedPriceRange}
                onFilterChange={handleFilterChange}
                weightFilter={weightFilter}
                purityFilter={purityFilter}
                heightFilter={heightFilter}
                widthFilter={widthFilter}
                handleWeightFilter={setWeightFilter}
                handlePurityFilter={setPurityFilter}
                handleHeightFilter={setHeightFilter}
                handleWidthFilter={setWidthFilter}
              />
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default Productpage;
