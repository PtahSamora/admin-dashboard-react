import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";

const FridgeDrawer = ({ deceased, id, onOpen }) => {
  const handleClick = () => onOpen(deceased, id);

  return (
    <Card
      onClick={handleClick}
      sx={{
        background: "linear-gradient(145deg, #e0e0e0, #f0f0f0)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        position: "relative",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 6px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        },
        minHeight: "180px",
        minWidth: "120px",
        padding: "16px",
      }}
    >
      {/* Fridge Number */}
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "8px",
          left: "8px",
          fontWeight: "bold",
          color: "#666",
        }}
      >
        {id}
      </Typography>

      {/* Simulating the handle */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: "-10px",
          transform: "translateY(-50%)",
          width: "8px",
          height: "60px",
          backgroundColor: "#b0b0b0",
          borderRadius: "4px",
        }}
      />

      {/* Simulating the hinge */}
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "-5px",
          width: "6px",
          height: "30px",
          backgroundColor: "#d0d0d0",
          borderRadius: "3px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          left: "-5px",
          width: "6px",
          height: "30px",
          backgroundColor: "#d0d0d0",
          borderRadius: "3px",
        }}
      />

      <CardContent>
        {deceased ? (
          <>
            <Typography
              variant="h6"
              sx={{ color: "#333", textAlign: "center", fontWeight: "bold" }}
            >
              Occupied
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1, fontWeight: "bold" }}>
              Name: {deceased.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 0.5 }}>
              Address: {deceased.address}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 0.5 }}>
              Funeral Date: {deceased.funeralDate}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" sx={{ color: "#333", textAlign: "center", fontWeight: "bold" }}>
            Empty
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

FridgeDrawer.propTypes = {
  deceased: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    funeralDate: PropTypes.string,
    picture: PropTypes.string,
  }),
  id: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default FridgeDrawer;
