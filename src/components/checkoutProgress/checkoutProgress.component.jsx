import React from "react";
import { Stepper, Step, StepLabel, StepConnector, styled } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

import { stepConnectorClasses } from "@mui/material/StepConnector";
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[800] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background:
      "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    background:
      "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
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
      {completed ? <CheckCircleOutline /> : <div>{props.icon}</div>}
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
        "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background:
        "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
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
                  activeStep === index
                    ? "#A36E29" // Active step label color
                    : grey[400], // Inactive step label color
              },
            }}
          >
            <strong>{label}</strong>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutProgressBar;
