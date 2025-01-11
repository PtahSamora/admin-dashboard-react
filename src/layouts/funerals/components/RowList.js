import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Paper,
  Modal,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../../firebase"; // Adjust the path to match your Firebase configuration file

const RowList = ({ funerals, staff, onUpdateFuneral, onDeleteFuneral }) => {
  const [selectedFuneral, setSelectedFuneral] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleRowClick = (funeral) => {
    setSelectedFuneral(funeral);
    setSelectedTask(
      funeral.tasks.find((task) => task.status === "Working on It") ||
        funeral.tasks.find((task) => task.status === "To Be Done")
    );
  };

  const handleCloseModal = () => {
    setSelectedFuneral(null);
    setSelectedTask(null);
  };

  const handleDeleteFuneral = async () => {
    try {
      // Remove the funeral from local state
      onUpdateFuneral(selectedFuneral.id, null); // Use null to indicate deletion

      // Close the modal
      handleCloseModal();

      console.log("Funeral removed successfully.");
    } catch (error) {
      console.error("Error removing funeral:", error);
      alert("Failed to remove the funeral. Please try again.");
    }
  };

  const saveFuneral = async (funeral) => {
    try {
      if (!funeral.firebaseId) {
        // If the funeral doesn't already exist in Firebase, create a new document
        const funeralDocRef = doc(collection(db, "funerals"));
        await setDoc(funeralDocRef, funeral);
        console.log("Funeral saved with ID:", funeralDocRef.id);
      } else {
        // Update the existing funeral document in Firebase
        const funeralDocRef = doc(db, "funerals", funeral.firebaseId);
        await updateDoc(funeralDocRef, funeral);
        console.log("Funeral updated with ID:", funeral.firebaseId);
      }
    } catch (error) {
      console.error("Error saving funeral:", error);
      throw new Error("Failed to save funeral");
    }
  };

  const handleAssigneeChange = (event, task) => {
    task.assignedTo = event.target.value;
    setSelectedFuneral((prev) => ({
      ...prev,
      tasks: [...prev.tasks],
    }));
  };

  const handleStatusChange = (event, task) => {
    task.status = event.target.value;
    setSelectedFuneral((prev) => ({
      ...prev,
      tasks: [...prev.tasks],
    }));
  };
  const handleTaskFieldChange = (index, field, value) => {
    const updatedTasks = [...selectedFuneral.tasks];
    updatedTasks[index][field] = value;
    setSelectedFuneral((prev) => ({
      ...prev,
      tasks: updatedTasks,
    }));
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = selectedFuneral.tasks.filter((_, i) => i !== index);
    setSelectedFuneral((prev) => ({
      ...prev,
      tasks: updatedTasks,
    }));
  };

  const handleRemoveFuneral = async () => {
    try {
      // Remove the funeral from Firebase
      if (selectedFuneral.firebaseId) {
        const funeralDocRef = doc(db, "funerals", selectedFuneral.firebaseId);
        await deleteDoc(funeralDocRef);
      }

      // Remove the funeral from local state
      onUpdateFuneral(selectedFuneral.id, null); // Use null to indicate deletion

      // Close the modal
      handleCloseModal();

      console.log("Funeral removed successfully.");
    } catch (error) {
      console.error("Error removing funeral:", error);
      alert("Failed to remove the funeral. Please try again.");
    }
  };

  const sendWhatsAppMessage = (task) => {
    if (!task.assignedTo) {
      alert("Please assign the task to a patron first.");
      return;
    }

    const assignedPatron = staff.find((member) => member.name === task.assignedTo);

    if (!assignedPatron || !assignedPatron.phoneNumber) {
      alert("The assigned patron does not have a valid phone number.");
      return;
    }

    const message = `
  Good day ${assignedPatron.name},
  
  The task "${task.name}" has been assigned to you by your manager. The status of the task is currently set to "${task.status}". Please respond with a status update (working on it/completed) to your manager as soon as you progress through the task.
  
  Good Luck,
  Your Manager`;

    const whatsappUrl = `https://wa.me/${assignedPatron.phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const sendWhatsAppUpdateMessage = (task) => {
    if (!task.assignedTo) {
      alert("Please assign the task to a patron first.");
      return;
    }

    const assignedPatron = staff.find((member) => member.name === task.assignedTo);

    if (!assignedPatron || !assignedPatron.phoneNumber) {
      alert("The assigned patron does not have a valid phone number.");
      return;
    }

    let message = "";
    if (task.status === "Working on It") {
      message = `
  Hello ${assignedPatron.name},
  
  The task "${task.name}" you are working on is still marked as "Working on It". Please ensure to update the status once it's completed.
  
  Thank you,
  Your Manager`;
    } else if (task.status === "Completed") {
      message = `
  Hello ${assignedPatron.name},
  
  Thank you for completing the task "${task.name}". Great work!
  
  Best regards,
  Your Manager`;
    } else {
      alert("The task status must be 'Working on It' or 'Completed' to send a status update.");
      return;
    }

    const whatsappUrl = `https://wa.me/${assignedPatron.phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSave = async () => {
    try {
      const updatedFuneral = { ...selectedFuneral };
      // Remove undefined fields before saving
      Object.keys(updatedFuneral).forEach((key) => {
        if (updatedFuneral[key] === undefined) {
          delete updatedFuneral[key];
        }
      });

      if (!updatedFuneral.firebaseId) {
        // If no firebaseId, create a new document
        const funeralDocRef = doc(collection(db, "funerals"));
        await setDoc(funeralDocRef, { ...updatedFuneral, firebaseId: funeralDocRef.id });
        updatedFuneral.firebaseId = funeralDocRef.id; // Update firebaseId in local state
        console.log("Funeral created with ID:", funeralDocRef.id);
      } else {
        // Update the existing document
        const funeralDocRef = doc(db, "funerals", updatedFuneral.firebaseId);
        await updateDoc(funeralDocRef, updatedFuneral);
        console.log("Funeral updated with ID:", updatedFuneral.firebaseId);
      }

      onUpdateFuneral(updatedFuneral.id, updatedFuneral); // Update UI state
      handleCloseModal();
      console.log("Funeral saved successfully.");
    } catch (error) {
      console.error("Error saving funeral:", error);
      alert("Failed to save funeral. Please try again.");
    }
  };

  const handleFuneralFieldChange = (field, value) => {
    setSelectedFuneral((prev) => ({ ...prev, [field]: value }));
  };

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("To Be Done");
  const [newTaskAssignee, setNewTaskAssignee] = useState(""); // For assigning to patrons

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      alert("Task name is required!");
      return;
    }

    const newTask = {
      id: Date.now(), // Unique task ID
      name: newTaskName.trim(),
      status: newTaskStatus,
      assignedTo: newTaskAssignee || "",
    };

    const updatedTasks = [...selectedFuneral.tasks, newTask];
    setSelectedFuneral((prev) => ({
      ...prev,
      tasks: updatedTasks,
    }));

    // Reset fields
    setNewTaskName("");
    setNewTaskStatus("To Be Done");
    setNewTaskAssignee("");
  };

  return (
    <Box>
      {/* Funeral Rows */}
      {funerals.map((funeral) => {
        const funeralDate = new Date(funeral.funeralDate);
        const isAmberShade = Date.now() - funeralDate.getTime() < 2 * 24 * 60 * 60 * 1000;

        return (
          <Paper
            key={funeral.id}
            sx={{
              p: 2,
              mb: 2,
              cursor: "pointer",
              bgcolor: isAmberShade ? "amber.100" : "background.default",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
            onClick={() => handleRowClick(funeral)}
          >
            <Typography variant="h6">{funeral.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Funeral Date: {funeral.funeralDate || "Not Set"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Address: {funeral.address || "Not Set"}
            </Typography>
          </Paper>
        );
      })}

      {/* Modal for Editing Funeral */}
      {selectedFuneral && (
        <Modal open={!!selectedFuneral} onClose={handleCloseModal}>
          <Box
            sx={{
              width: 600,
              bgcolor: "background.paper",
              p: 4,
              mx: "auto",
              mt: 10,
              borderRadius: 2,
              boxShadow: 24,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" mb={2}>
              Edit Funeral
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deceased Name"
                  value={selectedFuneral.name || ""}
                  onChange={(e) => handleFuneralFieldChange("name", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Home Address"
                  value={selectedFuneral.address || ""}
                  onChange={(e) => handleFuneralFieldChange("address", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Church Address"
                  value={selectedFuneral.churchAddress || ""}
                  onChange={(e) => handleFuneralFieldChange("churchAddress", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cemetery Address"
                  value={selectedFuneral.cemeteryAddress || ""}
                  onChange={(e) => handleFuneralFieldChange("cemeteryAddress", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedFuneral.birthDate || ""}
                  onChange={(e) => handleFuneralFieldChange("birthDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Death Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedFuneral.deathDate || ""}
                  onChange={(e) => handleFuneralFieldChange("deathDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Funeral Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={selectedFuneral.funeralDate || ""}
                  onChange={(e) => handleFuneralFieldChange("funeralDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sex at Death"
                  value={selectedFuneral.sexAtDeath || ""}
                  onChange={(e) => handleFuneralFieldChange("sexAtDeath", e.target.value)}
                  select
                  sx={{
                    width: "250px", // Adjust width
                    height: "45px", // Adjust height
                  }}
                  InputProps={{
                    style: {
                      height: "60px", // Adjust input height
                    },
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cause of Death"
                  value={selectedFuneral.causeOfDeath || ""}
                  onChange={(e) => handleFuneralFieldChange("causeOfDeath", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Family Contact Name"
                  value={selectedFuneral.familyContactName || ""}
                  onChange={(e) => handleFuneralFieldChange("familyContactName", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Family Contact Number"
                  value={selectedFuneral.familyContactNumber || ""}
                  onChange={(e) => handleFuneralFieldChange("familyContactNumber", e.target.value)}
                />
              </Grid>

              {/* Tasks Section */}
              {/* Tasks Section */}
              <Grid item xs={12}>
                <Typography variant="h6" mb={2}>
                  Tasks
                </Typography>
                {selectedFuneral.tasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 2, p: 2 }}
                  >
                    <Typography variant="body1">Task Name:</Typography>
                    <TextField
                      fullWidth
                      value={task.name}
                      onChange={(e) =>
                        setSelectedFuneral((prev) => ({
                          ...prev,
                          tasks: prev.tasks.map((t) =>
                            t.id === task.id ? { ...t, name: e.target.value } : t
                          ),
                        }))
                      }
                    />
                    <Typography variant="body1" mt={1}>
                      Status:
                    </Typography>
                    <Select
                      fullWidth
                      value={task.status}
                      onChange={(e) =>
                        setSelectedFuneral((prev) => ({
                          ...prev,
                          tasks: prev.tasks.map((t) =>
                            t.id === task.id ? { ...t, status: e.target.value } : t
                          ),
                        }))
                      }
                    >
                      <MenuItem value="To Be Done">To Be Done</MenuItem>
                      <MenuItem value="Working on It">Working on It</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                    <Typography variant="body1" mt={1}>
                      Assigned To:
                    </Typography>
                    <Select
                      fullWidth
                      value={task.assignedTo || ""}
                      onChange={(e) =>
                        setSelectedFuneral((prev) => ({
                          ...prev,
                          tasks: prev.tasks.map((t) =>
                            t.id === task.id ? { ...t, assignedTo: e.target.value } : t
                          ),
                        }))
                      }
                    >
                      {staff.map((member) => (
                        <MenuItem key={member.id} value={member.name}>
                          {member.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2, color: "green" }}
                        onClick={() => sendWhatsAppMessage(task)}
                      >
                        Send Initial Message
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2, color: "green" }}
                        onClick={() => sendWhatsAppUpdateMessage(task)}
                      >
                        Send Status Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 2, color: "green" }}
                        onClick={() => {
                          setSelectedFuneral((prev) => ({
                            ...prev,
                            tasks: prev.tasks.filter((t) => t.id !== task.id),
                          }));
                        }}
                      >
                        Remove Task
                      </Button>
                    </Box>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    setSelectedFuneral((prev) => ({
                      ...prev,
                      tasks: [
                        ...prev.tasks,
                        { id: Date.now(), name: "", status: "To Be Done", assignedTo: "" },
                      ],
                    }))
                  }
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2, width: "100%" }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1, width: "100%" }}
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1, width: "50%" }}
              onClick={handleDeleteFuneral}
            >
              Remove Funeral
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1, width: "50%" }}
              onClick={handleRemoveFuneral}
            >
              Delete Funeral
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

RowList.propTypes = {
  funerals: PropTypes.array.isRequired,
  staff: PropTypes.array.isRequired,
  onUpdateFuneral: PropTypes.func.isRequired,
  onDeleteFuneral: PropTypes.func.isRequired,
};

export default RowList;
