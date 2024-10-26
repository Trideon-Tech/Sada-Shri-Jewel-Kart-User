import {
  AccountCircleOutlined,
  ExpandLess,
  ExpandMore,
  FavoriteBorderOutlined,
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
import {
  AppBar,
  Avatar,
  Collapse,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
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
  let navigate = useNavigate();
  const [wishListItems, setWishListItems] = useState(0);
  const [cartLength, setCartLength] = useState(0);
  const [rates, setRates] = useState([
    ["Today's Gold and Silver Rates", ""],
    ["Gold 22KT (per 10 gm)", ""],
    ["Gold 18KT (per 10 gm)", ""],
    ["Gold 14KT (per 10 gm)", ""],
    ["Silver (per 10 gm)", ""],
  ]);
  const [expandedCategory, setExpandedCategory] = useState(null);

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

        let tempRates = rates;

        tempRates[1][1] = response?.data?.response?.jewellery_inventory?.gold22;
        tempRates[2][1] = response?.data?.response?.jewellery_inventory?.gold18;
        tempRates[3][1] = response?.data?.response?.jewellery_inventory?.gold14;
        tempRates[4][1] = response?.data?.response?.jewellery_inventory?.silver;

        setRates(() => tempRates);
      })
      .catch((error) => console.error("Error fetching menu items:", error));

    const token = localStorage.getItem("token");
    if (!token) return;
    // if (!sessionStorage.getItem("cart")) {
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
    // }
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
      .then((response) => {
        console.log("landing page:: ", response);
        setMenuItems(response.data.response.categories);
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  }, [refresh]);

  const handleFuzzySearch = (event) => {
    if (event.key === "Enter") {
      console.log(searchTerm);
      if (searchTerm.length === 0) return;
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
      `/jwellery/${category + "+" + menuItem.name}/${
        menuItem.id
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
              {[...rates, ...rates].map((rate, index) => (
                <div
                  style={{
                    marginRight: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "2.5rem",
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
            <div className="search">
              <div className="search-icon">
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search for Jwellery..."
                classes={{
                  root: "input-root",
                  input: "input-input",
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => handleFuzzySearch(event)}
              />
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
                          fontFamily: '"Open Sans", sans-serif',
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
                          fontFamily: '"Open Sans", sans-serif',
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
                          fontFamily: '"Open Sans", sans-serif',
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
                          fontFamily: '"Open Sans", sans-serif',
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
                    fontFamily: '"Open Sans", sans-serif',
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
                          src={process.env.PUBLIC_URL + "/assets/logoNew.png"}
                        />
                      </ListItemAvatar>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
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
                                  src={
                                    subCategory.image_url ||
                                    process.env.PUBLIC_URL +
                                      "/assets/logoNew.png"
                                  }
                                />
                              </ListItemAvatar>
                              <div
                                style={{
                                  fontFamily: '"Open Sans", sans-serif',
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
                button
                onClick={() =>
                  window.open("https://seller.sadashrijewelkart.com", "_blank")
                }
              >
                <div
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                    color: "#a36e29",
                    textDecoration: "underline",
                    fontWeight: "600",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Become a Seller
                </div>
              </ListItem>
            </div>
          </div>
        </Drawer>
      </div>
      {/* MobileUI */}
      <div className="mobile">
        <Drawer
          className="drawer"
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
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
                  fontFamily: '"Open Sans", sans-serif',
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
              <ListItem
                key={category.id}
                onClick={() => handleMenuItemClick(category)}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={category.name}
                    src={process.env.PUBLIC_URL + "/assets/logoNew.png"}
                  />
                </ListItemAvatar>
                <div
                  style={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "0.8rem",
                  }}
                >
                  {category.name}
                </div>
              </ListItem>
            ))}
          </List>

          <div
            style={{
              marginTop: "auto",
              marginBottom: "20px",
              marginLeft: "20px",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
              color: "#a36e29",
              textDecoration: "underline",
              fontWeight: "600",
            }}
            onClick={() =>
              window.open("https://seller.sadashrijewelkart.com", "_blank")
            }
          >
            Become a Seller
          </div>
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
              <div className="search-icon">
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
                      height: "max-content",
                    }}
                  >
                    {localStorage.getItem("token") ? (
                      <MenuItem component={Link} to="/my-account">
                        <AccountCircleOutlined style={{ color: "#a36e29" }} />
                        <Typography
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
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
                            fontFamily: '"Open Sans", sans-serif',
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
                            fontFamily: '"Open Sans", sans-serif',
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
                            fontFamily: '"Open Sans", sans-serif',
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
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#a36e29",
                        fontFamily: '"Open Sans", sans-serif',
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
                        fontFamily: '"Open Sans", sans-serif',
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
        </AppBar>
      </div>
    </div>
  );
};

export default Navbar;
