import React, { useState } from "react";
import { Grid, Container, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FridgeStack from "./components/FridgeStack";
import FridgeDetailsModal from "./components/FridgeDetailsModal";
import initialFridgesData from "./data/morgueFridgesData";

const MorgueFridges = () => {
  const [fridges, setFridges] = useState(initialFridgesData);
  const [selectedFridge, setSelectedFridge] = useState(null);

  const handleOpenDetails = (deceased, id) => setSelectedFridge({ ...deceased, id });

  const handleCloseDetails = () => setSelectedFridge(null);

  const handleSaveDetails = (updatedDetails) => {
    setFridges((prev) =>
      prev.map((section) => ({
        ...section,
        stack: section.stack.map((drawer) =>
          drawer.id === updatedDetails.id ? { ...drawer, deceased: updatedDetails } : drawer
        ),
      }))
    );
    setSelectedFridge(null);
  };

  const handleRemoveDetails = (id) => {
    setFridges((prev) =>
      prev.map((section) => ({
        ...section,
        stack: section.stack.map((drawer) =>
          drawer.id === id ? { ...drawer, deceased: null } : drawer
        ),
      }))
    );
    setSelectedFridge(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Morgue Fridges
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{
            columnGap: "20px", // Column spacing
            rowGap: "20px", // Row spacing
          }}
        >
          {fridges.map((fridge, index) => (
            <Grid item xs={12} key={fridge.id}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Section {index + 1}
              </Typography>
              <Grid container spacing={0}>
                <FridgeStack stackData={fridge.stack} onOpen={handleOpenDetails} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
      {selectedFridge && (
        <FridgeDetailsModal
          open={!!selectedFridge}
          deceased={selectedFridge}
          id={selectedFridge.id}
          onClose={handleCloseDetails}
          onSave={handleSaveDetails}
          onRemove={handleRemoveDetails}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
};

export default MorgueFridges;
