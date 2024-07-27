import React, { useEffect, useState } from "react";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Badge from "@mui/joy/Badge";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Grid,
  Drawer,
  Avatar,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
// import { Menu as MenuIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import axios from "axios";
import "./navbar.styles.scss";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const matches = useMediaQuery("(min-width:600px)");
  const [menuItems, setMenuItems] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  let categoryName;
  let navigate = useNavigate();
  const { category } = useParams();
  const [wishListItems, setWishListItems] = useState(0);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // if (!sessionStorage.getItem("cart")) {
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/products/cart.php", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response?.data);
        console.log(response?.data?.response?.length);
        sessionStorage.setItem("cart", response?.data?.response?.length || 0);
      })
      .catch((error) => console.log("Error while fetching cart items", error));
    // }
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
      .then((response) => setMenuItems(response.data.response.categories))
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (localStorage.getItem("user_id")) {
  //       const token = localStorage.getItem("token");

  //       if (!token) return;

  //       //creating default wishlist

  //       const formData = new FormData();
  //       formData.append("type", "create");
  //       formData.append("user_id", localStorage.getItem("user_id"));
  //       formData.append(
  //         "wishlist_name",
  //         `${localStorage.getItem("user_id")}_default`
  //       );
  //       formData.append("wishlist_items", "[]");

  //       try {
  //         await axios.post(
  //           `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php`,
  //           formData,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("token")}`,
  //               "Content-Type": "multipart/form-data",
  //             },
  //           }
  //         );
  //       } catch (err) {
  //         console.log(err.message);
  //       }
  //       //////////////////////////////////////////////////////
  //       const { data: defaultWishlists } = await axios.get(
  //         `https://api.sadashrijewelkart.com/v1.0.0/user/products/wishlist.php?type=wishlist&user_id=${localStorage.getItem(
  //           "user_id"
  //         )}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("token")}`,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       localStorage.setItem(
  //         "default_wishlist",
  //         defaultWishlists?.response[0]?.id
  //       );
  //     }
  //   })();
  // }, []);

  const handleFuzzySearch = (event) => {
    if (event.key === "Enter") {
      console.log(searchTerm);
      if (searchTerm.length === 0) return;
      navigate(`/jwellery/search?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleMenuItemClick = (menuItem) => {
    setOpenDrawer(false);

    const isSubCategory =
      menuItem.sub_categories && menuItem.sub_categories.length > 0;

    navigate(`/jwellery/${menuItem.name}`, {
      state: {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        isSubCategory: !isSubCategory,
      },
    });
  };

  const handleSubMenuItemClick = (category, menuItem) => {
    setOpenDrawer(false);

    const isSubCategory =
      menuItem.sub_categories && menuItem.sub_categories.length > 0;

    navigate(`/jwellery/${category + "+" + menuItem.name}`, {
      state: {
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        isSubCategory: !isSubCategory,
      },
    });
  };

  return (
    <div
      className="navbar"
      style={{
        height: "max-content",
        marginBottom: matches ? "100px" : "0px",
      }}
    >
      <div className="web">
        <AppBar elevation={2} className="appbar">
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
                                    // component={Link}
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
                placeholder="Search…"
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
                  <AccountCircleIcon style={{ color: "#a36e29" }} />
                </MenuButton>
                <Menu
                  style={{
                    width: "15vw",
                    height: "10%",
                    marginTop: "200px",
                    paddingTop: "100px  ",
                  }}
                >
                  {localStorage.getItem("token") ? (
                    <MenuItem component={Link} to="/my-account">
                      <AccountCircleIcon style={{ color: "#a36e29" }} />
                      <Typography>My Account</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem component={Link} to="/signup">
                      <HowToRegRoundedIcon style={{ color: "#a36e29" }} />
                      <Typography>Register</Typography>
                    </MenuItem>
                  )}
                  {localStorage.getItem("token") ? (
                    <MenuItem onClick={handleLogout}>
                      <ExitToAppRoundedIcon style={{ color: "#a36e29" }} />
                      <Typography>Logout</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem component={Link} to="/signin">
                      <LoginRoundedIcon style={{ color: "#a36e29" }} />
                      <Typography>SignIn</Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Dropdown>

              <IconButton color="inherit" component={Link} to="/wishlist">
                <Badge
                  badgeContent={wishListItems}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#a36e29" } }}
                >
                  <FavoriteIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge
                  badgeContent={sessionStorage.getItem("cart")}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#a36e29" } }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <div className="mobile">
        <Drawer
          className="drawer"
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemText primary="Welcome, User" />
              <IconButton onClick={() => setOpenDrawer(false)}>
                <CloseIcon />
              </IconButton>
            </ListItem>
            {menuItems.map((category) => (
              <ListItem
                key={category.id}
                button
                onClick={() => handleMenuItemClick(category)}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={category.name}
                    src={process.env.PUBLIC_URL + "/assets/logoNew.png"}
                  />
                </ListItemAvatar>
                <ListItemText primary={category.name} />
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
            />
            <div className="search">
              <div className="search-icon">
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: "plain", color: "neutral" } }}
                    sx={{ borderRadius: 40 }}
                  >
                    <AccountCircleIcon style={{ color: "#a36e29" }} />
                  </MenuButton>
                  <Menu
                    style={{
                      width: "15vw",
                      height: "10%",
                      marginTop: "200px",
                      paddingTop: "100px  ",
                    }}
                  >
                    {localStorage.getItem("token") ? (
                      <MenuItem component={Link} to="/my-account">
                        <AccountCircleIcon style={{ color: "#a36e29" }} />
                        <Typography>My Account</Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem component={Link} to="/signup">
                        <HowToRegRoundedIcon style={{ color: "#a36e29" }} />
                        <Typography>Register</Typography>
                      </MenuItem>
                    )}
                    {localStorage.getItem("token") ? (
                      <MenuItem onClick={handleLogout}>
                        <ExitToAppRoundedIcon style={{ color: "#a36e29" }} />
                        <Typography>Logout</Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem component={Link} to="/signin">
                        <LoginRoundedIcon style={{ color: "#a36e29" }} />
                        <Typography>SignIn</Typography>
                      </MenuItem>
                    )}
                  </Menu>
                </Dropdown>

                <IconButton color="inherit" component={Link} to="/wishlist">
                  <Badge
                    badgeContent={4}
                    sx={{ "& .MuiBadge-badge": { backgroundColor: "#a36e29" } }}
                  >
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" component={Link} to="/cart">
                  <Badge
                    badgeContent={sessionStorage.getItem("cart") || 0}
                    sx={{ "& .MuiBadge-badge": { backgroundColor: "#a36e29" } }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton>
                  <MenuIcon
                    style={{ fontSize: "2rem", color: "#a36e29" }}
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
