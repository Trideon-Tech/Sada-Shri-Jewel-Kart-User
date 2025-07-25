import { Box, Button, Typography, useMediaQuery } from "@mui/material";

import Rating from "@mui/material/Rating";

const OverAllRating = ({ openModal, rating, reviewsCount, enableWrite }) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        maxWidth: matches ? "300px" : "",
      }}
    >
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Rating name="size-large" value={rating} size="medium" readOnly />
        <Typography
          style={{
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1rem",
          }}
        >
          {rating?.toFixed(2)} / 5
        </Typography>
      </Box>
      <Typography
        style={{
          fontFamily: '"Roboto", sans-serif',
          fontSize: "0.8rem",
          marginTop: "10px",
        }}
      >
        Based on {reviewsCount} Ratings & Reviews
      </Typography>
      {enableWrite ? (
        <Button
          variant="contained"
          fullWidth
          style={{
            background: "linear-gradient(to right, #d4a76a, #a36e29)",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1rem",
            marginTop: "10px",
            marginBottom: "10px",
            display: "none",
          }}
          onClick={() => openModal(true)}
        >
          Write a Review
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          disabled
          style={{
            background: "#cccccc",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "0.8rem",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          Currently Unavailable
        </Button>
      )}
    </Box>
  );
};

export default OverAllRating;
