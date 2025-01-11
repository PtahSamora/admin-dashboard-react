import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Grid, TextField, Button, MenuItem } from "@mui/material";
import { doc, setDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { SalariesContext } from "context/SalariesContext"; // Import SalariesContext

function AddClientForm({ onSubmit, onCancel, roles, onAddRole }) {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    phone: "",
    email: "",
    address: "",
    additionalNotes: "",
    basicSalary: "", // Added basic salary field
  });

  const [newRole, setNewRole] = useState("");
  const { salaries, setSalaries } = useContext(SalariesContext); // Access context for salaries

  const [clients, setClients] = useState([]); // Track clients in local state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [editingClient, setEditingClient] = useState(null); // Track the client being edited
  const editClient = async (clientId) => {
    try {
      // Fetch client data from Firestore
      const clientDocRef = doc(db, "patrons", clientId);
      const clientSnapshot = await getDoc(clientDocRef);

      if (clientSnapshot.exists()) {
        const clientData = clientSnapshot.data();
        setEditingClient(clientData); // Set the client to be edited
        setFormData(clientData); // Populate the form with the client's data
      } else {
        console.error("Client does not exist in Firebase.");
      }
    } catch (error) {
      console.error("Error fetching client data from Firestore:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Full Name is required!");
      return;
    }

    try {
      // Add patron to Firestore
      const patronDocRef = doc(collection(db, "patrons")); // Auto-ID for patrons document
      await setDoc(patronDocRef, {
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        additionalNotes: formData.additionalNotes,
        basicSalary: parseFloat(formData.basicSalary) || 0, // Ensure basic salary is a number
      });

      console.log("Patron document created with ID:", patronDocRef.id);

      // Create corresponding salary document
      const salaryDocRef = doc(collection(db, "salaries")); // Auto-ID for salaries document
      await setDoc(salaryDocRef, {
        id: salaryDocRef.id, // Include the document ID for later reference
        patronId: patronDocRef.id,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        additions: [], // Start with no additions
        totalSalary: parseFloat(formData.basicSalary) || 0, // Initial total salary equals basic salary
        updatedAt: new Date().toISOString(),
      });

      console.log("Salary document created with ID:", salaryDocRef.id);

      // Update the local `salaries` state
      setSalaries([
        ...salaries,
        {
          id: salaryDocRef.id, // Include the Firestore document ID
          name: formData.fullName || "Unnamed Patron",
          role: formData.role || "N/A",
          basicSalary: parseFloat(formData.basicSalary) || 0,
          additions: [],
        },
      ]);
      setClients([
        ...clients,
        {
          ...formData,
          id: patronDocRef.id, // Add the Firestore ID
          action: (
            <div>
              <Button variant="text" color="primary" onClick={() => editClient(patronDocRef.id)}>
                Edit
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={() => handleDeleteClient(formData.fullName)}
              >
                Delete
              </Button>
            </div>
          ),
        },
      ]);

      // Call the parent onSubmit handler to update the UI
      onSubmit({
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 0,
        salaryId: salaryDocRef.id, // Pass the salary ID back
      });

      // Close the modal after successful submission
      onCancel();
    } catch (error) {
      console.error("Error adding patron or salary document:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleAddRole = () => {
    if (newRole.trim() !== "") {
      onAddRole(newRole.trim());
      setNewRole("");
    }
  };
  const handleDeleteClient = (clientName) => {
    setClients((prevClients) => prevClients.filter((client) => client.fullName !== clientName));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            select
            fullWidth
            required
          >
            {roles.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Add New Role"
            name="newRole"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleAddRole} style={{ marginTop: 10 }}>
            Add Role
          </Button>
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
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Basic Salary"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Additional Notes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
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

AddClientForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddRole: PropTypes.func.isRequired,
};

export default AddClientForm;
