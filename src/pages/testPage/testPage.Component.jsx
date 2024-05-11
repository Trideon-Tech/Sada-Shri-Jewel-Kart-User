import React from "react";
import Typography from "@mui/material/Typography";
import Navbar from "../../components/navbar/navbar.component";
import { Grid, Box, Divider, Breadcrumbs } from "@mui/material";
import JwelleryCard from "../../components/card/jwellerycard.component";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TestPage = () => {
  const navigate = useNavigate();
  const mediaQuery = useMediaQuery("(min-width:600px)");
  const handleCardClick = (productName, hash, menuItemName) => {
    console.log(hash);
    console.log(`/item/${menuItemName}/${productName}-${hash}`);
    navigate(`/item/${menuItemName}/${productName}-${hash}`);
  };
  return (
    <div>
      <Navbar />
      <Box
        style={{
          width: "100vw",

          height: "max-content",
        }}
      >
        <img
          src={process.env.PUBLIC_URL + "/assets/productList bg.jpg"}
          style={{ width: "100%" }}
        />
      </Box>
      <div
        style={{
          width: "100%",
          height: mediaQuery ? "20vh" : "10vh",
          backgroundColor: "#ececec",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", marginLeft: "100px" }}
        >
          Your Wishlist
        </Typography>
        <div
          className="breadcrumbs-container"
          style={{ marginLeft: mediaQuery ? "100px" : "10px" }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>

            <Typography className="breadcrumb-link" color="textPrimary">
              Your Wishlist
            </Typography>
          </Breadcrumbs>
        </div>
      </div>
      <Box
        style={{
          width: "100%",
          paddingTop: "1%",
          paddingBottom: "5%",
          height: "max-content",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box style={{ width: "100%" }}>
          <Grid container spacing={6}>
            {mockData.map((item) => (
              <Grid item xs={mediaQuery ? 2 : 6}>
                <JwelleryCard
                  key={item.id}
                  image={item.images[0].file}
                  name={item.name}
                  price={item.price}
                  onClick={() =>
                    handleCardClick(item.name, item.hash, item.category)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default TestPage;
