import { Typography, Box, Button } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";
import Rating from "@mui/material/Rating";
const OverAllRating = ({ openModal }) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box>
      <Box
        style={{
          width: "100%",
          height: "max-content",
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
          <Rating name="size-large" value={4} size="large" readOnly />
          <Typography style={{ fontSize: "1.4rem" }}>4.5/5</Typography>
        </Box>
        <Typography variant="subtitle">
          Based on 34 Ratings & Reviews
        </Typography>
        <Typography
          variant="subtitle"
          style={{ textAlign: "justify", marginTop: "10%", marginBottom: "5%" }}
        >
          Receive ₹200 worth xCLusive Points by writing a review and uploading a
          picture of your jewellery
        </Typography>
        <Button
          variant="contained"
          fullWidth
          style={{
            background:
              "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
          }}
          onClick={() => openModal(true)}
        >
          Write a Review
        </Button>
      </Box>
    </Box>
  );
};

export default OverAllRating;
