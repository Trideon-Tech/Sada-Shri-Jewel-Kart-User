import { PlayCircle } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import "./carousal.styles.scss";
import Skeleton from "@mui/material/Skeleton";

const ImageVideoCarousel = ({ images, video }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToPrev = () => {
    const maxIndex = video !== null ? images.length : images.length - 1;
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
  };

  const goToNext = () => {
    const maxIndex = video !== null ? images.length : images.length - 1;
    setSelectedIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
  };

  const selectItem = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="carousel-container">
      <IconButton className="prev" onClick={goToPrev} aria-label="previous">
        <ArrowBackIosIcon />
      </IconButton>
      <div className="selected-item">
        {selectedIndex === images.length && video !== null ? (
          <video controls>
            <source src={video} type="video/mp4" />
          </video>
        ) : images.length > 0 ? (
          <img src={images[selectedIndex]} alt={`Item ${selectedIndex}`} />
        ) : (
          <Skeleton
            sx={{ bgcolor: "grey.900" }}
            variant="rectangular"
            height={800}
            width={650}
          />
        )}
      </div>
      <IconButton className="next" onClick={goToNext} aria-label="next">
        <ArrowForwardIosIcon />
      </IconButton>
      <div className="item-thumbnails">
        {images.map((image, index) =>
          images.length > 0 ? (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              onClick={() => selectItem(index)}
              onLoad={() => {
                setImageLoaded(true);
                console.log("loaded");
              }}
              className={selectedIndex === index ? "selected" : ""}
            />
          ) : (
            <Skeleton
              sx={{ bgcolor: "grey.900" }}
              variant="rectangular"
              width={210}
              height={118}
            />
          )
        )}
        {video !== null && (
          <div
            className={`thumbnail ${
              selectedIndex === images.length ? "selected" : ""
            }`}
            onClick={() => selectItem(images.length)}
          >
            <PlayCircle sx={{ color: "#a36e29" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageVideoCarousel;
