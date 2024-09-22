import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRefresh } from "../../RefreshContent";
import JwelleryCard from "../../components/card/jwellerycard.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import PriceFilter from "./productFilter.component";
import "./productpage.styles.scss";

function Productpage() {
  const { refresh } = useRefresh();
  const { triggerRefresh } = useRefresh();
  const { menuItemId, category: menuItemName, isSubCategory } = useParams();

  const [jwellery, setJwellery] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [reloadNavbar, setReloadNavbar] = useState(1);
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
        navigate(`/item/${menuItemName}/${productName}-${hash}?drawer=open`);
      }
    }
    navigate(`/item/${menuItemName}/${productName}-${hash}?drawer=open`);
  };

  const addToCartHandler = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      let existingList = localStorage.getItem("cart_list") || "";
      existingList = existingList.split(",");
      existingList.push(id);
      existingList = Array.from(new Set(existingList));
      localStorage.setItem("cart_list", existingList.join(","));
      triggerRefresh();
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
  };

  const sortOrders = {
    Featured: { param: "", order: "" },
    "Price | Low-High": { param: "price_sort", order: "ASC" },
    "Price | High-Low": { param: "price_sort", order: "DESC" },
    "Review | Top": { param: "review_sort", order: "DESC" },
    "Review | Low": { param: "review_sort", order: "ASC" },
  };
  const [weightFilter, setWeightFilter] = useState([0, 100]);
  const [purityFilter, setPurityFilter] = useState([0, 24]);
  const [heightFilter, setHeightFilter] = useState([0, 50]);
  const [widthFilter, setWidthFilter] = useState([0, 50]);
  const [selectedSort, setSelectedSort] = useState("Review | Top");

  const handleFetchFilteredData = async () => {
    if (!menuItemId) return;
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

    if (selectedSort !== "Featured" && selectedSort)
      params[sortOrders[selectedSort].param] = sortOrders[selectedSort].order;

    const apiUrl = `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=category&category=${menuItemId}`;

    const response = await axios.get(apiUrl, { params });
    setJwellery(response?.data?.response);
    console.log(response?.data?.response);
    setProductsLoaded(true);
  };

  useEffect(() => {
    (async () => {
      await handleFetchFilteredData();
    })();
  }, [
    refresh,
    weightFilter,
    purityFilter,
    heightFilter,
    widthFilter,
    selectedPriceRange,
    menuItemId,
    isSubCategory,
    selectedSort,
  ]);

  const handleFilterChange = (_selectedRangeLabel) => {};

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

  return (
    <div className="product-page">
      <Navbar triggerRefresh={reloadNavbar} />
      <div className="web" style={{ height: "max-content" }}>
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
            <Grid item xs={3}>
              <Box className="filter-title">
                <div className="heading">Filters</div>
                <div
                  className="clear"
                  onClick={() => {
                    setSelectedPriceRange([]);
                  }}
                >
                  Clear All
                </div>
              </Box>
              <Divider style={{ width: "90%" }} />
              <PriceFilter
                selectedPriceRange={selectedPriceRange}
                handleSelectedPriceRange={setSelectedPriceRange}
                onFilterChange={handleFilterChange}
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
                <Typography
                  style={{
                    marginLeft: "auto",
                    marginRight: "1%",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                >
                  Sort by
                </Typography>
                <Select
                  defaultValue={"Featured"}
                  onChange={(value) => {
                    setSelectedSort(value?.target?.textContent);
                  }}
                  sx={{
                    minWidth: "10rem",
                    background: "none",
                    border: "none",
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                      },
                    },
                  }}
                >
                  {Object.keys(sortOrders).map((sort) => (
                    <Option value={sort}>{sort}</Option>
                  ))}
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
                  jwellery.map((item, _index) => (
                    <Grid item xs={3} className="product-card">
                      <JwelleryCard
                        id={item.id}
                        key={item.id}
                        image={item.images[0].file}
                        name={item.name}
                        hash={item.hash}
                        price={item.price}
                        isWishlisted={item.exists_in_wishlist}
                        isInCart={item.exists_in_cart}
                        clickHandler={handleCardClick}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
      {/* Mobile UI */}
      <div className="mobile" style={{ height: "max-content" }}>
        <div className="block-with-background">
          <Typography
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: "#a36e29",
            }}
            className="page-heading"
          >
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
          <div
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#a36e29",
              marginLeft: "4vw",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            Products
          </div>
          <Grid
            container
            spacing={2}
            style={{
              paddingBottom: "55px",
              marginBottom: "55px",
            }}
          >
            {productsLoaded === false ? (
              <div
                style={{
                  width: "100%",
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress style={{ color: "#a36e29" }} />
              </div>
            ) : (
              jwellery.map((item, _index) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <JwelleryCard
                    id={item.id}
                    key={item.id}
                    image={item.images[0].file}
                    name={item.name}
                    hash={item.hash}
                    price={item.price}
                    isWishlisted={item.exists_in_wishlist}
                    isInCart={item.exists_in_cart}
                    clickHandler={handleCardClick}
                  />
                </Grid>
              ))
            )}
          </Grid>
          <div className="bottom-navigation">
            <Paper
              sx={{
                height: "55px",
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
                onChange={(_event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction
                  label={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                        color: "#a36e29",
                      }}
                    >
                      Filter
                      <FilterListIcon style={{ marginLeft: "5px" }} />
                    </span>
                  }
                  onClick={toggleDrawer(true)}
                />
                <BottomNavigationAction
                  label={
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: "0.8rem",
                        color: "#a36e29",
                      }}
                    >
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

      {/* <Footer /> */}
    </div>
  );
}

export default Productpage;
