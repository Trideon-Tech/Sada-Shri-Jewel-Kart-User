import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import {
  BottomNavigation,
  BottomNavigationAction,
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

import "./productpage.styles.scss";

import JwelleryCard from "../../components/card/jwellerycard.component";
import Navbar from "../../components/navbar/navbar.component";
import PriceFilter from "./productFilter.component";

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

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleCardClick = (productName, hash) => {
    console.log(hash);
    console.log(`/item/${menuItemName}/${productName}-${hash}`);
    navigate(`/item/${menuItemName}/${productName}-${hash}`);
  };

  const handleFilterChange = (selectedRangeLabel) => {
    setSelectedPriceRanges((prevSelectedRanges) => {
      if (prevSelectedRanges.includes(selectedRangeLabel)) {
        return prevSelectedRanges.filter(
          (range) => range !== selectedRangeLabel
        );
      } else {
        return [...prevSelectedRanges, selectedRangeLabel];
      }
    });
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
    const endpoint = isSubCategory
      ? `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=sub-category&sub_category=${menuItemId}`
      : `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=category&category=${menuItemId}`;

    axios
      .get(endpoint)
      .then((response) => {
        setJwellery(response.data.response);
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        // Handle error response here
      });
  };

  useEffect(() => {
    getProduct();
  }, [menuItemId, isSubCategory]);

  // Check if state is defined to prevent errors
  if (!state) {
    // Handle the case when state is not defined
    console.log("No state data found");
  }

  console.log(menuItemId);
  return (
    <div className="product-page">
      <Navbar />
      <div className="web">
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
          <Grid container spacing={0}>
            <Grid item xs={3} className="filter">
              <div className="heading">Filters</div>
              <Divider style={{ width: "100%" }} />
              <PriceFilter
                selectedPriceRanges={selectedPriceRanges}
                onFilterChange={handleFilterChange}
              />
            </Grid>

            <Grid item xs={9} className="products">
              <div className="heading">Products</div>
              <Grid container spacing={0}>
                {productsLoaded === false ? (
                  <CircularProgress
                    style={{
                      margin: "auto",
                      display: "flex",
                      height: "100%",
                    }}
                  />
                ) : (
                  filteredJwellery.map((item, index) => (
                    <Grid item xs={4} className="product-card">
                      <JwelleryCard
                        key={item.id}
                        image={item.images[0].file}
                        name={item.name}
                        price={item.price}
                        onClick={() => handleCardClick(item.name, item.hash)}
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
              filteredJwellery.map((item, index) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <JwelleryCard
                    image={item.images[0].file}
                    name={item.name}
                    price={item.price}
                    onClick={() => handleCardClick(item.name, item.hash)}
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
                onFilterChange={handleFilterChange}
              />
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default Productpage;
