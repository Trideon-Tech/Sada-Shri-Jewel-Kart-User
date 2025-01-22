import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import "./carousel.styles.scss";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  // {
  //   label: "C1",
  //   imgPath: "/assets/33.webp",
  // },
  {
    label: "C1",
    imgPath: "/assets/36.webp",
  },
  {
    label: "C5",
    imgPath: "/assets/32.webp",
  },
  {
    label: "C6",
    imgPath: "/assets/landingPageBanner.webp",
  },
  {
    label: "C7",
    imgPath: "/assets/34.webp",
  },
  // {
  //   label: "C1",
  //   imgPath: "/assets/33.webp",
  // },
  {
    label: "C1",
    imgPath: "/assets/36.webp",
  },
  {
    label: "C5",
    imgPath: "/assets/32.webp",
  },
  {
    label: "C6",
    imgPath: "/assets/landingPageBanner.webp",
  },
  {
    label: "C7",
    imgPath: "/assets/34.webp",
  },
  // {
  //   label: "C1",
  //   imgPath: "/assets/33.webp",
  // },
  {
    label: "C1",
    imgPath: "/assets/36.webp",
  },
  {
    label: "C5",
    imgPath: "/assets/32.webp",
  },
  {
    label: "C5",
    imgPath: "/assets/landingPageBanner.webp",
  },
  {
    label: "C7",
    imgPath: "/assets/34.webp",
  },
  // {
  //   label: "C1",
  //   imgPath: "/assets/33.webp",
  // },
  {
    label: "C1",
    imgPath: "/assets/36.webp",
  },
  {
    label: "C5",
    imgPath: "/assets/32.webp",
  },
  {
    label: "C6",
    imgPath: "/assets/landingPageBanner.webp",
  },
  {
    label: "C7",
    imgPath: "/assets/34.webp",
  },
];

const imagesMobile = [
  // {
  //   label: "C1",
  //   imgPath: "/assets/37.webp",
  // },
  {
    label: "C1",
    imgPath: "/assets/38.webp",
  },
  // {
  //   label: "C2",
  //   imgPath: "/assets/39.webp",
  // },
  {
    label: "C5",
    imgPath: "/assets/40.webp",
  },
  {
    label: "C6",
    imgPath: "/assets/landingPageBanner.webp",
  },
  // {
  //   label: "C6",
  //   imgPath: "/assets/41.webp",
  // },
  {
    label: "C7",
    imgPath: "/assets/42.webp",
  },
  
];

function CarouselPanel() {
  const matches = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleVideoEnded = () => {
    if (activeStep < maxSteps - 1) {
      handleNext();
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        height: matches ? "85vh" : "25vh",
        marginTop: matches ? "30px" : "17vh",
        position: "relative",
      }}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {(matches ? images : imagesMobile).map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                style={{
                  height: matches ? "75vh" : "25vh",
                  overflow: "hidden",
                  width: "100%",
                  backgroundColor: "rgba(163,110,41,0.08)",
                  marginTop: matches ? "30px" : "0px",
                }}
              >
                <img
                  style={{
                    objectFit: matches ? "cover" : "contain",
                    width: "100%",
                    height: matches ? "75vh" : "25vh",
                  }}
                  src={process.env.PUBLIC_URL + step.imgPath}
                  alt={step.label}
                />
              </Box>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      {/* {matches ? (
        <Box
          style={{
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <MobileStepper
            variant="dots"
            style={{
              position: "absolute",
              zIndex: 9,
              borderRadius: "20px",
              top: matches ? "70vh" : "35vh",
              height: matches ? "40px" : "20px",
              color: "#a36e29",
              backgroundColor: "rgba(0,0,0,0.5)",
              "& .MuiMobileStepper-dotActive": {
                color: "#a36e29",
                backgroundColor: "#a36e29",
              },
            }}
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft style={{ color: "white" }} />
                ) : (
                  <KeyboardArrowRight style={{ color: "white" }} />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight style={{ color: "white" }} />
                ) : (
                  <KeyboardArrowLeft style={{ color: "white" }} />
                )}
              </Button>
            }
          />
        </Box>
      ) : (
        <div></div>
      )} */}
    </Box>
  );
}

export default CarouselPanel;
