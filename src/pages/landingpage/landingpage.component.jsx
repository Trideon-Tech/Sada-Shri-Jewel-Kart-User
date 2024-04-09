import React from "react";
import "./landingpage.styles.scss";
import Navbar from "../../components/navbar/navbar.component";
import { Divider } from "@mui/material";
import PromotionImageList from "../../components/promotionImageList/promotions.component";
import CarouselPanel from "../../components/carousel/carousel.component";
const LandingPage = () => {
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
