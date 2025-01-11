import React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import FridgeDrawer from "./FridgeDrawer";

const FridgeStack = ({ stackData, onOpen }) => (
  <Grid container spacing={1}>
    {stackData.map((drawer, index) => (
      <Grid
        item
        xs={12} // Full width on mobile
        sm={4} // Three columns for medium screens and larger
        key={drawer.id}
      >
        <FridgeDrawer id={drawer.id} deceased={drawer.deceased || null} onOpen={onOpen} />
      </Grid>
    ))}
  </Grid>
);

FridgeStack.propTypes = {
  stackData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      deceased: PropTypes.object,
    })
  ).isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default FridgeStack;
