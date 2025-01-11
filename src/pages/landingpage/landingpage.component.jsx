import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useEffect } from "react";
import axios from "axios";
import CarouselPanel from "../../components/carousel/carousel.component";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";
import PromotionImageList from "../../components/promotionImageList/promotions.component";
import "./landingpage.styles.scss";
const LandingPage = () => {
  const matches = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = async () => {
    if ("geolocation" in navigator) {
      await navigator.geolocation.getCurrentPosition(async function (
        position
      ) {

        let locationResponse = await axios.get(
          `https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&api_key=66d34ff0b8bdb852964430lcwc30d15`
        );

        console.log(locationResponse.data.address.postcode);
        localStorage.setItem("default_pincode", locationResponse.data.address.postcode);
      });
    }
  };
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
