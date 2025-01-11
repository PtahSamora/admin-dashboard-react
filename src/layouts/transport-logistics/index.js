import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Modal,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import RouteMap from "./components/RouteMap";
import { funeralsData } from "../funerals/data/funeralsData";
import { patreonsData } from "./data/patreonsData"; // Assuming patreons data exists

const TransportLogistics = () => {
  const [selectedFuneral, setSelectedFuneral] = useState(null);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [showRoute, setShowRoute] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedPatreon, setSelectedPatreon] = useState(null); // State for selected patreon

  const handleSelectFuneral = (funeralId) => {
    const funeral = funeralsData.find((f) => f.id === parseInt(funeralId, 10));
    setSelectedFuneral(funeral);
    setFromAddress("");
    setToAddress("");
    setShowRoute(false);
  };

  const handlePlotRoute = () => {
    if (fromAddress && toAddress) {
      setShowRoute(true);
    } else {
      alert("Please select both &#39;From&#39; and &#39;To&#39; addresses.");
    }
  };

  const handleSendRoute = () => {
    setShowModal(true);
  };

  const handleSendWhatsApp = () => {
    if (selectedPatreon && fromAddress && toAddress) {
      const message = `Hello ${selectedPatreon.name},
      
      Here is the transport route you need to follow:
      From: ${fromAddress}
      To: ${toAddress}
      Estimated Time of Arrival (ETA): [Insert ETA here].

      Please confirm your task.`;

      const whatsappUrl = `https://wa.me/${selectedPatreon.phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
      setShowModal(false);
    } else {
      alert("Please select a patreon before sending the route.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Transport Logistics
        </Typography>

        {/* Funeral Selector */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1">Select Funeral:</Typography>
          <select
            value={selectedFuneral?.id || ""}
            onChange={(e) => handleSelectFuneral(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}
          >
            <option value="" disabled>
              Select Funeral
            </option>
            {funeralsData.map((funeral) => (
              <option key={funeral.id} value={funeral.id}>
                {funeral.name}
              </option>
            ))}
          </select>
        </Box>

        {/* From and To Selectors */}
        {selectedFuneral && (
          <>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1">From:</Typography>
              <select
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
              >
                <option value="" disabled>
                  Select From Address
                </option>
                <option value="Funeral Parlour Address">Funeral Parlour Address</option>
                <option value={selectedFuneral.address}>Deceased&#39;s Home Address</option>
                <option value={selectedFuneral.churchAddress}>Church Address</option>
                <option value={selectedFuneral.cemeteryAddress}>Cemetery Address</option>
              </select>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1">To:</Typography>
              <select
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                }}
              >
                <option value="" disabled>
                  Select To Address
                </option>
                <option value="Funeral Parlour Address">Funeral Parlour Address</option>
                <option value={selectedFuneral.address}>Deceased&#39;s Home Address</option>
                <option value={selectedFuneral.churchAddress}>Church Address</option>
                <option value={selectedFuneral.cemeteryAddress}>Cemetery Address</option>
              </select>
            </Box>

            {/* Plot Route Button */}
            <Button variant="contained" color="primary" onClick={handlePlotRoute}>
              Plot Route
            </Button>
          </>
        )}

        {/* Route Map */}
        {showRoute && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Route Map
            </Typography>
            <RouteMap origin={fromAddress} destination={toAddress} />

            {/* Send Route Button */}
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" color="secondary" onClick={handleSendRoute}>
                Send Route
              </Button>
            </Box>
          </Box>
        )}

        {/* Modal for Selecting Patreon */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              mx: "auto",
              mt: 10,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h5" mb={2}>
              Select Driver
            </Typography>
            <List>
              {patreonsData.map((patreon) => (
                <ListItem
                  key={patreon.id}
                  button
                  onClick={() => setSelectedPatreon(patreon)}
                  sx={{
                    bgcolor: selectedPatreon?.id === patreon.id ? "grey.300" : "white",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={`${patreon.name} (${patreon.role})`}
                    secondary={`Phone: ${patreon.phoneNumber}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleSendWhatsApp}
            >
              Send Route
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 1, width: "100%" }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </Container>
      <Footer />
    </DashboardLayout>
  );
};

export default TransportLogistics;
