import {
  AccountCircleOutlined,
  ExpandLess,
  ExpandMore,
  FavoriteBorderOutlined,
  HowToReg,
  Login,
  Logout,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/joy/Badge";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Button from "@mui/joy/Button";
import {
  AppBar,
  Avatar,
  ClickAwayListener,
  Collapse,
  Dialog,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Marquee from "react-marquee-slider";
import { Link, useNavigate } from "react-router-dom";
import { useRefresh } from "../../RefreshContent";
import "./navbar.styles.scss";

const Navbar = () => {
  const { refresh } = useRefresh();
  const matches = useMediaQuery("(min-width:600px)");
  const [menuItems, setMenuItems] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openWebDrawer, setOpenWebDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchIndex, setSearchIndex] = useState([]);
  let navigate = useNavigate();
  const [wishListItems, setWishListItems] = useState(0);
  const [cartLength, setCartLength] = useState(0);
  const [rates, setRates] = useState([
    ["TODAY'S GOLD AND SILVER RATES", ""],
    ["GOLD 22KT (PER GM)", ""],
    ["GOLD 18KT (PER GM)", ""],
    ["SILVER (PER GM)", ""],
  ]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  const getCartLengthNonAuth = () => {
    const cartList = localStorage.getItem("cart_list") || "";
    if (cartList && cartList.length > 0) {
      const cartItems = cartList.split(",");
      setCartLength(cartItems.length - 1);
    } else {
      setCartLength(0);
    }
  };

  useEffect(() => {
    (async () => {
      await loadWishListToAccount();
    })();
  }, []);

  const loadWishListToAccount = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      let wishListExist = localStorage.getItem("wish_list");
      if (wishListExist && wishListExist.length > 0) {
        const wishlistItems = wishListExist?.split(",");
        if (wishlistItems.length > 0)
          wishlistItems?.forEach(async (id) => {
            await pushToWishList(id);
          });
        localStorage.removeItem("wish_list");
      }
    }
  };

  const pushToWishList = async (id) => {
    const defaultWishlist = localStorage.getItem("default_wishlist");
    if (!defaultWishlist) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("type", "add_item");
      formData.append("wishlist_id", localStorage.getItem("default_wishlist"));
      formData.append("product_id", id);
      await axios.post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        getCartLengthNonAuth();
        console.log("cartLength", cartLength);
        return;
      }
      setCartLength(sessionStorage.getItem("cart"));
      const { data } = await axios.get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php?type=wishlist&user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("wishlist List", data);
      if (data.response)
        localStorage.setItem("default_wishlist", data?.response[0]?.id);
    })();
  }, [refresh]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        let wishListItems = localStorage.getItem("wish_list");
        if (wishListItems && wishListItems.length > 0) {
          wishListItems = wishListItems.split(",");

          setWishListItems(wishListItems.length);
        }
        return;
      }

      const { data } = await axios.get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php?type=wishlist_items&wishlist_id=${localStorage.getItem(
          "default_wishlist"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("wishlist", data);
      setWishListItems(data?.response?.length);
    })();
  }, [refresh]);

  useEffect(() => {
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
      .then((response) => {
        setMenuItems(response?.data?.response?.categories);
        setSearchIndex(response?.data?.response?.search_index || []);

        let tempRates = rates;

        tempRates[1][1] = response?.data?.response?.jewellery_inventory?.gold22;
        tempRates[2][1] = response?.data?.response?.jewellery_inventory?.gold18;
        tempRates[3][1] = response?.data?.response?.jewellery_inventory?.silver;

        setRates(() => tempRates);
      })
      .catch((error) => console.error("Error fetching menu items:", error));

    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php?user_id=${localStorage.getItem(
          "user_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response?.data);
        console.log(response?.data?.response?.length);
        sessionStorage.setItem("cart", response?.data?.response?.length || 0);
      })
      .catch((error) => console.log("Error while fetching cart items", error));

    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
      .then((response) => {
        console.log("landing page:: ", response);
        setMenuItems(response.data.response.categories);
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  }, [refresh]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const filteredResults = searchIndex.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredResults);
    setShowSearchDropdown(true);
  };

  const handleSearchItemClick = (item) => {
    console.log(item);
    setSearchTerm(item);
    setShowSearchDropdown(false);
    navigate(`/jwellery/search?search=${item}`);
  };

  const handleFuzzySearch = (event) => {
    if (event.key === "Enter") {
      console.log(searchTerm);
      if (searchTerm.length === 0) return;
      setShowSearchDropdown(false);
      navigate(`/jwellery/search?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/");
  };

  const handleMenuItemClick = (menuItem) => {
    setOpenDrawer(false);
    setOpenWebDrawer(false);

    const isSubCategory =
      menuItem.sub_categories && menuItem.sub_categories.length > 0;

    navigate(`/jwellery/${menuItem.name}/${menuItem.id}/${!isSubCategory}`);
  };

  const handleSubMenuItemClick = (category, menuItem) => {
    setOpenDrawer(false);
    setOpenWebDrawer(false);

    const isSubCategory =
      menuItem.sub_categories && menuItem.sub_categories.length > 0;

    navigate(
      `/jwellery/${category + "+" + menuItem.name}/${menuItem.id
      }/${!isSubCategory}`
    );
  };

  return (
    <div
      className="navbar"
      style={{
        marginBottom: matches ? "100px" : "0px",
        width: "100%",
      }}
    >
      <div className="web">
        <AppBar elevation={0} className="appbar">
          <div className="rates">
            <Marquee velocity={20} direction="ltr" scatterRandomly={false}>
              {[...rates, ...rates, ...rates, ...rates].map((rate, index) => (
                <div
                  style={{
                    marginRight: "4rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "2.5rem",
                    fontWeight: "bold",
                  }}
                  key={index}
                >
                  {rate === rates[0] ? `${rate}` : `${rate[0]}: ₹ ${rate[1]}`}
                </div>
              ))}
            </Marquee>
          </div>
          <div variant="dense" className="toolbar">
            <IconButton onClick={() => setOpenWebDrawer(true)}>
              <MenuOutlined style={{ color: "#a36e29" }} />
            </IconButton>
            <img
              alt="logo"
              className="logo"
              src={process.env.PUBLIC_URL + "/assets/logo_dark.png"}
              onClick={() => navigate(`/`)}
            />
            <div className="search" style={{ position: "relative" }}>
              <div className="search-icon">
                <SearchIcon />
              </div>
              <ClickAwayListener
                onClickAway={() => setShowSearchDropdown(false)}
              >
                <div style={{ width: "100%" }}>
                  <InputBase
                    placeholder="Search for Jewellery..."
                    classes={{
                      root: "input-root",
                      input: "input-input",
                    }}
                    inputProps={{ "aria-label": "search" }}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleFuzzySearch}
                  />
                  {showSearchDropdown && searchResults.length > 0 && (
                    <Paper
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                    >
                      <List>
                        {searchResults.map((result, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() => handleSearchItemClick(result)}
                          >
                            <Typography
                              style={{
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "0.8rem",
                              }}
                            >
                              {result}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </div>
              </ClickAwayListener>
            </div>
            <div className="icons">
              <Dropdown>
                <MenuButton
                  slots={{ root: IconButton }}
                  slotProps={{ root: { variant: "plain", color: "neutral" } }}
                  sx={{ borderRadius: 40 }}
                >
                  <AccountCircleOutlined style={{ color: "#a36e29" }} />
                </MenuButton>
                <Menu
                  style={{
                    width: matches ? "15vw" : "40vw",
                    height: "max-content",
                    paddingTop: "40px",
                  }}
                >
                  {localStorage.getItem("token") ? (
                    <MenuItem component={Link} to="/my-account">
                      <AccountCircleIcon style={{ color: "#a36e29" }} />
                      <Typography
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                        }}
                      >
                        My Account
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem component={Link} to="/signup">
                      <HowToRegRoundedIcon style={{ color: "#a36e29" }} />
                      <Typography
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                        }}
                      >
                        Register
                      </Typography>
                    </MenuItem>
                  )}
                  {localStorage.getItem("token") ? (
                    <MenuItem onClick={handleLogout}>
                      <ExitToAppRoundedIcon style={{ color: "#a36e29" }} />
                      <Typography
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                        }}
                      >
                        Logout
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem component={Link} to="/signin">
                      <LoginRoundedIcon style={{ color: "#a36e29" }} />
                      <Typography
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                        }}
                      >
                        SignIn
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Dropdown>

              <IconButton color="inherit" component={Link} to="/wishlist">
                <Badge
                  badgeContent={wishListItems}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#a36e29" } }}
                >
                  <FavoriteBorderOutlined />
                </Badge>
              </IconButton>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge
                  badgeContent={cartLength}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#a36e29" } }}
                >
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>
            </div>
          </div>
        </AppBar>
        <Drawer
          anchor="left"
          open={openWebDrawer}
          onClose={() => setOpenWebDrawer(false)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "15vw",
            }}
          >
            <List>
              <ListItem
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Select an item
                </div>
                <IconButton onClick={() => setOpenWebDrawer(false)}>
                  <CloseIcon />
                </IconButton>
              </ListItem>
            </List>
            <div style={{ flexGrow: 1, overflowY: "auto" }}>
              <List>
                {menuItems.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <ListItem
                      button
                      onClick={() => handleMenuItemClick(category)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={category.name}
                          src={process.env.PUBLIC_URL + "/assets/gif.gif"}
                        />
                      </ListItemAvatar>
                      <div
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                          flexGrow: 1,
                        }}
                      >
                        {category.name}
                      </div>
                      {category.sub_categories &&
                        category.sub_categories.length > 0 && (
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCategory(
                                expandedCategory === category.id
                                  ? null
                                  : category.id
                              );
                            }}
                          >
                            {expandedCategory === category.id ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        )}
                    </ListItem>
                    {category.sub_categories && (
                      <Collapse
                        in={expandedCategory === category.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {category.sub_categories.map((subCategory) => (
                            <ListItem
                              button
                              key={subCategory.id}
                              onClick={() =>
                                handleSubMenuItemClick(
                                  category.name,
                                  subCategory
                                )
                              }
                              style={{ paddingLeft: 32 }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  alt={subCategory.name}
                                  src={`${process.env.PUBLIC_URL}/assets/gif.gif`}
                                />
                              </ListItemAvatar>
                              <div
                                style={{
                                  fontFamily: '"Roboto", sans-serif',
                                  fontSize: "0.8rem",
                                }}
                              >
                                {subCategory.name}
                              </div>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                ))}
              </List>
            </div>
            <div style={{ padding: "16px", borderTop: "1px solid #e0e0e0" }}>
              <ListItem
                onClick={() =>
                  window.open("https://seller.sadashrijewelkart.com", "_blank")
                }
              >
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: "#a36e29",
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                  onClick={() => (window.location.href = "https://seller.sadashrijewelkart.com")}
                >
                  Become a Seller
                </Typography>
              </ListItem>
            </div>
          </div>
        </Drawer>
      </div>
      {/* MobileUI */}
      <div className="mobile">
        <Dialog
          open={openAuthDialog}
          onClose={() => setOpenAuthDialog(false)}
          PaperProps={{
            style: {
              width: "80vw",
              maxWidth: "300px",
              padding: "20px",
              borderRadius: "8px",
            },
          }}
        >
          <div>
            {localStorage.getItem("token") ? (
              <>
                <div
                  component={Link}
                  to="/my-account"
                  onClick={() => {
                    setOpenAuthDialog(false);
                    navigate("/my-account");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  <AccountCircleIcon
                    style={{ color: "#a36e29", marginRight: "10px" }}
                  />
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    My Account
                  </Typography>
                </div>
                <div
                  onClick={() => {
                    localStorage.removeItem("token");
                    setOpenAuthDialog(false);
                    navigate("/");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  <Logout style={{ color: "#a36e29", marginRight: "10px" }} />
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.9rem",
                    }}
                  >
                    Logout
                  </Typography>
                </div>
              </>
            ) : (
              <>
                <div
                  component={Link}
                  to="/login"
                  onClick={() => {
                    setOpenAuthDialog(false);
                    navigate("/signin");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  <Login style={{ color: "#a36e29", marginRight: "10px" }} />
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.9rem",
                    }}
                  >
                    Login
                  </Typography>
                </div>
                <div
                  component={Link}
                  to="/signup"
                  onClick={() => {
                    setOpenAuthDialog(false);
                    navigate("/signup");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  <HowToReg style={{ color: "#a36e29", marginRight: "10px" }} />
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.9rem",
                    }}
                  >
                    Register
                  </Typography>
                </div>
              </>
            )}
          </div>
        </Dialog>
        <Drawer
          className="drawer"
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          PaperProps={{
            sx: {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <List style={{ flexGrow: 1 }}>
            <ListItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #e0e0e0",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                Welcome, User
              </div>
              <IconButton onClick={() => setOpenDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </ListItem>

            {menuItems.map((category) => (
              <React.Fragment key={category.id}>
                <ListItem button onClick={() => handleMenuItemClick(category)}>
                  <ListItemAvatar>
                    <Avatar
                      alt={category.name}
                      src={`${process.env.PUBLIC_URL}/assets/gif.gif`}
                    />
                  </ListItemAvatar>
                  <div
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      flexGrow: 1,
                    }}
                  >
                    {category.name}
                  </div>
                  {category.sub_categories?.length > 0 && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategory(
                          expandedCategory === category.id ? null : category.id
                        );
                      }}
                    >
                      <ExpandMore
                        style={{
                          transform:
                            expandedCategory === category.id
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          transition: "0.3s",
                        }}
                      />
                    </IconButton>
                  )}
                </ListItem>
                {category.sub_categories?.length > 0 && (
                  <Collapse in={expandedCategory === category.id}>
                    <List style={{ paddingLeft: "32px" }}>
                      {category.sub_categories.map((subCategory) => (
                        <ListItem
                          button
                          key={subCategory.id}
                          onClick={() => handleSubMenuItemClick(category.name, subCategory)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={subCategory.name}
                              src={`${process.env.PUBLIC_URL}/assets/gif.gif`}
                            />
                          </ListItemAvatar>
                          <div
                            style={{
                              fontFamily: '"Roboto", sans-serif',
                              fontSize: "0.8rem",
                            }}
                          >
                            {subCategory.name}
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
          <Typography
            style={{
              fontWeight: "bold",
              color: "#a36e29",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1.2rem",
              cursor: "pointer",
              textAlign: "center",
              paddingBottom: "16px",
            }}
            onClick={() => (window.location.href = "https://seller.sadashrijewelkart.com")}
          >
            Become a Seller
          </Typography>
        </Drawer>
        <AppBar elevation={0} position="fixed" className="appbar">
          <div className="rates">
            <Marquee velocity={20} direction="ltr" scatterRandomly={false}>
              {rates.map((rate, index) => (
                <div
                  style={{
                    marginRight: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "2rem",
                    fontSize: "0.8rem",
                  }}
                  key={index}
                >
                  {rate === rates[0] ? `${rate}` : `${rate[0]}: ₹ ${rate[1]}`}
                </div>
              ))}
            </Marquee>
          </div>
          <div variant="dense" className="toolbar">
            <IconButton>
              <MenuOutlined
                style={{ color: "#a36e29", margin: "0px" }}
                onClick={() => setOpenDrawer(true)}
              />
            </IconButton>
            <img
              alt="logo"
              className="logo"
              src={process.env.PUBLIC_URL + "/assets/logo_dark.png"}
              onClick={() => navigate("/")}
            />
            <div className="search">
              <div
                className="search-icon"
                style={{ backgroundColor: "white", borderRadius: "4px" }}
              >
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: "plain", color: "neutral" } }}
                    sx={{ borderRadius: 40 }}
                    onClick={() => setOpenAuthDialog(true)}
                  >
                    <AccountCircleOutlined style={{ color: "#a36e29" }} />
                  </MenuButton>
                </Dropdown>

                <IconButton color="inherit" component={Link} to="/wishlist">
                  <Badge
                    badgeContent={wishListItems}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#a36e29",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "0.8rem",
                      },
                    }}
                  >
                    <FavoriteBorderOutlined />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/cart">
                  <Badge
                    badgeContent={cartLength}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#a36e29",
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "0.8rem",
                      },
                    }}
                  >
                    <ShoppingCartOutlined />
                  </Badge>
                </IconButton>
              </div>
            </div>
          </div>
          <div style={{ padding: "8px 16px", backgroundColor: "white" }}>
            <div
              style={{
                width: "95%",
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "8px",
                marginTop: "-15px",
              }}
              onClick={() =>
                navigate("/search-result", { state: { searchIndex } })
              }
            >
              <SearchIcon style={{ color: "#a36e29", marginRight: "8px" }} />
              <InputBase
                placeholder="Search for Jewellery..."
                style={{
                  width: "100%",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                }}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFuzzySearch(e);
                  }
                }}
              />
            </div>
          </div>
        </AppBar>
      </div>
    </div>
  );
};

export default Navbar;
