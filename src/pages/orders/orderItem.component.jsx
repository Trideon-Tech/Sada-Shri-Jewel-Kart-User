import { Box, Button, Card, Typography, useMediaQuery } from "@mui/material";

const OrderItem = ({
  titleColorType = "arriving",
  orderInfo,
  selectHandler,
  handleCancelOrder,
  writeReview,
}) => {
  const matches = useMediaQuery("(min-width:600px)");

  const titleColors = {
    arriving: "#a36e29",
    delivered: "#33A329",
    cancelled: "#f7333f",
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if the date is today, tomorrow, or yesterday
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Format for other dates
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `on ${dayOfMonth}${
      dayOfMonth === 1
        ? "st"
        : dayOfMonth === 2
        ? "nd"
        : dayOfMonth === 3
        ? "rd"
        : "th"
    } ${month} ${year}`;
  }

  return (
    <Card
      style={{
        minWidth: matches ? "837px" : "100%",
        width: "95%",
        height: matches ? "10%" : "max-content",
        padding: "2.5%",
        borderRadius: "10px",
        marginBottom: "50px",
      }}
      elevation={1}
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
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1.2rem",
            color: titleColors[titleColorType],
          }}
        >
          Arriving {formatDate(orderInfo["estimated_date"])}
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            style={{
              color: "#7e7e7e",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
            }}
          >
            Order ID: #{orderInfo?.public_id}
          </Typography>
          <div
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "0.8rem",
              fontWeight: "bold",
              color: "#a36e29",
              textAlign: "end",
              cursor: "pointer",
            }}
            onClick={writeReview}
          >
            Write us a Review
          </div>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "60%",
          marginTop: "1%",
          justifyContent: "space-between",
          flexDirection: matches ? "row" : "column",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          selectHandler(orderInfo.id);
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
            height={"150px"}
            src={`https://api.sadashrijewelkart.com/assets/${orderInfo?.images[0]?.file}`}
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
                marginRight: "auto",
                width: "max-content",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "gray",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "1rem",
                }}
                gutterBottom
              >
                Quantity : 1pcs
              </Typography>
            </Box>
          </Box>
          <Typography
            style={{
              marginTop: "2%",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
              color: "gray",
            }}
            gutterBottom
          >
            Price :{" "}
            <span style={{ color: "black", fontWeight: "bold" }}>
              ₹ {parseFloat(Number(orderInfo?.price)).toLocaleString()}
            </span>{" "}
          </Typography>
          <Typography
            style={{
              marginTop: "2%",
              color: "gray",
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "1rem",
            }}
          >
            {/* TODO - Chenge */}
            Order placed {formatDate(orderInfo["order_created_date"])}
          </Typography>
        </Box>
      </Box>
      <Box
        style={{
          width: "100%",
          height: "15%",
          display: "flex",
          marginTop: "3%",
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
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
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
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
          onClick={() => {
            if (titleColorType === "arriving") handleCancelOrder();
          }}
        >
          {titleColorType === "arriving" ? "Cancel " : "Return Order"}
        </Button>
        <Button
          fullWidth
          variant="contained"
          style={{
            width: "32%",
            fontWeight: "bold",
            height: "100%",
            background: "#a36e29",
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >
          Track Order
        </Button>
      </Box>
    </Card>
  );
};

export default OrderItem;
