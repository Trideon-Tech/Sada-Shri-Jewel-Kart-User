import React from "react";
import "./jwellerycard.styles.scss"; // Ensure this is the path to your SCSS file
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const JwelleryCard = ({ image, name, price, onClick }) => {
  return (
    <div className="jwellery-card" onClick={onClick}>
      <div className="card-image-container">
        <img
          src={encodeURI(`https://api.sadashrijewelkart.com/assets/${image}`)}
          alt={name}
          className="card-image"
        />
      </div>
      <div className="card-content">
        <Typography variant="h6" component="h2" className="card-title">
          {name}
        </Typography>
        <Typography variant="h5" component="p" className="card-price">
          ₹{price}
        </Typography>
        <Button variant="contained" className="add-to-cart-button">
          Add to Cart
        </Button>
        <div className="check-delivery">
          Check delivery date
        </div>
      </div>
    </div>
  );
};

export default JwelleryCard;

