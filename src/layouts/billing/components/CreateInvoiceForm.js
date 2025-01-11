import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, TextField, Button } from "@mui/material";

function CreateInvoiceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    items: "",
    totalAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: Date.now(), status: "Pending" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Items"
            name="items"
            value={formData.items}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Total Amount"
            name="totalAmount"
            type="number"
            value={formData.totalAmount}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="text" color="error" onClick={onCancel} style={{ marginLeft: 10 }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

CreateInvoiceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateInvoiceForm;
