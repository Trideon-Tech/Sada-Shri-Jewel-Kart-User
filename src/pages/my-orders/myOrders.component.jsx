import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom"; // Import for linking to track order page
import { useTheme } from "@mui/material/styles";
import Navbar from "../../components/navbar/navbar.component";

// Assuming you have order data fetched from an API or stored locally
const orders = [
  {
    id: 1,
    imageUrl: "https://picsum.photos/200", // Replace with your image URL
    name: "Diamond Ring",
    arrivalDate: "2024-04-20",
    status: "Processing",
  },
  {
    id: 1,
    imageUrl: "https://picsum.photos/200", // Replace with your image URL
    name: "Gold Ring with Diamond",
    arrivalDate: "2024-04-20",
    status: "Processing",
  },
  // ... more orders
];

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
  cardDetails: {
    flex: 1,
  },
  media: {
    width: 150,
  },
  buttonGroup: {
    justifyContent: "space-between", // Align buttons horizontally
  },
});

function OrdersList() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching (replace with your actual API call)
  useEffect(() => {
    const fetchData = async () => {
      // Fetch order data
      setIsLoading(false); // Set loading state to false after fetching
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  return (
    <Box>
      <Navbar />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          variant={"h4"}
          style={{
            marginTop: "2%",
            textAlign: "left",
            fontWeight: "bold",
            color: "#707070",
          }}
        >
          My Orders
        </Typography>
        <Box
          style={{
            marginTop: "5%",
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Grid container spacing={2}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Card
                  sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    marginBottom: 2,
                    minHeight: "30vh",
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "3%",
                      alignItems: "flex-start",
                      justifyContent: "space-evenly",
                      height: "10vh",
                      marginBottom: "2%",
                      backgroundColor: "#fcdaac",
                      borderBottom: "1px solid #a36e29",
                    }}
                  >
                    <Typography style={{ color: "#404040" }} variant="h6">
                      Order Id : {"1230-A-3S"}
                    </Typography>
                    <Typography style={{ color: "#707070" }} variant="body">
                      Ordered On : 12th july 2023
                    </Typography>
                  </Box>
                  <Box
                    style={{
                      width: "100%",
                      display: "flex",
                      marginBottom: "2%",
                    }}
                  >
                    {" "}
                    {/* Set card width */}
                    <CardActionArea
                      style={{ width: "30%" }}
                      component={Link}
                      to={`/track-order/`}
                    >
                      {/* Link to specific track order page */}
                      <img src={order.imageUrl} title={order.name} />
                    </CardActionArea>
                    <CardContent
                      sx={{ padding: 2 }}
                      style={{
                        textAlign: "left",
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {" "}
                      {/* Add padding for content */}
                      <Typography variant="subtitle1" color="textSecondary">
                        Arriving on {order.arrivalDate}
                      </Typography>
                      <Typography variant="h6">{order.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {order.status}
                      </Typography>
                      <Box
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: "auto",
                        }}
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#a36e29" }}
                          size="small"
                          component={Link}
                          to={`/track-order/`}
                        >
                          Track Order
                        </Button>
                        <Button variant="outlined" color="error" size="small">
                          Cancel Order
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default OrdersList;
