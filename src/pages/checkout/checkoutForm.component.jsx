import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import FormLabel from "@mui/joy/FormLabel";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Card from "@mui/joy/Card";
import Divider from "@mui/material/Divider";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Chip from "@mui/joy/Chip";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Button from "@mui/joy/Button";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import StepButton from "@mui/joy/StepButton";
import StepIndicator from "@mui/joy/StepIndicator";
import Check from "@mui/icons-material/Check";

const steps = ["Shipping", "Summary", "Payment"];

const addresses = [
  {
    id: 1,
    firstName: "Eric",
    lastName: "Joon",
    addressLine1: "3rd Cross Street, 4th Main Road",
    addressLine2: "Neeladri Nagar, Electronic City",
    pin: 560100,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
  {
    id: 2,
    firstName: "Ken",
    lastName: "Miles",
    addressLine1: "HustleHub 1901, 19th Main Street",
    addressLine2: "Near HSR BDA Complex",
    pin: 560098,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
  {
    id: 3,
    firstName: "lara",
    lastName: "Croft",
    addressLine1: "16rd Cross Street, 4th Main Road",
    addressLine2: "Neeladri Nagar, Electronic City",
    pin: 560100,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
  {
    id: 4,
    firstName: "Captain",
    lastName: "Price",
    addressLine1: "14rd Cross Street, 4th Main Road",
    addressLine2: "Gotigere Nagar, Electronic City",
    pin: 560100,
    city: "Bengaluru",
    state: "karnataka",
    mobile: 9078675638,
  },
];
const CheckoutForm = () => {
  const [selectedAddress, setSelectedAddress] = React.useState(addresses[0]);
  const [activeStep, setActiveStep] = React.useState(1);
  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "max-content",
        marginTop: "10%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box style={{ width: "80%", marginTop: "5%", height: "max-content" }}>
        <Stepper sx={{ width: "100%", marginBottom: "3%" }}>
          {steps.map((step, index) => (
            <Step
              key={step}
              indicator={
                <StepIndicator
                  variant={activeStep <= index ? "soft" : "solid"}
                  color={activeStep < index ? "neutral" : "primary"}
                >
                  {activeStep <= index ? index + 1 : <Check />}
                </StepIndicator>
              }
              sx={{
                "&::after": {
                  ...(activeStep > index &&
                    index !== 2 && { bgcolor: "primary.solidBg" }),
                },
              }}
            >
              <StepButton onClick={() => setActiveStep(index)}>
                {step}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Divider style={{ width: "100%" }} />
      <Box style={{ width: "80%", marginTop: "5%", height: "max-content" }}>
        <Typography
          variant="h6"
          style={{ color: "#a36e29", fontWeight: "bold" }}
        >
          Delivery Type
        </Typography>
        <Divider />
        <RadioGroup
          aria-label="platform"
          defaultValue="Website"
          overlay
          name="platform"
          sx={{
            marginTop: "3%",
            flexDirection: "row",
            gap: 2,
            [`& .${radioClasses.checked}`]: {
              [`& .${radioClasses.action}`]: {
                inset: -1,
                border: "3px solid",
                borderColor: "#a36e29",
              },
            },
            [`& .${radioClasses.radio}`]: {
              display: "contents",
              "& > svg": {
                zIndex: 2,
                position: "absolute",
                top: "-8px",
                right: "-8px",
                bgcolor: "background.surface",
                borderRadius: "50%",
              },
            },
          }}
        >
          {[
            {
              type: "Home Delivery",
              description: "Earliest Delivery dates selected for your Pincode",
            },
            {
              type: "In Store Pick Up",
              description:
                "Buy now, pick up from our store at your convenience",
            },
          ].map((value) => (
            <Sheet
              key={value.type}
              variant="outlined"
              sx={{
                borderRadius: "md",
                boxShadow: "sm",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                minWidth: 120,
              }}
            >
              <Radio
                id={value.type}
                value={value.type}
                checkedIcon={
                  <CheckCircleRoundedIcon style={{ color: "#a36e29" }} />
                }
              />
              <Typography variant="body" style={{ fontWeight: "bold" }}>
                {value.type}
              </Typography>
              <Typography variant="subtitle">{value.description}</Typography>
            </Sheet>
          ))}
        </RadioGroup>
        <Typography
          variant="h6"
          style={{ color: "#a36e29", fontWeight: "bold", marginTop: "5%" }}
        >
          Shipping Address
        </Typography>

        <Divider />
        <Select
          defaultValue={addresses[0]}
          slotProps={{
            listbox: {
              sx: {
                "--ListItemDecorator-size": "100px",
              },
            },
          }}
          sx={{
            marginTop: "3%",
            minWidth: 240,
          }}
          onChange={(event, value) => {
            console.log(event);
            console.log(value);
            setSelectedAddress(event?.target.value);
          }}
        >
          {addresses.map((data, index) => (
            <Option
              style={{ height: "100px" }}
              key={data.id}
              value={data}
              label={data.addressLine1}
            >
              <Box component="span" sx={{ display: "block" }}>
                <Typography component="span" level="title-sm">
                  {data.addressLine1}
                </Typography>
                <Typography level="body-xs">{data.addressLine2}</Typography>
                <Typography level="subtitle">{data.city}</Typography>
                <Typography level="subtitle">{`${data.state} - ${data.pin}`}</Typography>
              </Box>
            </Option>
          ))}
        </Select>
        <Card
          orientation="Verticle"
          size="sm"
          variant="soft"
          style={{
            marginTop: "3%",
            marginBottom: "5%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography level="body-lg">{`${selectedAddress.state} ${selectedAddress.pin}`}</Typography>
          <Typography level="title-lg">
            {selectedAddress.addressLine1}
          </Typography>
          <Typography level="title-lg">
            {selectedAddress.addressLine2}
          </Typography>
          <Typography level="body-sm">{selectedAddress.city}</Typography>
          <Typography level="body-md">{selectedAddress.mobile}</Typography>
          <Typography level="body-md">{`${selectedAddress.firstName}  ${selectedAddress.lastName}`}</Typography>

          <Button
            variant="solid"
            size="md"
            color="primary"
            aria-label="Explore Bahamas Islands"
            sx={{ ml: "auto", alignSelf: "center", fontWeight: 600 }}
          >
            Edit
          </Button>
        </Card>
      </Box>
    </Paper>
  );
};
export default CheckoutForm;
