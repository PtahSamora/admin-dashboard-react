import React from "react";
import PropTypes from "prop-types";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const FridgeSelector = ({ options, selectedOption, onSelect }) => (
  <FormControl fullWidth>
    <InputLabel>Select Deceased</InputLabel>
    <Select value={selectedOption || ""} onChange={(e) => onSelect(e.target.value)} displayEmpty>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

FridgeSelector.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      address: PropTypes.string,
    })
  ).isRequired,
  selectedOption: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default FridgeSelector;
