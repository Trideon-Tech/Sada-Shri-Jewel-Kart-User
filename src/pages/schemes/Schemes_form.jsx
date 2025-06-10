import React from "react";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  Box,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import ringLogo from "../../assets/images/2 1.svg";
import Navbar from "../../components/navbar/navbar.component";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Card } from "@mui/material";
import ButtonComponent from "../../components/button/button.component";
import scheme_steps from "../../assets/images/scheme_steps.png";
import { useTheme, useMediaQuery } from "@mui/material";
import { InputAdornment } from "@mui/material";


const Schemes_form = () => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [amount, setAmount] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const navigate = useNavigate();



   useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);


// added the function for local conn
  const handleStartScheme = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/start-scheme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 10000, 
      }),
    });

    

    const data = await response.json();
    console.log("Response:", data);
    alert("Scheme started successfully!");
  } catch (error) {
    console.error("Error starting scheme:", error);
    alert("Something went wrong. Please try again.");
  }
};

const handlePayment = async () => {
  
  try {
    // 1. Create order by calling PHP
    const response = await fetch(`${process.env.REACT_APP_API_URL}v1.0.0/scheme/create_order.php`, {
      
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount)}), // change 100 to your amount
    });

    const data = await response.json();

    if (!data.order_id) throw new Error("Order not created");
 console.log("🔑 Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);
    
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "SadāShrī Jewelkart",
      description: "Gold Scheme",
      order_id: data.order_id,
      handler: function (response) {
        alert("Payment successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);

        
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    alert("Something went wrong");
    console.error(error);
  }
};



  return (
    <>
      <Box>
        <Navbar />
      </Box>



      {isMobile ? (
        <div>
          <div
            style={{
              height: "70vh",
              background:
                "linear-gradient(to bottom ,rgb(231, 223, 213),rgb(234, 210, 167))",
            }}
          >
            <div
              style={{
                position: "relative",
                top: "120px",

                display: "flex",
                justifyContent: "end",
              }}
            >
              <img
                src={ringLogo}
                alt=""
                style={{ width: "150px", height: "150px", marginBottom: "5px" }}
              />
            </div>
            <Box sx={{ position: "relative", top: "" }}>
              <Typography
                style={{
                  textAlign: "center",
                  mt:{xs:0,lg:0},
                  px:2,
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                  fontSize: "28px",
                }}
              >
                Turn Daily Savings into{" "}
                <strong style={{ color: "#A36E29" }}>
                  {" "}
                  Timeless Treasures
                </strong>
              </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  top: "7px",
                  fontFamily: "Open Sans",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                    fontSize: "16px",
                    opacity: "80%",
                    // wordBreak: "break-word", // Allows breaking long words
                  }}
                >
                  Join the{" "}
                  <strong style={{ color: "#000000", opacity: "80%" }}>
                    SadāShrī Jewelkart
                  </strong>{" "}
                  Daily Gold Savings{" "}
                </div>
                <div
                  style={{
                    fontFamily: "Open Sans",
                    fontWeight: 600,
                    fontSize: "16px",
                    opacity: "80%",
                  }}
                >
                  Scheme Today! Save Now. Shine Forever.
                </div>
              </div>
            </Box>
          </div>
          <Card
            sx={{
              width: "90%",
              maxWidth: "360px",
              margin: "auto",
              
              borderRadius: "12px",
              boxShadow: 3,
              position: "relative",
              top: "-100px",
              //margin:"0px 20px"
            }}
           >
            <CardContent sx={{ textAlign: "center", pt: 3 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
              
               <Select
               value={selectedPlan}
               onChange={(e) => setSelectedPlan(e.target.value)}
               displayEmpty
               sx={{
                borderRadius: "7px",
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
                }}>
                
           <MenuItem value="">
           Turn Daily Savings into Timeless Treasures
           </MenuItem>
           <MenuItem value="plan1">  Plan 1  </MenuItem>
           <MenuItem value="plan2">  Plan 2 </MenuItem>
           <MenuItem value="plan3"> Plan 3 </MenuItem>
           </Select>

              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
              
 <TextField
 value={amount}
 onChange={(e) => {
 console.log(e.target.value); // Does this show?
 setAmount(e.target.value);
 }}
/>
   </FormControl>

                {/* <TextField
                                  placeholder="Enter the amount you want"
                  
                  value={amount}
                  
                  onChange={(e) => {console.log(e.target.value); setAmount(e.target.value)}}

                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "20px",
                            fontWeight: 400,
                            color: "#000",
                          }}
                        >
                          ₹
                          <span
                            style={{
                              fontSize: "28px",
                              marginLeft: "10px",
                              marginRight: "10px",
                              color: "#000044",
                              lineHeight: "1",
                            }}
                          >
                            |
                          </span>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: "10px", backgroundColor: "#fff" }}
                  />
                 </FormControl> */}
            </CardContent>

            <CardActions sx={{ justifyContent: "center", mb: 2 }}>
              <ButtonComponent
                buttonText={"Start Now"}
                onClick={handlePayment}
                style={{
                  width: "180px",
                  height: "36px",
                  background: "linear-gradient(to right, #A36E29, #E0B872)",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </CardActions>

            <CardContent sx={{ textAlign: "center", pt: 0, pb: 2 }}>
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "#444",
                }}
              >
                * Missed an installment or wanna pay your installment?{" "}
                <strong style={{ color: "#A36E29" }}>Pay Now</strong>
              </Typography>
            </CardContent>
          </Card>
          <Box
            sx={{
              position: "relative",
              top:"-200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: { xs: "30px 16px", sm: "40px 24px" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Open Sans",
                fontWeight: 700,
                fontSize: { xs: "22px", sm: "28px", md: "32px" },
                textAlign: "center",
                marginBottom: { xs: "16px", sm: "24px" },
                color: "#333",
              }}
            >
              How does it work?
            </Typography>

            <Box
              component="img"
              src={scheme_steps}
              alt="Scheme Steps"
              sx={{
                width: { xs: "100%", sm: "80%", md: "60%", lg: "371px" },
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
        </div>
      ) : (
       <Box>
  <Box
  //card is 370px from the top
    sx={{
      // minHeight: "60vh",
      height:"570px",
      paddingY : 6,
      backgroundColor: "#F9F5EC",
      paddingTop: { xs: 2, md: 3 }, 
      paddingBottom: 6, 
      // position: "relative",
      // padding: { xs: "24px", md: "0" },
    }}
  >
    <Box
      component="img"
      src={ringLogo}
      sx={{
        width: { xs: "150px", sm: "200px", md: "250px", lg: "300px" },
        position: "relative",
        left: { xs: "0", sm: "20px", md: "50px", lg: "369px" },
        margin: { xs: "0 auto", lg: "0" },
        display: "block",
      }}
    />

    <Box
      sx={{
        // position: { xs: "relative", lg: "absolute" },
        // top: { xs: "20px", lg: "100px" },
        // left: { xs: "0", lg: "531px" },
        textAlign: "center",
        // padding: { xs: "0 16px" },
        // minHeight : "300px",
        display : "flex",
        alignItems :"center",
        justifyContent :"center",
        flexDirection : "column",
        px :2,
        mt:{ xs: 1, lg: 2},

        
      }}
    >
      <Typography
        sx={{
          fontFamily: "Open Sans",
          fontWeight: "700",
          fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "36px" },
        }}
      >
        Turn Daily Savings into
      </Typography>
      <Typography
        sx={{
          fontFamily: "Open Sans",
          fontWeight: "700",
          fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "36px" },
          color: "#A36E29",
        }}
      >
        Timeless Treasures
      </Typography>
      <Typography
        sx={{
          fontFamily: "Open Sans",
          fontWeight: "600",
          fontSize: { xs: "14px", sm: "15px", md: "17px" },
          color: "#000000B2",
          mt: 1,
        }}
      >
        Join the SadāShrī Jewelkart Daily Gold Savings Scheme Today
      </Typography>
      <Typography sx={{ fontSize: { xs: "14px", sm: "15px" }, mt: 0.5 }}>
        Save Now. Shine Forever.
      </Typography>
    </Box>
  
    <Card
      sx={{
        width: { xs: "100%", sm: "90%", md: "80%", lg: "710px" },
        // height: "auto",
        // position: { xs: "relative", lg: "absolute" },
        // top: { xs: "40px", lg: "290px" },
        // left: { xs: "0", lg: "401px" },
        borderRadius: "12px",
        marginTop : -8,
        // margin: { xs: "24px auto 0", lg: 0 },
        position:"relative",
        zIndex:1,
        p: { xs: 2, sm: 3 },
        mx: "auto",
      }}
     >
      <CardContent sx={{ textAlign: "center" }}>
        <FormControl sx={{ width: "100%" }}>
          <Select   value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
                    sx={{ borderRadius: "7px" }}
                    displayEmpty>
            <MenuItem value="">
              Turn Daily Savings into Timeless Treasures
            </MenuItem>
            <MenuItem>
              Turn Daily Savings into Timeless Treasures
            </MenuItem>
            <MenuItem>
              Turn Daily Savings into Timeless Treasures
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: "100%", mt: 3 }}>
        
          <TextField
            
            placeholder="Enter the amount you want"
            onChange={(e) => {
             console.log(e.target.value); // Does this show?
                setAmount(e.target.value);
                 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "22px",
                      fontWeight: 400,
                      color: "#000",
                    }}
                  >
                    ₹
                    <span
                      style={{
                        fontSize: "35px",
                        marginLeft: "12px",
                        marginRight: "12px",
                        color: "#000044",
                        lineHeight: "1",
                      }}
                    >
                      |
                    </span>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </CardContent>

      <CardActions
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonComponent
          buttonText={"Start Now"}
          onClick={handlePayment}
          style={{
            width: "250px",
            height: "40px",
            background: "linear-gradient(to right, #A36E29, #E0B872)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </CardActions>

      <CardContent
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Open Sans",
            fontWeight: "600",
            fontSize: { xs: "12px", sm: "14px" },
            textAlign: "center",
          }}
        >
          * Missed an installment or wanna pay your installment?{" "}
          <strong style={{ color: "#A36E29" }}>Pay Now</strong>
        </Typography>
      </CardContent>
    </Card>
  </Box>

  {/* Second Section (How does it work) */}
  <Box
    sx={{
      // mt: { xs: "48px", lg: "170px" },
      mt: { xs: "24px", lg: "80px" },
      textAlign: "center",
      px: { xs: 2, sm: 4 },
    }}
  >
    <Typography
      sx={{
        fontFamily: "Open Sans",
        fontWeight: "700",
        fontSize: { xs: "24px", sm: "28px", lg: "32px" },
        mb: 3,
        
      }}
    >
      How does it work?
    </Typography>

    <Box
  sx={{
    mt: { xs: "48px", lg: "170px" },
    textAlign: "center",
    px: { xs: 2, sm: 4 },
    display: "flex",
    justifyContent: "center", // ✅ CENTERING
  }}
>
  <Box
    component="img"
    src={scheme_steps}
    alt="Steps"
    sx={{
      width: { xs: "100%", sm: "90%", md: "80%", lg: "1018px" },
      maxWidth: "100%",
      height: "auto",
    }}
  />
</Box>

    />
  </Box>
</Box>

      )}
    </>
  );
};

export default Schemes_form;
