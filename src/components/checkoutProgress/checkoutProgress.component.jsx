import { Done } from "@mui/icons-material";
import { Step, StepConnector, StepLabel, Stepper, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

import { stepConnectorClasses } from "@mui/material/StepConnector";
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[800] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 45,
  height: 45,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background:
      "linear-gradient(to right, #d4a76a, #a36e29)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    background:
      "linear-gradient(to right, #d4a76a, #a36e29)",
    backgroundColor: "#A36E29",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ active, completed }}
      className={className}
    >
      {completed ? <Done /> : <div>{props.icon}</div>}
    </ColorlibStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background:
        "#a36e29",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background:
        "#a36e29",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const CheckoutProgressBar = ({ activeStep }) => {
  const steps = ["Log In", "Shipping Address", "Payment"];

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<ColorlibConnector />}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel
            StepIconComponent={ColorlibStepIcon}
            sx={{
              "& .MuiStepLabel-label": {
                color: (theme) =>
                  activeStep === index ? "#A36E29" : grey[400],
              },
            }}
          >
            <span
              style={{
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              {label}
            </span>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutProgressBar;
