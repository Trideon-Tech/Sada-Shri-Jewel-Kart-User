import React from "react";
import "./productFilter.styles.scss";
import Checkbox from "@mui/joy/Checkbox";

const PriceFilter = ({ selectedPriceRanges, onFilterChange }) => {
  const priceRanges = [
    { id: 1, label: "₹10,001 - ₹20,000", count: 92, low: 10000, high: 20000 },
    { id: 2, label: "₹20,001 - ₹30,000", count: 158, low: 20001, high: 30000 },
    { id: 3, label: "₹30,001 - ₹40,000", count: 158, low: 30001, high: 40000 },
    { id: 4, label: "₹40,001 - ₹50,000", count: 158, low: 40001, high: 50000 },
    { id: 5, label: "₹60,001 - ₹80,000", count: 158, low: 60001, high: 80000 },
    {
      id: 6,
      label: "₹80,001 - ₹1,00,000",
      count: 158,
      low: 80001,
      high: 100000,
    },
    {
      id: 7,
      label: "₹1,00,001 - ₹1,50,000",
      count: 158,
      low: 100001,
      high: 150000,
    },
    {
      id: 8,
      label: "₹1,50,001 - ₹2,50,000",
      count: 158,
      low: 150001,
      high: 250000,
    },
    { id: 9, label: "Over ₹2,50,000", count: 1, low: 250001, high: 100000000 },
  ];

  const handleCheckboxChange = (label) => {
    // Call the passed in `onFilterChange` function with the label of the clicked checkbox
    onFilterChange(label);
  };

  return (
    <div className="price-filter">
      <div className="filter-heading" style={{ textAlign: "left" }}>
        Price
      </div>
      {priceRanges.map((range) => (
        <div key={range.id} className="price-option">
          <label>
            <Checkbox
              checked={selectedPriceRanges.includes(range.label)}
              onChange={() => handleCheckboxChange(range.label)}
              color="warning"
            />

            <span className="label-text" style={{ marginLeft: "30px" }}>
              {" "}
              {range.label}
            </span>
            <span className="count">({range.count})</span>
          </label>
        </div>
      ))}
      <div className="show-more">Show Less</div>
    </div>
  );
};

export default PriceFilter;
