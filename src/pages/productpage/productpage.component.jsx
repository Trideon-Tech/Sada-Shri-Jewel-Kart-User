import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  Typography,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search");
  const isSearchPage = location.pathname.endsWith("search");

  const [jwellery, setJwellery] = useState([]);
  const [filteredJwellery, setFilteredJwellery] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [reloadNavbar, setReloadNavbar] = useState(1);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedPriceRange, setSelectedPriceRange] = useState({});

  const images = [
    {
      label: "Diamond Jewellery",
      imgPath: "/assets/4.webp",
    },
    {
      label: "Gold Jewellery",
      imgPath: "/assets/3.webp",
    },
    {
      label: "Gemstone",
      imgPath: "/assets/11.webp",
    },
    {
      label: "Silver Jewellery",
      imgPath: "/assets/7.webp",
    },
    {
      label: "Silver Articles",
      imgPath: "/assets/8.webp",
    },
  ];

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
          customization:
            jwellery.find((item) => item.id === id)?.customizations?.variants
              ?.options[0]?.id || -1,
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
  const [selectedSort, setSelectedSort] = useState("Review | Top");

  const handleFetchFilteredData = async () => {
    if (isSearchPage) {
      // Call search API if on search page
      const searchEndpoint = `https://api.sadashrijewelkart.com/v1.0.0/user/search.php?type=search&search_term=${searchTerm}`;
      const response = await axios.get(searchEndpoint);
      setJwellery(response?.data?.response);
      setFilteredJwellery(response?.data?.response);
      setProductsLoaded(true);
    } else if (menuItemId) {
      // Call products API for category pages
      const params = {};
      params.user_id = localStorage.getItem("user_id") || -1;

      if (selectedSort !== "Featured" && selectedSort)
        params[sortOrders[selectedSort].param] = sortOrders[selectedSort].order;

      let apiUrl;
      if (isSubCategory !== "false") {
        // If it's a subcategory
        apiUrl = `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=sub-category&sub_category=${menuItemId}`;
      } else {
        // If it's a main category
        apiUrl = `https://api.sadashrijewelkart.com/v1.0.0/user/products/all.php?match-type=category&category=${menuItemId}`;
      }

      const response = await axios.get(apiUrl, { params });
      setJwellery(response?.data?.response);
      setFilteredJwellery(response?.data?.response);
      setProductsLoaded(true);
    }
  };

  useEffect(() => {
    (async () => {
      await handleFetchFilteredData();
    })();
  }, [
    refresh,
    menuItemId,
    isSubCategory,
    selectedSort,
    searchTerm,
    isSearchPage,
  ]);

  useEffect(() => {
    if (selectedPriceRange.length > 0) {
      const filtered = jwellery.filter((item) => {
        const price =
          item.customizations?.variants?.options[0]?.price || item.price;
        return selectedPriceRange.some(
          (range) => price >= range.low && price <= range.high
        );
      });
      setFilteredJwellery(filtered);
    } else {
      setFilteredJwellery(jwellery);
    }
  }, [selectedPriceRange, jwellery]);

  const handleFilterChange = (selectedRanges) => {
    setSelectedPriceRange(selectedRanges);
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
            src={
              process.env.PUBLIC_URL +
              (images.find((img) => img.label === menuItemName)?.imgPath ||
                "/assets/productList bg.jpg")
            }
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
                handleSelectedPriceRange={(range) => {
                  console.log("range", range);
                  setSelectedPriceRange(range);
                }}
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
                  filteredJwellery.map((item, _index) => (
                    <Grid item xs={3} className="product-card">
                      <JwelleryCard
                        id={item.id}
                        key={item.id}
                        image={item.images[0].file}
                        name={item.name}
                        hash={item.hash}
                        price={
                          item.customizations?.variants?.options[0]?.price ||
                          item.price
                        }
                        isWishlisted={item.exists_in_wishlist}
                        isInCart={item.exists_in_cart}
                        clickHandler={handleCardClick}
                        addToCartClick={addToCartHandler}
                        wishlistItem={item.wishlist_item[0]}
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
              paddingTop: "10px",
              paddingLeft: "5vw",
            }}
            textAlign={"left"}
            className="page-heading"
          >
            {isSearchPage ? `Search Results for "${searchTerm}"` : menuItemName}
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
                {isSearchPage ? `Search Results` : menuItemName}
              </Typography>
            </Breadcrumbs>
          </div>
        </div>
        <div className="product-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
            <Box
              style={{
                width: "100%",
                height: "5%",
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
          </div>
          <div
            style={{
              marginLeft: "4vw",
              marginBottom: "10px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.7rem",
              color: "#a36e29",
              textDecoration: "underline",
            }}
            onClick={() => {
              console.log("hey");
              setIsDrawerOpen(true);
            }}
          >
            Show Filters
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
              filteredJwellery.map((item, _index) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <JwelleryCard
                    id={item.id}
                    key={item.id}
                    image={item.images[0].file}
                    name={item.name}
                    hash={item.hash}
                    price={
                      item.customizations?.variants?.options[0]?.price ||
                      item.price
                    }
                    isWishlisted={item.exists_in_wishlist}
                    isInCart={item.exists_in_cart}
                    clickHandler={handleCardClick}
                    addToCartClick={addToCartHandler}
                    wishlistItem={item.wishlist_item[0]}
                  />
                </Grid>
              ))
            )}
          </Grid>
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
              />
            </div>
          </Drawer>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Productpage;
