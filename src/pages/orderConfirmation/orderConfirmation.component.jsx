import {
  Button,
  Card,
  Divider,
  Grid,
  Paper,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../components/footer/footer.component";
import Navbar from "../../components/navbar/navbar.component";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState();
  const [companyName, setCompanyName] = useState();

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/orders.php?type=order_confirmation_details&order_record_id=${searchParams.get(
          "order_record_id"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("orders", response.data.response);
        setOrderDetails(response.data.response);

        const uniqueCompanyNames = [
          ...new Set(
            response.data.response["order_details"].map(
              (order) => order.company_name
            )
          ),
        ];

        const formattedNames =
          uniqueCompanyNames.length > 1
            ? uniqueCompanyNames.slice(0, -1).join(", ") +
              " and " +
              uniqueCompanyNames.slice(-1)
            : uniqueCompanyNames[0];

        setCompanyName(formattedNames);
      })
      .catch((error) =>
        console.log("Error while fetching order details", error)
      );
  }, []);

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
    <div>
      <Navbar />
      {typeof orderDetails === "undefined" ? (
        <div>Loading</div>
      ) : (
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            marginTop: matches ? "" : "12vh",
          }}
        >
          <div style={{ width: matches ? "70%" : "80%" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: matches ? "center" : "flex-start",
                justifyContent: "space-between",
                flexDirection: matches ? "row" : "column",
                marginTop: matches ? "20px" : "5vh",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: matches ? "1.4rem" : "1.2rem",
                }}
              >
                Thanks you for your order #
                {orderDetails["order_record"]["public_id"]}
              </p>
              <Button
                style={{
                  borderRadius: "10px",
                  border: "2px solid #a36e29",
                  width: "200px",
                  backgroundColor: "white",
                  color: "#a36e29",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "0.8rem",
                  marginBottom: matches ? "" : "20px",
                }}
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: matches ? "30vw" : "",
                }}
              >
                {matches ? (
                  <div
                    style={{
                      display: "flex",
                      fontFamily: '"Open Sans", sans-serif',
                      fontSize: matches ? "1.2rem" : "1rem",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "grey",
                    }}
                  >
                    <img
                      src={process.env.PUBLIC_URL + "/assets/coins.png"}
                      height={matches ? 40 : 30}
                      style={{
                        marginRight: "12px",
                      }}
                    />
                    <>
                      Congratulations you have received&nbsp;
                      <span style={{ fontWeight: 600, color: "#a36e29" }}>
                        {`₹${
                          orderDetails["wallet_transaction"].find(
                            (transaction) =>
                              transaction.transaction_type === "credit"
                          )["amount"]
                        }`}
                      </span>
                      &nbsp;in your wallet
                    </>
                  </div>
                ) : null}
                {matches ? null : (
                  <img
                    src={process.env.PUBLIC_URL + "/assets/anim.png"}
                    height={300}
                  />
                )}
                <div
                  style={{
                    height: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: "gray",
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "1rem",
                        }}
                      >
                        Order Placed
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "10px",
                        }}
                      >
                        Standard Shipping
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "10px",
                          color: "gray",
                        }}
                      >
                        Sold by {companyName}
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          color: "gray",
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "1rem",
                        }}
                      >
                        Shipping Address
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "10px",
                        }}
                      >
                        {orderDetails["user_address"]["name"]}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "10px",
                        }}
                      >
                        {`${orderDetails["user_address"]["add_line_1"]}`}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "5px",
                        }}
                      >
                        {`${orderDetails["user_address"]["add_line_2"]}`}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "5px",
                        }}
                      >
                        {`${orderDetails["user_address"]["city"]}, ${orderDetails["user_address"]["state"]}`}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontSize: "0.9rem",
                          marginTop: "5px",
                        }}
                      >
                        {`${orderDetails["user_address"]["pincode"]}`}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "max-content",
                      marginTop: "30px",
                    }}
                  >
                    {orderDetails["order_details"].map((o) => (
                      <Card
                        sx={{
                          padding: "3%",
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "20px",
                        }}
                        elevation={1}
                      >
                        <img
                          src={`https://api.sadashrijewelkart.com/assets/${o?.images[0]?.file}`}
                          height={150}
                          style={{
                            borderRadius: "10px",
                          }}
                        />
                        <div
                          style={{
                            marginLeft: "20px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "1.1rem",
                              fontWeight: "600",
                            }}
                          >
                            {o["product_name"]}
                          </div>

                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                              marginTop: "18px",
                            }}
                          >
                            Qty: 1pcs
                          </div>
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                              marginTop: "8px",
                            }}
                          >
                            Price:{" "}
                            <span
                              style={{
                                fontWeight: "bold",
                              }}
                            >
                              ₹{o["price"]}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                              marginTop: "8px",
                              color:
                                o["shipment_status"] === "ORDER_CANCELED"
                                  ? "#f7333f"
                                  : "gray",
                            }}
                          >
                            {o["shipment_status"] === "ORDER_CREATED"
                              ? "Arriving "
                              : o["shipment_status"] === "ORDER_CANCELED"
                              ? "Order Cancelled"
                              : "Delivered "}
                            {o["shipment_status"] === "ORDER_CREATED"
                              ? formatDate(o["estimated_date"])
                              : ""}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        style={{
                          borderRadius: "5px",
                          padding: matches ? "20px" : "4px",
                          paddingLeft: "20px",
                          paddingRight: "20px",
                          marginBottom: "50px",
                        }}
                        elevation={1}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            textAlign: "left",
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                          }}
                        >
                          Order Summary
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "30px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                            }}
                          >
                            Subtotal
                          </div>
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",

                              fontWeight: "bold",
                            }}
                          >
                            ₹ {orderDetails["order_record"]["sub_total_amount"]}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                            }}
                          >
                            Coins Redeemed
                          </div>
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",

                              fontWeight: "bold",
                            }}
                          >
                            {`₹ ${
                              orderDetails["wallet_transaction"].find(
                                (transaction) =>
                                  transaction.transaction_type === "debit"
                              )?.amount || 0
                            }`}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                            }}
                          >
                            Discount
                          </div>
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",

                              fontWeight: "bold",
                            }}
                          >
                            ₹ {orderDetails["order_record"]["discount_amount"]}
                          </div>
                        </div>
                        <Divider />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "10px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",
                            }}
                          >
                            Net Total
                          </div>
                          <div
                            style={{
                              fontFamily: '"Open Sans", sans-serif',
                              fontSize: "0.9rem",

                              fontWeight: "bold",
                            }}
                          >
                            ₹ {orderDetails["order_record"]["amount"]}
                          </div>
                        </div>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        style={{
                          borderRadius: "5px",
                          padding: matches ? "20px" : "4px",
                          paddingLeft: "40px",
                          paddingRight: "40px",
                        }}
                        elevation={1}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            textAlign: "left",
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                          }}
                        >
                          Billing Address
                        </div>
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                            marginTop: "30px",
                          }}
                        >
                          {orderDetails["user_address"]["name"]}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                            marginTop: "10px",
                          }}
                        >
                          {`${orderDetails["user_address"]["add_line_1"]}`}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                            marginTop: "5px",
                          }}
                        >
                          {`${orderDetails["user_address"]["add_line_2"]}`}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                            marginTop: "5px",
                          }}
                        >
                          {`${orderDetails["user_address"]["city"]}, ${orderDetails["user_address"]["state"]}`}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Open Sans", sans-serif',
                            fontSize: "0.9rem",
                            marginTop: "5px",
                          }}
                        >
                          {`${orderDetails["user_address"]["pincode"]}`}
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </div>
              {matches ? (
                <img
                  src={process.env.PUBLIC_URL + "/assets/anim.png"}
                  height={500}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
