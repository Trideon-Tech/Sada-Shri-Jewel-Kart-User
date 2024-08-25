import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import CarouselPanel from "../../components/carousel/carousel.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import PromotionImageList from "../../components/promotionImageList/promotions.component";
import "./landingpage.styles.scss";
const LandingPage = () => {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <div
      className="landing-page"
      style={{
        backgroundColor: "#ececec",
        height: "max-content",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      {/* <Divider /> */}
      <CarouselPanel />
      <PromotionImageList />
      <Footer />
    </div>
  );
};

export default LandingPage;
