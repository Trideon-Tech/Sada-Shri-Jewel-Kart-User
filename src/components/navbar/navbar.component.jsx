import {
  AccountCircleOutlined,
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
  Button,
  Drawer,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  Toolbar,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRefresh } from "../../RefreshContent";
import "./navbar.styles.scss";

const Navbar = () => {
  const { refresh } = useRefresh();
  const matches = useMediaQuery("(min-width:600px)");
  const [menuItems, setMenuItems] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  let categoryName;
  let navigate = useNavigate();
  const { category } = useParams();
  const [wishListItems, setWishListItems] = useState(0);
  const [cartLength, setCartLength] = useState(0);

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

  const sendCartToAPI = (items) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    items.forEach((item) => {
      axios
        .put(
          "https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: {
              product: item,
              customization: -1,
            },
          }
        )
        .then(() => {
          console.log(`Product with ID ${item} sent to API`);
        })
        .catch((error) => {
          console.error(`Error sending product with ID ${item} to API`, error);
        });
    });

    localStorage.removeItem("cart_list");
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

      console.log("calling from navbar");
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
        console.log("landing page:: ", response);
        setMenuItems(response?.data?.response?.categories);
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

    const isSubCategory =
      menuItem.sub_categories && menuItem.sub_categories.length > 0;

    navigate(`/jwellery/${menuItem.name}/${menuItem.id}/${!isSubCategory}`);
  };

  const handleSubMenuItemClick = (category, menuItem) => {
    setOpenDrawer(false);

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
          <Toolbar variant="dense" className="toolbar">
            <img
              alt="logo"
              className="logo"
              src={process.env.PUBLIC_URL + "/assets/logoNew.png"}
              onClick={() => navigate(`/`)}
            />
            <div className="menu-items">
              {menuItems.map((category) => (
                <div key={category.id} className="menu-item">
                  <Button
                    className="menu-item-btn"
                    onClick={() => handleMenuItemClick(category)}
                  >
                    {category.name}
                  </Button>

                  {category.sub_categories && (
                    <div className="sub-categories">
                      <Grid container spacing={0}>
                        <Grid item xs={6}>
                          <div className="sub-category-column">
                            {category.sub_categories
                              .slice(
                                0,
                                Math.ceil(category.sub_categories.length / 2)
                              )
                              .map((subCategory) => (
                                <div style={{ display: "flex" }}>
                                  <img
                                    alt="logo"
                                    className="logo"
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/assets/logoNew.png"
                                    }
                                  />
                                  <Button
                                    key={subCategory.id}
                                    //component={Link}
                                    // to={`/jwellery/${
                                    //   category.name + "+" + subCategory.name
                                    // }`}
                                    className="sub-category"
                                    onClick={() =>
                                      handleSubMenuItemClick(
                                        category.name,
                                        subCategory
                                      )
                                    }
                                  >
                                    {subCategory.name}
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className="sub-category-column">
                            {category.sub_categories
                              .slice(
                                Math.ceil(category.sub_categories.length / 2)
                              )
                              .map((subCategory) => (
                                <div style={{ display: "flex" }}>
                                  <img
                                    alt="logo"
                                    className="logo"
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/assets/logoNew.png"
                                    }
                                  />
                                  <Button
                                    key={subCategory.id}
                                    className="sub-category"
                                    onClick={() =>
                                      handleSubMenuItemClick(
                                        category.name,
                                        subCategory
                                      )
                                    }
                                  >
                                    {subCategory.name}
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
          </Toolbar>
        </AppBar>
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
        </Drawer>

        <AppBar elevation={0} position="static" className="appbar">
          <Toolbar variant="dense" className="toolbar">
            <img
              alt="logo"
              className="logo"
              src={process.env.PUBLIC_URL + "/assets/logoNew.png"}
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
                <IconButton>
                  <MenuOutlined
                    style={{ color: "#a36e29" }}
                    onClick={() => setOpenDrawer(true)}
                  />
                </IconButton>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
};

export default Navbar;
