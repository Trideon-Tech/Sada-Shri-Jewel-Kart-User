import { Close, PlayCircle } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import React, { useRef, useState } from "react";
import "./carousal.styles.scss";

const ImageVideoCarousel = ({ images, video }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const containerRef = useRef(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrev();
    }
  };

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
    <>
      <div
        className="carousel-container"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <IconButton className="prev" onClick={goToPrev} aria-label="previous">
          <ArrowBackIosIcon />
        </IconButton>
        <div className="selected-item" onClick={() => setDialogOpen(true)}>
          {selectedIndex === images.length && video !== null ? (
            <video controls autoPlay>
              <source src={video} type="video/mp4" />
            </video>
          ) : images.length > 0 ? (
            <img
              src={images[selectedIndex]}
              alt={`Product Image ${selectedIndex}`}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
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

      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        sx={{ background: "white" }}
      >
        <DialogContent sx={{ padding: 0, background: "white" }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDialogOpen(false)}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey",
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {selectedIndex === images.length && video !== null ? (
                <video
                  controls
                  autoPlay
                  style={{ width: "100%", height: "calc(100vh - 120px)" }}
                >
                  <source src={video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={images[selectedIndex]}
                  alt={`Product Image ${selectedIndex}`}
                  style={{
                    width: "100%",
                    height: "calc(100vh - 120px)",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <div
              style={{
                height: "120px",
                backgroundColor: "#fff",
                display: "flex",
                overflowX: "auto",
                padding: "10px",
                gap: "10px",
                whiteSpace: "nowrap",
                scrollbarWidth: "thin",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  onClick={() => selectItem(index)}
                  style={{
                    height: "100px",
                    width: "100px",
                    minWidth: "100px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      selectedIndex === index ? "2px solid #a36e29" : "none",
                    borderRadius: "4px",
                    flexShrink: 0,
                  }}
                />
              ))}
              {video !== null && (
                <div
                  onClick={() => selectItem(images.length)}
                  style={{
                    height: "100px",
                    width: "100px",
                    minWidth: "100px",
                    position: "relative",
                    cursor: "pointer",
                    border:
                      selectedIndex === images.length
                        ? "2px solid #a36e29"
                        : "1px solid #ddd",
                    borderRadius: "4px",
                    flexShrink: 0,
                  }}
                >
                  <video
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                  <PlayCircle
                    sx={{
                      color: "#a36e29",
                      fontSize: "40px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageVideoCarousel;
