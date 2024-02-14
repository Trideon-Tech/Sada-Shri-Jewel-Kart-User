import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.component";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Divider, Grid, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

import "./productpage.styles.scss";
import JwelleryCard from "../../components/card/jwellerycard.component";
import PriceFilter from "./productFilter.component";

function Productpage() {
  const location = useLocation();
  const { state } = location;
  const { menuItemId, menuItemName, isSubCategory } = state;
  const [jwellery, setJwellery] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const navigate = useNavigate();
  

  const handleCardClick = (productId, productName) => {
    // Use navigate to go to product detail page, passing the necessary state
    navigate(`/jwellery/${menuItemName}/${productName}`, {
      state: { categoryName:menuItemName, menuItemId: productId, menuItemName: productName },
    });
  };

  const handleFilterChange = (selectedRangeLabel) => {
    // Check if the range is already selected, if so remove it, if not add it
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
        const [lowStr, highStr] = rangeLabel.split(' - ');
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
          <Grid item xs={4} className="filter">
            <div className="heading">Filters</div>
            <Divider />
            <PriceFilter
              selectedPriceRanges={selectedPriceRanges}
              onFilterChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={8} className="products">
            <div className="heading">Products</div>
            <div className="product-card">
              {productsLoaded === false ? (
                <CircularProgress
                  style={{ margin: "auto", display: "flex", height: "100%" }}
                />
              ) : (
                filteredJwellery.map((item, index) => (
                  <JwelleryCard
                    key={item.id}
                    image={item.images[0].file}
                    name={item.name}
                    price={item.price}
                    onClick={() => handleCardClick(item.id, item.name)}
                  />
                ))
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Productpage;
