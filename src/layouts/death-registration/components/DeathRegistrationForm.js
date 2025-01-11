import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const DeathRegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    dateOfDeath: "",
    placeOfDeath: "",
    causeOfDeath: "",
    idNumber: "",
    contactInfo: "",
    funeralDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Box sx={{ padding: 4, borderRadius: 2, backgroundColor: "#f9f9f9", boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        Register a Death
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Date of Death"
            type="date"
            name="dateOfDeath"
            value={formData.dateOfDeath}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Place of Death"
            name="placeOfDeath"
            value={formData.placeOfDeath}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cause of Death"
            name="causeOfDeath"
            value={formData.causeOfDeath}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="ID/Passport Number"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Family Contact Information"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Funeral Date"
            type="date"
            name="funeralDate"
            value={formData.funeralDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeathRegistrationForm;

DeathRegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
