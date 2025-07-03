import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ringLogo from "../../assets/images/2 1.svg";
import scheme_steps from "../../assets/images/scheme_steps.png";
import ButtonComponent from "../../components/button/button.component";
import Navbar from "../../components/navbar/navbar.component";
import { generalToastStyle } from "../../utils/toast.styles";
import Background1 from "../../assets/images/22.png";
// import Background2 from "../../assets/images/23.png";
// import Background3 from "../../assets/images/24.png";

const Schemes_form = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchParams = useSearchParams();
  const planId = searchParams[0].get("plan");
  const heroBackgrounds = {
  1: Background1,
  2: Background1,
  3: Background1,
};

const heroImage = heroBackgrounds[parseInt(planId)] || Background1;

  const [selectedPlan, setSelectedPlan] = useState(planId);
  const [schemes, setSchemes] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}v1.0.0/user/schemes/all.php`)
      .then((response) => {
        setSchemes(response.data.response);
        if (planId) {
        const selectedScheme = response.data.response.find(
          (scheme) => scheme.id === planId
        );

        if (selectedScheme) {
          const parsedBenefits = JSON.parse(selectedScheme.benefits);
          setBenefits(parsedBenefits);
        }
      }
      })
      .catch((err) => console.error("Failed to fetch schemes:", err));
  }, []);

  const handleSavings = async () => {
  let selectedScheme = schemes.find((scheme) => scheme.id === selectedPlan);

  if (!selectedScheme) {
    toast("Selected scheme not found", generalToastStyle);
    return;
  }

  if (parseFloat(amount) >= parseFloat(selectedScheme.min_amount)) {
    try {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "SadāShrī Jewelkart",
        description: "SadāShrī Jewelkart Daily Gold Savings",
        handler: async function (response) {
          const formData = new FormData();
          formData.append("amount", amount);
          formData.append("payment_id", response.razorpay_payment_id);

          await axios.post(
            `${process.env.REACT_APP_API_URL}v1.0.0/user/schemes/savings.php`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          toast.success("Payment successful!", generalToastStyle);
          navigate("/my-account");
        },
        theme: {
          color: "#A36E29",
        },
      };

      // ✅ Razorpay script load fix
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Razorpay SDK failed to load", generalToastStyle);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment failed",
        generalToastStyle
      );
    } finally {
      setIsLoading(false);
    }
  } else {
    toast("Amount is less than minimum amount", generalToastStyle);
  }
};



  const handlePayment = async () => {
    try {
      //login check
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to continue.");
        return;
      }
      // Checking if amount entered is more than minimum amount
      let selectedScheme = schemes.find((scheme) => scheme.id === selectedPlan);
      if (parseFloat(amount) >= parseFloat(selectedScheme.min_amount)) {
        setIsLoading(true);
        // Creating Plan
        const formData = new FormData();
        formData.append("amount", amount);
        formData.append("scheme", selectedPlan);

        let plan = await axios.post(
          `${process.env.REACT_APP_API_URL}v1.0.0/user/schemes/plan.php`,
          formData
        );

        let rzp_plan_id = plan.data.data.rzp_plan_id || plan.data.data.id;

        // Creating Subscription
        const subFormData = new FormData();
        subFormData.append("scheme", selectedPlan);
        subFormData.append("plan", rzp_plan_id);

        let sub = await axios.post(
          `${process.env.REACT_APP_API_URL}v1.0.0/user/schemes/subscribe.php`,
          subFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let subId = sub.data.data.subscription_id;
        // Load Razorpay script dynamically
        const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        // Initialize Razorpay after script loads
        const initRazorpay = async () => {
          const res = await loadRazorpayScript();
          if (!res) {
            alert("Razorpay SDK failed to load");
            return;
          }

          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            subscription_id: subId,
            name: "SadāShrī Jewelkart",
            description: "Monthly Plan Subscription",
            image: "https://sadashrijewelkart.com/logo.png",
            handler: async function (response) {
              console.log(response);
              const formData = new FormData();
              formData.append("scheme", selectedPlan);
              formData.append("plan", rzp_plan_id);
              formData.append(
                "subscription_id",
                response.razorpay_subscription_id
              );
              formData.append("signature", response.razorpay_signature);
              formData.append(
                "authorizing_payment_id",
                response.razorpay_payment_id
              );

              await axios.post(
                `${process.env.REACT_APP_API_URL}v1.0.0/user/schemes/activate.php`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              setIsLoading(false);
              toast("Subscription successful", generalToastStyle);
              navigate("/my-account");
            },
            theme: {
              color: "#A36E29",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };

        await initRazorpay();
      } else {
        toast("Amount is less than minimum amount", generalToastStyle);
      }
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
      <ToastContainer />

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
                src={Background1}
                alt=""
                style={{ width: "150px", height: "150px", marginBottom: "5px" }}
              />
            </div>
            <Box sx={{ position: "relative", top: "" }}>
              <Typography
                style={{
                  textAlign: "center",
                  mt: { xs: 0, lg: 0 },
                  px: 2,
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
                  onChange={(e) => {
  const planId = e.target.value;
  setSelectedPlan(planId);

  const selectedScheme = schemes.find((scheme) => scheme.id === planId);

  if (selectedScheme) {
    const parsedBenefits = JSON.parse(selectedScheme.benefits);
    setBenefits(parsedBenefits);
  } else {
    setBenefits([]);
  }
}}

                  displayEmpty
                  sx={{
                    borderRadius: "7px",
                    fontSize: "14px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <MenuItem value="">
                    Turn Daily Savings into Timeless Treasures
                  </MenuItem>
                  <MenuItem value="plan1"> Plan 1 </MenuItem>
                  <MenuItem value="plan2"> Plan 2 </MenuItem>
                  <MenuItem value="plan3"> Plan 3 </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  placeholder="Enter the amount you want"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
              </FormControl>
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
              mt: { xs: 4, sm: 6 },
              px: { xs: 2, sm: 4 },
              display: "flex",

              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                backgroundColor: "#fff",
                boxShadow: 1,
                borderRadius: "12px",
                p: { xs: 3, sm: 4 },
              }}
            >
              {/* Heading */}
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  fontWeight: "700",
                  mb: 3,
                  fontSize: { xs: "24px", sm: "28px", md: "32px" },
                  fontFamily: "Open Sans",
                }}
              >
                Benefits of Our Scheme
              </Typography>

              {/* Plan Overview */}
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Plan Overview:
              </Typography>
              <Typography sx={{ fontSize: "14px", mb: 2 }}>
                The 11 month direct purchase plan allows customers to
                systematically save and purchase gold jewellery, or silver
                articles with extra added benefits
              </Typography>

              {/* Key Features */}
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Key Features:
              </Typography>
              <Box
                component="ul"
                sx={{ pl: 2, fontSize: "14px", lineHeight: 1.8 }}
              >
                <li>
                  ✅ Fixed monthly installments for 11 months (minimum ₹1,000
                  per month).
                </li>
                <li>
                  ✅ Gold & silver prices will be determined at the scheme’s
                  closing time.
                </li>
                <li>
                  ✅ Gold & Diamond Jewellery: Zero making charges and zero
                  wastage.
                </li>
                <li>
                  ✅ Silver Articles: Zero making charges, but wastage will be
                  added as applicable.
                </li>
                <li>✅ GST will be applicable on purchases.</li>
                <li>
                  ✅ Flexible Installments: If an installment is missed, it will
                  be postponed to the next month until all 11 installments are
                  completed.
                </li>
              </Box>

              {/* Feature Cards */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  gap: 2,
                  mt: 4,
                }}
              >
                {[
                  {
                    title: "Zero Making Charges",
                    desc: "On Gold, Silver and Diamond Jewelleries",
                  },
                  {
                    title: "Zero Wastage",
                    desc: "On Gold and Diamond Jewelleries",
                  },
                  {
                    title: "Flexible Instalment",
                    desc: "Missed installment shifts to next month automatically.",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      p: 2,
                      backgroundColor: "#fafafa",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, fontSize: "16px", mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: "13px", color: "#555" }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "relative",
              top: "-200px",
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
            sx={{
              height: "600px",
              backgroundImage: `url(${heroImage})`,
                  backgroundSize: "cover",         // This scales the image to cover the box
    backgroundPosition: "center",    // This centers the image
    backgroundRepeat: "no-repeat", 
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2, sm: 6, md: 10, lg: 16 },
            }}
          >
            {/* LEFT TEXT BLOCK */}
            <Box
              sx={{
                maxWidth: "480px",
                color: "#000",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  fontWeight: "700",
                  fontSize: { xs: "24px", sm: "32px", md: "36px", lg: "40px" },
                }}
              >
                Turn Daily Savings into
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  fontWeight: "700",
                  fontSize: { xs: "24px", sm: "32px", md: "36px", lg: "40px" },
                  color: "#A36E29",
                  mb: 2,
                }}
              >
                Timeless Treasures
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#000000B2",
                }}
              >
                Join the SadāShrī Jewelkart Daily Gold Savings Scheme Today
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Open Sans",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#000000B2",
                }}
              >
                Save Now. Shine Forever.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              px: { xs: 2, sm: 4 },
              mt: { xs: 6, md: 10 },
              background:
                "linear-gradient(to bottom,rgb(255, 253, 251),rgb(190, 148, 97))",

              //background: "linear-gradient(to bottom, #f4e2d8, #e7c7a8)", // ✅ Move gradient here
              py: { xs: 6, sm: 8 }, // ✅ Add padding for spacing
              width: "100%", 
            }}
          >
            <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap", // Makes it responsive
    
    gap: { xs: 6, sm: 8, md: 12 },
    mb: { xs: 4, sm: 6 }, // Space below this section
  }}
>
  {/* Left Ring Logo */}
  <Box
    component="img"
    src={ringLogo}
    alt="Ring Logo Left"
    sx={{
       width: { xs: "180px", sm: "220px", md: "260px" },
      height: "auto",
    }}
  />

  {/* Form Card */}
  <Card
    sx={{
      width: { xs: "90%", sm: "500px" }, // Responsive width
      borderRadius: "12px",
      boxShadow: 3,
      backgroundColor: "#fff",
      p: 3,
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedPlan}
          onChange={(e) => {
  const planId = e.target.value;
  setSelectedPlan(planId);

  const selectedScheme = schemes.find((scheme) => scheme.id === planId);

  if (selectedScheme) {
    const parsedBenefits = JSON.parse(selectedScheme.benefits);
    setBenefits(parsedBenefits);
  } else {
    setBenefits([]);
  }
}}

          displayEmpty
          sx={{
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            fontSize: "14px",
          }}
        >
          <MenuItem value="">Select Plan</MenuItem>
          {schemes.map((scheme) => (
            <MenuItem key={scheme.id} value={scheme.id}>
              {scheme.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <TextField
          placeholder="Enter the amount you want"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ fontWeight: 500 }}>₹</Box>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>

      <ButtonComponent
        buttonText={"Start Now"}
        onClick={selectedPlan === "3" ? handleSavings : handlePayment}
        style={{
          width: "100%",
          height: "50px",
          background: "linear-gradient(to right, #A36E29, #E0B872)",
          color: "#fff",
          fontWeight: "600",
          fontSize: "14px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 0,
        }}
      />

      <Typography
        sx={{
          mt: 2,
          fontSize: "12px",
          color: "#444",
          fontFamily: "Open Sans",
          fontWeight: 500,
        }}
      >
        * Missed an installment or want to pay it?{" "}
        <strong style={{ color: "#A36E29" }}>Pay Now</strong>
      </Typography>
    </CardContent>
  </Card>

  {/* Right Ring Logo */}
  <Box
    component="img"
    src={ringLogo}
    alt="Ring Logo Right"
    sx={{
       width: { xs: "180px", sm: "220px", md: "260px" },
      height: "auto",
    }}
  />
</Box>

            <Box
              sx={{
                mt: { xs: 4, sm: 6 },
                px: { xs: 2, sm: 4 },
                display: "flex",

                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "1600px",
                  backgroundColor: "#fff",
                  boxShadow: 1,
                  borderRadius: "12px",
                  p: { xs: 3, sm: 4 },
                }}
              >
                {/* Heading */}
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    fontWeight: "700",
                    mb: 3,
                    fontSize: { xs: "24px", sm: "28px", md: "32px" },
                    fontFamily: "Open Sans",
                  }}
                >
                  Benefits of Our Scheme
                </Typography>

                {/* Plan Overview */}
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Plan Overview:
                </Typography>
                <Typography sx={{ fontSize: "14px", mb: 2 }}>
                  The 11 month direct purchase plan allows customers to
                  systematically save and purchase gold jewellery, or silver
                  articles with extra added benefits
                </Typography>

                {/* Key Features */}
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Key Features:
                </Typography>
                {benefits.length > 0 ? (
  <Box component="ul" sx={{ pl: 2, fontSize: "14px", lineHeight: 1.8 }}>
    {benefits.map((benefit, index) => (
      <li key={index}>✅ {benefit}</li>
    ))}
  </Box>
) : (
  <Typography sx={{ fontSize: "14px" }}>
    Select a plan to view its benefits.
  </Typography>
)}


                {/* Feature Cards */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  {[
                    {
                      title: "Zero Making Charges",
                      desc: "On Gold, Silver and Diamond Jewelleries",
                    },
                    {
                      title: "Zero Wastage",
                      desc: "On Gold and Diamond Jewelleries",
                    },
                    {
                      title: "Flexible Instalment",
                      desc: "Missed installment shifts to next month automatically.",
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        p: 2,
                        backgroundColor: "#fafafa",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 600, fontSize: "16px", mb: 1 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography sx={{ fontSize: "13px", color: "#555" }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
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
                mt: { xs: "48px", lg: "90px" },
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
          </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Schemes_form;
