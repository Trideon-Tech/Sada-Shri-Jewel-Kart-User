import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import cardImageForMobile from "../../assets/images/cardImageForMobile.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ButtonComponent from "../button/button.component";
import Collapse from "@mui/material/Collapse";
import { Box } from "@mui/material";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));
const Schemes_CardForMobile = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card sx={{ maxWidth: 561, margin: "10px 20px" }}>
      <CardMedia
        sx={{
          height: { xs: 180, sm: 200 },
          width: "100%",
          objectFit: "cover",
          // This will make the image fill the area
        }}
        image={cardImageForMobile}
        title="green iguana"
      />
      <CardContent>
        <Typography
          gutterBottom
          sx={{
            color: "#A36E29",
            fontFamily: "Open Sans",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          Scheme 1:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#000000",
            fontFamily: "Open Sans",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          Turn Daily Savings into Timeless Treasures{" "}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Typography>
      </CardContent>
      <CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              
              justifyContent:"center",
              alignItems:"center"
             
            }}
          >
            <ButtonComponent
              buttonText={"Join Now"}
              style={{
                maxWidth: "380px",
                minWidth: "250px",
                height: "27px",
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
                //   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                //transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            />
          </Box>
          <CardContent>
            <ul
              style={{
                fontFamily: "open sans",
                fontWeight: "600",
                fontSize: "17px",
                margin:"0px 10px"
              }}
            >
              <li>Save as little as ₹100/day—no limits, no restrictions!</li>
              <br />
              <li>Shop anytime with your savings—no waiting, no tenure</li>
              <br />

              <li>
                Get 10% OFF on making charges for gold jewelry, diamond jewelry,
                and silver articles.
              </li>
              <br />
              <li>Prices based on the prevailing market rate at purchase</li>
            </ul>
            <Box sx={{ backgroundColor: "#F9F5EC" ,padding:"3px 5px",margin:"15px 15px"}}>
              <Typography sx={{textAlign:"center"}}>
                Join the
                <strong style={{ color: "#A36E29" }}>
                  
                  SadāShrī Jewelkart
                </strong>{" "}
                Daily Gold Savings Scheme Today
                <strong style={{ color: "#A36E29" }}> Save Now.</strong> Shine
                Forever
              </Typography>
            </Box>
          </CardContent>
        </Collapse>
      </CardActions>
    </Card>
  );
};

export default Schemes_CardForMobile;
