import { Box, Card, Typography } from "@mui/material";

const PaymentMethod = ({
  setPaymentMethod,
  paymentMethod,
  selectedAddress,
}) => {
  console.log("selectedAddress", selectedAddress);
  return (
    <Box>
      <Card
        orientation="Verticle"
        size="sm"
        variant="soft"
        style={{
          padding: "20px",
          backgroundColor: "white",
          boxShadow: "0 0 3px 0 #555555",
          marginTop: "5%",
          marginBottom: "5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >{`${selectedAddress?.name}`}</Typography>
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >
          {selectedAddress?.add_line_1}
        </Typography>
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >
          {selectedAddress?.add_line_2}
        </Typography>
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >{`${selectedAddress?.city} ,${selectedAddress?.state}`}</Typography>
        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >
          Pincode : {`${selectedAddress?.pincode}`}
        </Typography>

        <Typography
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: "0.8rem",
          }}
        >
          Phone : {selectedAddress?.mobile}
        </Typography>
      </Card>
    </Box>
  );
};

export default PaymentMethod;
