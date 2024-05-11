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
                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=248&fit=crop&auto=format`}
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
    img: "https://source.unsplash.com/random/?jewellery&sig=1",
    title: "Bed",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=2",
    title: "Books",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=3",
    title: "Sink",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=4",
    title: "Kitchen",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=5",
    title: "Blinds",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=6",
    title: "Chairs",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=7",
    title: "Laptop",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=8",
    title: "Doors",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=9",
    title: "Coffee",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=10",
    title: "Storage",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=11",
    title: "Candle",
  },
  {
    img: "https://source.unsplash.com/random/?jewellery&sig=12",
    title: "Coffee table",
  },
];
