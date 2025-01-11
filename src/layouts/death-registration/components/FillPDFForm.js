import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button, TextField, Container, Typography } from "@mui/material";

const FillPDFForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    dateOfDeath: "",
    placeOfDeath: "",
    causeOfDeath: "",
    funeralDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = async () => {
    try {
      const url = "/bi132.pdf"; // PDF path in the `public` folder
      const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      // Debugging: log available fields in the PDF
      const fields = form.getFields();
      fields.forEach((field) => console.log("Field name:", field.getName()));

      // Update field values (replace field names with actual ones from your PDF)
      form.getTextField("name_field").setText(formData.name || "");
      form.getTextField("id_field").setText(formData.idNumber || "");
      form.getTextField("date_field").setText(formData.dateOfDeath || "");
      form.getTextField("place_field").setText(formData.placeOfDeath || "");
      form.getTextField("cause_field").setText(formData.causeOfDeath || "");
      form.getTextField("funeral_date_field").setText(formData.funeralDate || "");

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "filled-bi132.pdf";
      link.click();
    } catch (error) {
      console.error("Error filling or saving PDF:", error);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fill BI132 Form
      </Typography>
      <form>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="ID Number"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Date of Death"
          name="dateOfDeath"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.dateOfDeath}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Place of Death"
          name="placeOfDeath"
          value={formData.placeOfDeath}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Cause of Death"
          name="causeOfDeath"
          value={formData.causeOfDeath}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Funeral Date"
          name="funeralDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.funeralDate}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download Filled Form
        </Button>
      </form>
    </Container>
  );
};

export default FillPDFForm;
