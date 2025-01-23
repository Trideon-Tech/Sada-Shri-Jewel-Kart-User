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
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              marginTop: "2%",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "gray",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              alt="Gemy Sharp"
            >
              {review?.name.substring(0, 1)}
            </Avatar>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginLeft: "1%",
              }}
            >
              <Typography
                style={{
                  fontWeight: "bold",
                  color: "#000000",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "1rem",
                }}
              >
                {review?.name}
              </Typography>
              <Typography
                style={{
                  color: "#a0a0a0",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                {review?.created_at}
              </Typography>
            </Box>
          </Box>
          <Rating
            readOnly
            value={Number(review?.rating)}
            style={{ marginTop: "1%" }}
          />
          <Typography
            style={{
              textAlign: "left",
              color: "#000000",
              marginTop: "1%",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {review?.title}
          </Typography>
          <Typography
            style={{
              textAlign: "left",
              color: "#606060",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            {review?.content}
          </Typography>
          <Box
            style={{
              width: "max-content",
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
                src={`${process.env.REACT_APP_API_URL}/assets/${image}`}
                style={{ height: "20vh", width: "auto", marginRight: "10px" }}
              />
            ))}
          </Box>
          <Divider style={{ width: "100%" }} />
        </Box>
      ))}
      <Pagination
        style={{
          marginTop: "2%",
          marginBottom: "2%",
          fontFamily: '"Roboto", sans-serif',
          fontSize: "0.8rem",
        }}
        count={totalPages}
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
};
export default ReviewList;
