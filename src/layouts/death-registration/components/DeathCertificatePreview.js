import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const DeathCertificatePreview = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ border: "1px solid gray", padding: 3, borderRadius: 2 }}>
        <Typography variant="h6" color="error">
          No data available to display the death certificate.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ border: "1px solid gray", padding: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Death Certificate
      </Typography>
      <Typography variant="body1">
        <strong>Name:</strong> {data.name}
      </Typography>
      <Typography variant="body1">
        <strong>Date of Death:</strong> {data.dateOfDeath}
      </Typography>
      <Typography variant="body1">
        <strong>Place of Death:</strong> {data.placeOfDeath}
      </Typography>
      <Typography variant="body1">
        <strong>Cause of Death:</strong> {data.causeOfDeath}
      </Typography>
      <Typography variant="body1">
        <strong>ID Number:</strong> {data.idNumber}
      </Typography>
      <Typography variant="body1">
        <strong>Funeral Date:</strong> {data.funeralDate}
      </Typography>
    </Box>
  );
};

// Add PropTypes validation
DeathCertificatePreview.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    dateOfDeath: PropTypes.string,
    placeOfDeath: PropTypes.string,
    causeOfDeath: PropTypes.string,
    idNumber: PropTypes.string,
    funeralDate: PropTypes.string,
  }),
};

export default DeathCertificatePreview;
