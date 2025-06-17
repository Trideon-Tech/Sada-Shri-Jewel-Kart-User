import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

const Confirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedPlan, amount } = location.state || {};

  const handleConfirm = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/save-plan", {
        selectedPlan,
        amount,
      });

      console.log("Saved successfully:", response.data);
      navigate("/success"); // or wherever you want after saving
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!selectedPlan || !amount) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No data found</h2>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Confirm Your Details</h2>
      <p><strong>Selected Plan:</strong> {selectedPlan}</p>
      <p><strong>Amount:</strong> ₹{amount}</p>

      <Button
        variant="contained"
        style={{ marginTop: "20px" }}
        onClick={handleConfirm}
      >
        Confirm & Save
      </Button>
    </div>
  );
};

export default Confirm;
