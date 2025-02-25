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
  const [clearAll, setClearAll] = useState(false);
  const navigate = useNavigate();
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isBottomLoading, setIsBottomLoading] = useState(false);

  const images = [
    {
      label: "DIAMOND JEWELLERY",
      imgPath: "/assets/4.webp",
    },
    {
      label: "GOLD JEWELLERY",
      imgPath: "/assets/3.webp",
    },
    {
      label: "GEMSTONE",
      imgPath: "/assets/gemstone.webp",
    },
    {
      label: "SILVER JEWELLERY",
      imgPath: "/assets/7.webp",
    },
    {
      label: "SILVER ARTICLES",
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
        `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/cart.php`,
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

  const handleFetchFilteredData = async (page = 1) => {
    if (isFetching) return;
    setIsFetching(true);

    setIsBottomLoading(true);
    if (isSearchPage) {
      // Call search API if on search page
      const searchEndpoint = `${process.env.REACT_APP_API_URL}/v1.0.0/user/search.php?type=search&search_term=${searchTerm}`;
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
        apiUrl = `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/all.php?match-type=sub-category&sub_category=${menuItemId}`;
      } else {
        // If it's a main category
        apiUrl = `${process.env.REACT_APP_API_URL}/v1.0.0/user/products/all.php?match-type=category&category=${menuItemId}&page=${page}`;
      }

      const response = await axios.get(apiUrl, { params });

      // Check if there are no more products to fetch
      if (response?.data?.response.length === 0) {
        setIsFetching(true); // Stop fetching
        setIsBottomLoading(false);

        return; // Exit the function
      }

      setJwellery((prevJwellery) => [...prevJwellery, ...response?.data?.response]);
      setFilteredJwellery((prevFiltered) => [...prevFiltered, ...response?.data?.response]);
      setProductsLoaded(true);
    }
    setIsBottomLoading(false);
    setIsFetching(false);
  };

  let isThrottled = false; // Throttle flag

  const handleScroll = () => {
    const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 5; // Allow a small threshold
    if (!isAtBottom || isFetching || isThrottled) return;

    isThrottled = true; // Set throttle flag
    setCurrentPage((prevPage) => prevPage + 1);

    // Reset throttle flag after a delay
    setTimeout(() => {
      isThrottled = false;
    }, 1000); // Adjust the delay as needed
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await handleFetchFilteredData(currentPage);
    };

    const debounceFetch = setTimeout(fetchData, 300); // Debounce for 300ms

    return () => clearTimeout(debounceFetch); // Cleanup on unmount or dependency change
  }, [currentPage, refresh, menuItemId, isSubCategory, selectedSort, searchTerm, isSearchPage]);

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
              (images.find((img) => img.label === menuItemName?.split("+")[0])
                ?.imgPath || "/assets/productList bg.jpg")
            }
            style={{ width: "100%" }}
            alt="product-list-bg"
          />
        </Box>
        <div className="product-container">
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Box className="filter-title">
                <div className="heading" style={{ textTransform: "uppercase" }}>
                  Filters
                </div>
                <div
                  className="clear"
                  onClick={() => {
                    setSelectedPriceRange([]);
                    setClearAll(true);
                    // setRangeList([]);
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
                clearAll={clearAll}
                setClearAll={setClearAll}
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
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
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "0.8rem",
                    color: "grey",
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        width: "100%",
                        fontFamily: '"Roboto", sans-serif',
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
                        quantity={item.quantity}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
              {isBottomLoading && productsLoaded && (
                <CircularProgress
                  style={{
                    margin: "auto",
                    display: "flex",
                    height: "50px",
                    marginTop: "20px",
                  }}
                />
              )}
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
      {/* Mobile UI */}
      <div className="mobile" style={{ height: "max-content" }}>
        <div
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL +
              (images.find((img) => img.label === menuItemName?.split("+")[0])
                ?.imgPath || "/assets/productList bg.jpg")
              })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "5px",
            textAlign: "center",
            marginTop: "20vh",
            height: isSearchPage ? "12vh" : "15vh",
          }}
        >
          <Typography
            style={{
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: "#a36e29",
              paddingTop: "10px",
              paddingLeft: "5vw",
            }}
            textAlign={"left"}
          >
            {isSearchPage ? `Search Results for "${searchTerm}"` : ""}
            {/* {isSearchPage ? `Search Results for "${searchTerm}"` : menuItemName} */}
          </Typography>

          <div
            style={{
              marginLeft: "5vw",
            }}
          >
            {isSearchPage ? (
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  to="/"
                  style={{
                    fontSize: "small",
                    textDecoration: "none",
                    color: "black",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  Home
                </Link>
                <Typography
                  style={{
                    fontSize: "small",
                    textDecoration: "none",
                    color: "black",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  Jwellery
                </Typography>
                <Typography
                  style={{
                    fontSize: "small",
                    textDecoration: "none",
                    color: "black",
                    fontFamily: '"Roboto", sans-serif',
                  }}
                >
                  {isSearchPage ? `Search Results` : menuItemName}
                </Typography>
              </Breadcrumbs>
            ) : null}
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
                fontFamily: '"Roboto", sans-serif',
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
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
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
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                  color: "grey",
                }}
                slotProps={{
                  listbox: {
                    sx: {
                      width: "100%",
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      color: "grey",
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
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.7rem",
              color: "#a36e29",
              textDecoration: "underline",
            }}
            onClick={() => {
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
                    quantity={item.quantity}
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
                  textTransform: "uppercase",
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
