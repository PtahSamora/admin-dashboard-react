import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DeathRegistrationForm from "./components/DeathRegistrationForm";
import DeathCertificatePreview from "./components/DeathCertificatePreview";

const DeathRegistration = () => {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <DeathRegistrationForm onSubmit={handleFormSubmit} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DeathCertificatePreview data={formData} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </DashboardLayout>
  );
};

export default DeathRegistration;
