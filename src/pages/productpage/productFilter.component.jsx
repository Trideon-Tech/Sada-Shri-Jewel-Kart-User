import Checkbox from "@mui/joy/Checkbox";
import React, { useState } from "react";
import "./productFilter.styles.scss";

const PriceFilter = ({ onFilterChange }) => {
  const [rangeList, setRangeList] = useState([]);

  const priceRanges = [
    { id: 1, label: "₹10,001 - ₹20,000", low: 10000, high: 20000 },
    { id: 2, label: "₹20,001 - ₹30,000", low: 20001, high: 30000 },
    { id: 3, label: "₹30,001 - ₹40,000", low: 30001, high: 40000 },
    { id: 4, label: "₹40,001 - ₹50,000", low: 40001, high: 50000 },
    { id: 5, label: "₹60,001 - ₹80,000", low: 60001, high: 80000 },
    {
      id: 6,
      label: "₹80,001 - ₹1,00,000",
      low: 80001,
      high: 100000,
    },
    {
      id: 7,
      label: "₹1,00,001 - ₹1,50,000",
      low: 100001,
      high: 150000,
    },
    {
      id: 8,
      label: "₹1,50,001 - ₹2,50,000",
      low: 150001,
      high: 250000,
    },
    { id: 9, label: "Over ₹2,50,000", count: 1, low: 250001, high: 100000000 },
  ];

  const handleCheckboxChange = (event, range) => {
    const isChecked = event.target.checked;
    let selectedRanges = [];

    if (isChecked) {
      selectedRanges = [...rangeList, range];
    } else {
      selectedRanges = rangeList.filter((item) => item.id !== range.id);
    }

    setRangeList(selectedRanges);

    onFilterChange(selectedRanges);
  };

  return (
    <div className="price-filter">
      <div
        className="filter-heading"
        style={{
          textAlign: "left",
          fontFamily: '"Open Sans", sans-serif',
          fontSize: "1rem",
        }}
      >
        Price
      </div>
      {priceRanges.map((range) => (
        <div key={range.id} className="price-option">
          <label>
            <Checkbox
              checked={rangeList?.label?.includes(range.label)}
              onChange={(event) => handleCheckboxChange(event, range)}
              color="warning"
            />
            <span
              className="label-text"
              style={{
                marginLeft: "30px",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "0.8rem",
                color: "grey",
              }}
            >
              {range.label}
            </span>
            <span className="count"></span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default PriceFilter;
