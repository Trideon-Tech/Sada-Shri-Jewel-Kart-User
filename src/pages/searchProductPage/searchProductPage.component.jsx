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
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./productpage.styles.scss";

import { Button } from "@mui/joy";
import JwelleryCard from "../../components/card/jwellerycard.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import PriceFilter from "./productFilter.component";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function SearchProductpage() {
  let query = useQuery();

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
    navigate(`/item/Rings/${productName}-${hash}`);
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
    const searchTerm = query.get("search");
    const endpoint = `${process.env.REACT_APP_API_URL}/v1.0.0/user/search.php?type=search&search_term=${searchTerm}`;
    axios
      .get(endpoint)
      .then((response) => {
        console.log(searchTerm);
        console.log("got products search: ", response.data.response);
        setJwellery(response?.data?.response);
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        // Handle error response here
      });
  };

  useEffect(() => {
    query.get("search");
    getProduct();
  }, [query]);

  // Check if state is defined to prevent errors

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
            alt="product-list-bg"
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
                selectedPriceRanges={selectedPriceRanges}
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
                <Typography style={{ marginLeft: "auto", marginRight: "1%" }}>
                  Sort by
                </Typography>
                <Select
                  defaultValue={["dog"]}
                  multiple
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
                  filteredJwellery.map((item, index) => (
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
          <div className="breadcrumbs-container">
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
              <Typography className="breadcrumb-link" color="textPrimary">
                Jwellery
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
                    image={""}
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
      <Footer />
    </div>
  );
}

export default SearchProductpage;
