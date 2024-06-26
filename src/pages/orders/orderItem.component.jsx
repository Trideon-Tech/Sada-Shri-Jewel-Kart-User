import { Box, Button, Card, Typography } from "@mui/material";

const OrderItem = ({ titleColorType = "arriving" }) => {
  const titleColors = {
    arriving: "#a36e29",
    delivered: "#33A329",
    cancelled: "#f7333f",
  };
  return (
    <Card
      style={{
        minWidth: "837px",
        minHeight: "331px",
        width: "95%",
        height: "10%",
        padding: "2.5%",
        borderRadius: "10px",
        marginBottom: "50px",
      }}
      elevation={2}
    >
      <Box
        style={{
          width: "100%",
          height: "max-content",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          style={{
            fontWeight: "bold",
            color: titleColors[titleColorType],
            fontSize: "1.4rem",
          }}
        >
          Arriving Tomorrow
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography style={{ color: "#7e7e7e" }}>
            Order ID: #12343255a23456
          </Typography>
          <Button
            style={{
              padding: 0,
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: "#a36e29",
              backgroundColor: "white",
            }}
          >
            Write us a Review
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "60%",
          marginTop: "2%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            border: "2px solid #e7e7e7",
            borderRadius: "10px",
            height: "100%",
            minWidth: "150px",
            aspectRatio: "1/1",
            overflow: "hidden",
          }}
        >
          <img
            src={``}
            // src="https://api.sadashrijewelkart.com/assets/company/NewJwellers/products/webp/Faria%20Diamond%20Band-1706799778.webp"
            style={{ height: "100%", width: "100%", objectFit: "contain" }}
          />
        </Box>
        <Box
          style={{
            height: "100%",
            width: "auto",
            padding: "10px",
            marginRight: "auto",
            marginLeft: "2.5%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            color="#505050"
            style={{
              textAlign: "left",
              fontWeight: "bold",
              fontSize: "1.6rem",
            }}
          >
            Faria Diamond Band
          </Typography>
          <Box
            style={{
              width: "100%",
              marginTop: "auto",
              height: "max-content",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                width: "max-content",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                style={{ color: "gray", fontSize: "1.2rem" }}
                gutterBottom
              >
                Size : 20in
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                marginLeft: "10%",
                marginRight: "auto",
                width: "max-content",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                style={{ color: "gray", fontSize: "1.2rem" }}
                gutterBottom
              >
                Quantity : 2
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="subtitle2"
            style={{
              marginTop: "2%",
              fontSize: "1.2rem",
              color: "gray",
            }}
            gutterBottom
          >
            Price:{" "}
            <span style={{ color: "black", fontWeight: "bold" }}>
              ₹ {parseFloat(41788).toLocaleString()}
            </span>{" "}
          </Typography>
          <Typography
            variant="subtitle2"
            style={{ marginTop: "2%", color: "gray", fontSize: "1.2rem" }}
            gutterBottom
          >
            Order Placed : 3rd September, 2024
          </Typography>
        </Box>
      </Box>
      <Box
        style={{
          width: "100%",
          height: "15%",
          display: "flex",
          marginTop: "2%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          style={{
            width: "32%",
            height: "100%",
            border: "2px solid #a36e29",
            color: "#a36e29",
            fontWeight: "bold",
          }}
        >
          Need Help?
        </Button>
        <Button
          fullWidth
          variant="outlined"
          style={{
            width: "32%",
            height: "100%",
            border: "2px solid #a36e29",
            fontWeight: "bold",
            color: "#a36e29",
          }}
        >
          {titleColorType === "arriving" ? "Cancel Order" : "Return Order"}
        </Button>
        <Button
          fullWidth
          variant="contained"
          style={{
            width: "32%",
            fontWeight: "bold",
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
          }}
        >
          Track Order
        </Button>
      </Box>
    </Card>
  );
};

export default OrderItem;
