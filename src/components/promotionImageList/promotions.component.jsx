import * as React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function PromotionImageList() {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <Box
      style={{
        width: "100%",
        height: "max-content",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "90%", height: "100%" }}>
        <ImageList variant="masonry" cols={matches ? 3 : 2} gap={8}>
          {itemData.map((item) => (
            <ImageListItem key={item.img}>
              <img
                srcSet={`${item.img}`}
                src={`${item.img}`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}

const itemData = [
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Bed",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Books",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Sink",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Kitchen",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Blinds",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Chairs",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Laptop",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Doors",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Coffee",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Storage",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Candle",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Coffee table",
  },
];
