import { Typography, Box, Button } from "@mui/material";
import Rating from "@mui/material/Rating";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
const CustomerLikePills = () => {
  return (
    <Box>
      <Box
        style={{
          width: "100%",
          height: "max-content",
          display: "flex",
          flexDirection: "column",
          maxWidth: "500px",
        }}
      >
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <ThumbUpIcon style={{ fontSize: "1.5rem", color: "" }} />
          <Typography variant="subtitle" style={{ fontWeight: "bold" }}>
            What Customers Liked
          </Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            marginTop: "2%",
            height: "max-content",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {[
            "Design(14)",
            "Size/fit (11)",
            "Others (5)",
            "Quality (15)",
            "Delivery (12)",
            "Packaging (12)",
            "Customer service (13)",
            "Overall experience (12)",
          ].map((item) => (
            <Box
              style={{
                width: "max-content",
                padding: "10px",
                margin: "10px",
                border: "2px solid #c0c0c0",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <Typography>{item}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerLikePills;
