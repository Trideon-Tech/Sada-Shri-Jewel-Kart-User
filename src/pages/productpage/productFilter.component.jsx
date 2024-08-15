import React, { useEffect, useState } from "react";
import "./productFilter.styles.scss";
import Checkbox from "@mui/joy/Checkbox";
import { Box, Slider, Typography } from "@mui/material";

const PriceFilter = ({
  selectedPriceRange,
  handleSelectedPriceRange,
  onFilterChange,
  weightFilter,
  purityFilter,
  heightFilter,
  widthFilter,
  handleWeightFilter,
  handlePurityFilter,
  handleHeightFilter,
  handleWidthFilter,
}) => {
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

  // const [selectedPrice]

  useEffect(() => {
    const finalRange = getHighLow(rangeList);
    handleSelectedPriceRange(finalRange);
    console.log(finalRange);
    console.log("rangeList", rangeList);
  }, [rangeList]);

  const getHighLow = (rangeListL) => {
    if (!rangeList.length) {
      return {
        high: 100000000,
        low: 0,
      };
    }
    let minVal = 1000000;
    let maxVal = 0;
    for (let range of rangeListL) {
      minVal = Math.min(range.low, minVal);
      maxVal = Math.max(range.high, maxVal);
    }
    return {
      high: maxVal,
      low: minVal,
    };
  };

  const handleCheckboxChange = (event, range) => {
    if (!rangeList.length) {
      handleSelectedPriceRange(range);

      setRangeList([{ high: range.high, low: range.low }]);
      // setRangeList(rangeList.low);
      onFilterChange(range.label);

      return;
    }

    console.log("curr low high", range.low, range.high);
    const found = rangeList.find((item) => item.low === range.low);
    if (found) {
      setRangeList(rangeList.filter((item) => item.low !== range.low));
    } else {
      setRangeList([...rangeList, { high: range.high, low: range.low }]);
    }
    onFilterChange(range.label);
  };

  const handleCheckboxChangeO = (event, range) => {
    console.log("event", event.target.checked);
    // Call the passed in `onFilterChange` function with the label of the clicked checkbox
    console.log(range);
    let minVal;
    let maxVal;
    console.log(selectedPriceRange);
    if (Object.keys(selectedPriceRange).length) {
      if (event.target.checked) {
        minVal = Math.min(range.low, selectedPriceRange.low);
        maxVal = Math.max(range.high, selectedPriceRange.high);
      } else {
        if (
          range.low > selectedPriceRange.low &&
          range.hight < selectedPriceRange.high
        )
          return;

        if (range.low === selectedPriceRange.low) {
          minVal = Math.min(range.high, range.high);
          maxVal = selectedPriceRange.high;
          return;
        }
        if (range.high === selectedPriceRange.high) {
          minVal = selectedPriceRange.low;
          maxVal = Math.max(selectedPriceRange.high, selectedPriceRange.high);
          return;
        }
      }

      range.low = minVal;
      range.high = maxVal;
    }

    console.log("range", range);

    handleSelectedPriceRange(range);

    onFilterChange(range.label);
  };
  const handleWeightChange = (event, newValue) => {
    handleWeightFilter(newValue);
  };

  const handleHeightChange = (event, newValue) => {
    handleHeightFilter(newValue);
  };

  const handleWidthChange = (event, newValue) => {
    handleWidthFilter(newValue);
  };

  const handlePurityChange = (event, newValue) => {
    handlePurityFilter(newValue);
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
              checked={selectedPriceRange?.label?.includes(range.label)}
              onChange={(event) => handleCheckboxChange(event, range)}
              color="warning"
            />

            <span className="label-text" style={{ marginLeft: "30px" }}>
              {" "}
              {range.label}
            </span>
            <span className="count"></span>
          </label>
        </div>
      ))}
      <div
        className="filter-heading"
        style={{ textAlign: "left", marginTop: "100px" }}
      >
        Weight
      </div>

      <Box sx={{ width: 300 }}>
        <Slider
          max={100}
          getAriaLabel={() => "Temperature range"}
          value={weightFilter}
          onChange={handleWeightChange}
          valueLabelDisplay="auto"
          sx={{ color: "#a36e29" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {weightFilter[0]} gms
          </Typography>

          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {weightFilter[1]} gms
          </Typography>
        </Box>
      </Box>

      <div
        className="filter-heading"
        style={{ textAlign: "left", marginTop: "100px" }}
      >
        Purity
      </div>

      <Box sx={{ width: 300 }}>
        <Slider
          max={24}
          min={16}
          getAriaLabel={() => "Temperature range"}
          value={purityFilter}
          onChange={handlePurityChange}
          valueLabelDisplay="auto"
          sx={{ color: "#a36e29" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {purityFilter[0]} KT
          </Typography>

          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {purityFilter[1]} KT
          </Typography>
        </Box>
      </Box>
      <div
        className="filter-heading"
        style={{ textAlign: "left", marginTop: "100px" }}
      >
        Height
      </div>

      <Box sx={{ width: 300 }}>
        <Slider
          max={50}
          getAriaLabel={() => "Temperature range"}
          value={heightFilter}
          onChange={handleHeightChange}
          valueLabelDisplay="auto"
          sx={{ color: "#a36e29" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {heightFilter[0]} cm
          </Typography>

          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {heightFilter[1]} cm
          </Typography>
        </Box>
      </Box>

      <div
        className="filter-heading"
        style={{ textAlign: "left", marginTop: "100px" }}
      >
        Width
      </div>

      <Box sx={{ width: 300 }}>
        <Slider
          max={50}
          getAriaLabel={() => "Temperature range"}
          value={widthFilter}
          onChange={handleWidthChange}
          valueLabelDisplay="auto"
          sx={{ color: "#a36e29" }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {widthFilter[0]} cm
          </Typography>

          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            {widthFilter[1]} cm
          </Typography>
        </Box>
      </Box>
      {/* <div className="show-more">Show Less</div> */}
    </div>
  );
};

export default PriceFilter;
