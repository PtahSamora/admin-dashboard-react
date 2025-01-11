import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const FridgeDetailsModal = ({ open, deceased, id, onClose, onSave, onRemove }) => {
  const [isOccupied, setIsOccupied] = useState(!!deceased.name);
  const [formData, setFormData] = useState({
    name: deceased.name || "",
    address: deceased.address || "",
    dateOfDeath: deceased.dateOfDeath || "",
    funeralDate: deceased.funeralDate || "",
    picture: deceased.picture || "",
  });

  useEffect(() => {
    setIsOccupied(!!deceased.name);
    setFormData({
      name: deceased.name || "",
      address: deceased.address || "",
      dateOfDeath: deceased.dateOfDeath || "",
      funeralDate: deceased.funeralDate || "",
      picture: deceased.picture || "",
    });
  }, [deceased]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, picture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePicture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = 150;
      canvas.height = 150;

      setTimeout(() => {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const photo = canvas.toDataURL("image/png");
        setFormData((prev) => ({ ...prev, picture: photo }));

        stream.getTracks().forEach((track) => track.stop());
      }, 3000); // Capture after 3 seconds
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const handleSave = () => {
    onSave({ ...formData, id });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          margin: "auto",
          marginTop: "5%",
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "90vh",
          overflowY: "auto", // Make the modal scrollable if content overflows
        }}
      >
        <Typography variant="h6" gutterBottom>
          {isOccupied ? "Details of Deceased" : "Add Deceased Details"}
        </Typography>

        {formData.picture && (
          <img
            src={formData.picture}
            alt="Uploaded"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}

        {!isOccupied ? (
          <>
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="contained"
                color="primary"
                component="label"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Upload Picture
                <input type="file" accept="image/*" hidden onChange={handlePictureUpload} />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleTakePicture}
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Take Picture
              </Button>
            </Box>

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date of Death"
              name="dateOfDeath"
              type="date"
              value={formData.dateOfDeath}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Funeral Date"
              name="funeralDate"
              type="date"
              value={formData.funeralDate}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
                marginTop: 2,
              }}
              fullWidth
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" mt={2}>
              <strong>Name:</strong> {formData.name}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {formData.address}
            </Typography>
            <Typography variant="body1">
              <strong>Date of Death:</strong> {formData.dateOfDeath}
            </Typography>
            <Typography variant="body1">
              <strong>Funeral Date:</strong> {formData.funeralDate}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onRemove(id)}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
                marginTop: 2,
              }}
              fullWidth
            >
              Remove Details
            </Button>
          </>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": { backgroundColor: "#333" },
            marginTop: 2,
          }}
          fullWidth
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

FridgeDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  deceased: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    dateOfDeath: PropTypes.string,
    funeralDate: PropTypes.string,
    picture: PropTypes.string,
  }),
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FridgeDetailsModal;
