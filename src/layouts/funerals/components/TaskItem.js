import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust the path to your Firebase config

const TaskItem = ({ tasks, staff, onUpdateTasks, funeralFirebaseId }) => {
  const [open, setOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [taskList, setTaskList] = useState(tasks);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      alert("Task name is required!");
      return;
    }

    const newTask = {
      id: Date.now(), // Unique ID for the task
      name: newTaskName.trim(),
      status: "To Be Done",
      assignedTo: "",
    };

    const updatedTasks = [...taskList, newTask];
    setTaskList(updatedTasks);

    // Save to Firebase
    try {
      const funeralDocRef = doc(db, "funerals", funeralFirebaseId);
      await updateDoc(funeralDocRef, { tasks: updatedTasks });
      onUpdateTasks(updatedTasks); // Update the parent state
      console.log("New task added to Firebase:", newTask);
      setNewTaskName(""); // Clear the input field
    } catch (error) {
      console.error("Error adding task to Firebase:", error);
    }
  };

  // Update a task's status or assignment
  const handleUpdateTask = async (taskId, updatedFields) => {
    const updatedTasks = taskList.map((task) =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    );
    setTaskList(updatedTasks);

    // Save updates to Firebase
    try {
      const funeralDocRef = doc(db, "funerals", funeralFirebaseId);
      await updateDoc(funeralDocRef, { tasks: updatedTasks });
      onUpdateTasks(updatedTasks); // Update the parent state
      console.log("Task updated in Firebase:", updatedFields);
    } catch (error) {
      console.error("Error updating task in Firebase:", error);
    }
  };

  return (
    <>
      <Typography variant="h6" mb={2}>
        Tasks
      </Typography>

      {/* List of Tasks */}
      {taskList.map((task) => (
        <Box key={task.id} sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Task: {task.name}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
            Status:{" "}
            <Select
              value={task.status}
              onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
              variant="outlined"
              size="small"
            >
              <MenuItem value="To Be Done">To Be Done</MenuItem>
              <MenuItem value="Working on It">Working on It</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
            Assigned To:{" "}
            <Select
              value={task.assignedTo || ""}
              onChange={(e) => handleUpdateTask(task.id, { assignedTo: e.target.value })}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">Not Assigned</MenuItem>
              {staff.map((member) => (
                <MenuItem key={member.id} value={member.name}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </Typography>
        </Box>
      ))}

      {/* Add Task Section */}
      <Box sx={{ mt: 3 }}>
        <TextField
          label="New Task Name"
          fullWidth
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddTask} fullWidth>
          Add Task
        </Button>
      </Box>
    </>
  );
};

TaskItem.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      assignedTo: PropTypes.string,
    })
  ).isRequired,
  staff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      function: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUpdateTasks: PropTypes.func.isRequired,
  funeralFirebaseId: PropTypes.string.isRequired,
};

export default TaskItem;
