import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import "./navbar.styles.scss";

const Navbar = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  let categoryName;
  let navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    axios
      .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
      .then((response) => setMenuItems(response.data.response.categories))
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

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
    <div className="navbar">
      <div className="web">
        <AppBar elevation={0} position="static" className="appbar">
          <Toolbar variant="dense" className="toolbar">
            <img
              alt="logo"
              className="logo"
              src={process.env.PUBLIC_URL + "/assets/fav.png"}
            />
            <div className="menu-items">
              {menuItems.map((category) => (
                <div key={category.id} className="menu-item">
                  <Button
                    // component={Link}
                    // to={`/jwellery/${category.name}`}
                    className="menu-item-btn"
                    style={{
                      color: "#fff",
                      fontWeight: "400",
                      fontSize: "14px",
                      height: "100%",
                    }}
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
              />
            </div>
            <div className="icons">
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/wishlist">
                <FavoriteIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCartIcon />
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
              src={process.env.PUBLIC_URL + "/assets/fav.png"}
            />
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
              />
            </div>
            <Menu className="menu-icon" onClick={() => setOpenDrawer(true)} />
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
};

export default Navbar;
