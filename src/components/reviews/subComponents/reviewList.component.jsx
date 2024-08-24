import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Avatar,
  Box,
  Divider,
  Pagination,
  Rating,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const ReviewList = ({ reviewsData, totalPages }) => {
  const [parsedReview, setParsedreview] = useState([]);

  useEffect(() => {
    const mappedReview = reviewsData?.map((item) => {
      item.image_url = JSON.parse(item?.image_url);
      return item;
    });
    console.log("mappedReview", mappedReview);
    setParsedreview(mappedReview);
  }, [reviewsData]);

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      {parsedReview?.map((review) => (
        <Box
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
          }}
        >
          <Box
            style={{ display: "flex", alignItems: "center", marginTop: "2%" }}
          >
            <Avatar sx={{ bgcolor: "gray" }} alt="Gemy Sharp">
              {review?.name.substring(0, 1)}
            </Avatar>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginLeft: "2%",
              }}
            >
              <Typography
                style={{
                  fontWeight: "bold",
                  color: "#606060",
                  fontSize: "1rem",
                }}
              >
                {review?.name}
              </Typography>
              <Typography style={{ color: "#a0a0a0" }}>
                {review?.created_at}
              </Typography>
            </Box>
          </Box>
          <Rating
            name="size-large"
            readOnly
            value={Number(review?.rating)}
            style={{ marginTop: "1%" }}
          />{" "}
          <Typography
            style={{ textAlign: "left", color: "#606060", marginTop: "2%" }}
          >
            {review?.content}
          </Typography>
          <Box
            style={{
              width: "50vw",
              height: review?.image_url.length ? "30%" : 0,
              overflowY: "scroll",
              display: "flex",
              marginTop: "2%",
              marginBottom: "2%",
              backgroundColor: "#e6e6e6",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            {review?.image_url?.map((image) => (
              <img
                src={`https://api.sadashrijewelkart.com/assets/${image}`}
                style={{ height: "20vh", width: "auto", marginRight: "10px" }}
              />
            ))}
          </Box>
          <Divider style={{ width: "100%" }} />
        </Box>
      ))}
      <Pagination
        style={{ marginTop: "2%" }}
        count={totalPages}
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
};

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    cols: 2,
  },
];
export default ReviewList;
