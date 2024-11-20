import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MobileStepper from "@mui/material/MobileStepper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import "./carousel.styles.scss";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    label: "C1",
    imgPath: "/assets/c1.png",
  },
  {
    label: "C2",
    imgPath: "/assets/c2.png",
  },
  {
    label: "C3",
    imgPath: "/assets/c3.png",
  },
];

const imagesMobile = [
  {
    label: "C1",
    imgPath: "/assets/c1_m.png",
  },
  {
    label: "C2",
    imgPath: "/assets/c2_m.png",
  },
  {
    label: "C3",
    imgPath: "/assets/c3_m.png",
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

  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        height: matches ? "80vh" : "45vh",
        marginTop: matches ? "0" : "18vh",
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
                  height: matches ? "80vh" : "45vh",
                  overflow: "hidden",
                  width: "100%",
                  backgroundColor: "pink",
                }}
              >
                <img
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: matches ? "80vh" : "45vh",
                  }}
                  src={process.env.PUBLIC_URL + step.imgPath}
                  alt={step.label}
                />
              </Box>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
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
    </Box>
  );
}

export default CarouselPanel;
