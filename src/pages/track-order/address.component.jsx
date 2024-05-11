import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

const AddressCard = ({ address }) => {
  return (
    <Box style={{ width: "40%" }}>
      <Typography variant="h5" color="#707070">
        {address.name}
      </Typography>
      <Card style={{ backgroundColor: "#fcbd6a", width: "100%" }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {address.addressLine1}
          </Typography>
          {address.addressLine2 && (
            <Typography variant="body2" color="textSecondary">
              {address.addressLine2}
            </Typography>
          )}
          <Typography variant="body2" color="textSecondary">
            {address.city}, {address.state} {address.zip}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddressCard;
