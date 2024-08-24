import { Box, Typography, Card } from "@mui/material";
import Radio from "@mui/joy/Radio";
import CreditCardIcon from "@mui/icons-material/CreditCard";
const PaymentMethod = ({
  setPaymentMethod,
  paymentMethod,
  selectedAddress,
}) => {
  console.log("selectedAddress", selectedAddress);
  return (
    <Box>
      {/* <Card
        variant="soft"
        style={{
          display: "flex",
          minHeight: 50,
          paddingLeft: "30px",
          paddingRight: "30px",
          marginTop: "3%",
          marginBottom: "5%",
          flexDirection: "row",
          boxShadow: "0 0 3px 0 #555555",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setPaymentMethod("CREDIT_CARD")}
      >
        <CreditCardIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
        <Typography
          variant="body"
          style={{ fontWeight: "bold", marginRight: "auto", marginLeft: "3%" }}
        >
          Credit Card
        </Typography>

        <Radio color="warning" checked={paymentMethod === "CREDIT_CARD"} />
      </Card>
      <Card
        variant="soft"
        style={{
          display: "flex",
          minHeight: 50,
          paddingLeft: "30px",
          paddingRight: "30px",
          marginTop: "3%",
          marginBottom: "5%",
          flexDirection: "row",
          boxShadow: "0 0 3px 0 #555555",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setPaymentMethod("DEBIT_CARD")}
      >
        <CreditCardIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
        <Typography
          variant="body"
          style={{ fontWeight: "bold", marginRight: "auto", marginLeft: "3%" }}
        >
          Debit Card
        </Typography>

        <Radio color="warning" checked={paymentMethod === "DEBIT_CARD"} />
      </Card>
      <Card
        variant="soft"
        style={{
          display: "flex",
          minHeight: 50,
          paddingLeft: "30px",
          paddingRight: "30px",
          marginTop: "3%",
          marginBottom: "5%",
          flexDirection: "row",
          boxShadow: "0 0 3px 0 #555555",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setPaymentMethod("UPI")}
      >
        <CreditCardIcon style={{ fontSize: "2rem", color: "#A36E29" }} />
        <Typography
          variant="body"
          style={{ fontWeight: "bold", marginRight: "auto", marginLeft: "3%" }}
        >
          UPI
        </Typography>

        <Radio color="warning" checked={paymentMethod === "UPI"} />
      </Card> */}
      <Card
        orientation="Verticle"
        size="sm"
        variant="soft"
        style={{
          padding: "30px",
          backgroundColor: "white",
          boxShadow: "0 0 3px 0 #555555",
          marginTop: "5%",
          marginBottom: "5%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            level="body-lg"
            style={{ fontWeight: "bold" }}
          >{`${selectedAddress?.name}`}</Typography>
        </Box>
        <Typography level="body-lg">{selectedAddress?.add_line_1}</Typography>
        <Typography level="body-lg">{selectedAddress?.add_line_2}</Typography>
        <Typography level="body-lg">{`${selectedAddress?.city} ,${selectedAddress?.state}`}</Typography>
        <Typography level="body-lg">
          Pincode : {`${selectedAddress?.pincode}`}
        </Typography>

        <Typography level="body-lg">
          {" "}
          Phone :{selectedAddress?.mobile}
        </Typography>
      </Card>
    </Box>
  );
};

export default PaymentMethod;
