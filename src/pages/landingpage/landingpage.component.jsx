import React from "react";
import "./landingpage.styles.scss";
import Navbar from "../../components/navbar/navbar.component";
import { Divider } from "@mui/material";
import PromotionImageList from "../../components/promotionImageList/promotions.component";
import CarouselPanel from "../../components/carousel/carousel.component";
import useMediaQuery from "@mui/material/useMediaQuery";
const LandingPage = () => {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <div
      className="landing-page"
      style={{ backgroundColor: "#ececec", height: "max-content" }}
    >
      <Navbar />
      {/* <Divider /> */}
      <CarouselPanel />
      <PromotionImageList />
    </div>
  );
};

export default LandingPage;
