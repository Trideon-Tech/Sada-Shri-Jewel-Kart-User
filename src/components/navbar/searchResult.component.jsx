import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchIndex = location.state?.searchIndex || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (!value) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const filteredResults = searchIndex.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredResults);
    setShowDropdown(true);
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleItemClick = (result) => {
    setSearchTerm(result);
    setShowDropdown(false);
    navigate(`/jwellery/search?search=${result}`);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              width: "95%",
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "8px",
              flex: 1,
            }}
          >
            <SearchIcon style={{ color: "#a36e29", marginRight: "8px" }} />
            <InputBase
              inputRef={searchInputRef}
              placeholder="Search for Jewellery..."
              style={{
                width: "100%",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (searchTerm) {
                    navigate(`/jwellery/search?search=${searchTerm}`);
                  }
                }
              }}
            />
          </div>
          <IconButton onClick={handleClose} style={{ marginLeft: "8px" }}>
            <CloseIcon />
          </IconButton>
        </div>

        {showDropdown && searchResults.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto",
              mt: 1,
              boxShadow: "none",
            }}
          >
            <List>
              {searchResults.map((result, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleItemClick(result)}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                    }}
                  >
                    {result}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchResult;
