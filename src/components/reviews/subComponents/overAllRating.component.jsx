import { Box, Button, Typography } from "@mui/material";

import Rating from "@mui/material/Rating";
const OverAllRating = ({ openModal, rating, reviewsCount }) => {
  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        maxWidth: "300px",
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
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
          }}
        >
          {rating?.toFixed(2)} / 5
        </Typography>
      </Box>
      <Typography
        style={{
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "0.8rem",
          marginTop: "10px",
        }}
      >
        Based on {reviewsCount} Ratings & Reviews
      </Typography>
      <Button
        variant="contained"
        fullWidth
        style={{
          background:
            "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "0.8rem",
          marginTop: "10px",
        }}
        onClick={() => openModal(true)}
      >
        Write a Review
      </Button>
    </Box>
  );
};

export default OverAllRating;
