import React, { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./carousal.styles.scss";
import { PlayCircle } from "@mui/icons-material";

const ImageVideoCarousel = ({ images, video }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const goToPrev = () => {
    const maxIndex = video ? images.length : images.length - 1;
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
  };

  const goToNext = () => {
    const maxIndex = video ? images.length : images.length - 1;
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
        {selectedIndex === images.length && video ? (
          <video controls>
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <img src={images[selectedIndex]} alt={`Item ${selectedIndex}`} />
        )}
      </div>
      <IconButton className="next" onClick={goToNext} aria-label="next">
        <ArrowForwardIosIcon />
      </IconButton>
      <div className="item-thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => selectItem(index)}
            className={selectedIndex === index ? "selected" : ""}
          />
        ))}
        {video && (
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
