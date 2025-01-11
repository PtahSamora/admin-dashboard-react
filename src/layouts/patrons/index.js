import React, { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import AddClientForm from "./components/AddClientForm";
import clientsTableData from "./data/clientsTableData";

import jsPDF from "jspdf";

import { SalariesContext } from "context/SalariesContext";

import { doc, setDoc, collection, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path to match your Firebase configuration file

function Patrons() {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [editClientData, setEditClientData] = useState(null);
  const [clients, setClients] = useState(clientsTableData().rows);
  const [roles, setRoles] = useState(["Driver", "Clergy", "Celebrant", "Designer"]);
  // Use the context instead of local state
  const { salaries, setSalaries } = useContext(SalariesContext);
  const [selectedSalary, setSelectedSalary] = useState(null);
  useEffect(() => {
    const fetchPatrons = async () => {
      try {
        const patronsSnapshot = await getDocs(collection(db, "patrons"));
        const patronsData = patronsSnapshot.docs.map((doc) => ({
          firebaseId: doc.id, // Use Firestore document ID
          ...doc.data(),
          action: (
            <div>
              <button
                style={{ marginRight: 5 }}
                onClick={() => editClient({ firebaseId: doc.id, ...doc.data() })}
              >
                Edit
              </button>
              <button onClick={() => sendWhatsAppMessage(doc.data().phone)}>Send Message</button>
            </div>
          ),
        }));
        setClients(patronsData); // Update state with fetched patrons
      } catch (error) {
        console.error("Error fetching patrons from Firestore:", error);
      }
    };

    fetchPatrons();
  }, []); // Run only once on component mount

  const handleOpen = () => {
    setEditClientData(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEditModalClose = () => setEditModalOpen(false);

  const handleInfoModalClose = () => setInfoModalOpen(false);
  const addClient = async (newClient) => {
    const { fullName, role, basicSalary, phone, email, address } = newClient;

    try {
      if (editClientData) {
        // Update existing client in Firestore
        const patronDocRef = doc(db, "patrons", editClientData.firebaseId);
        await updateDoc(patronDocRef, { fullName, role, basicSalary, phone, email, address });

        // Update local state
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.firebaseId === editClientData.firebaseId
              ? { ...client, fullName, role, basicSalary, phone, email, address }
              : client
          )
        );
      } else {
        // Generate a unique patronId
        const patronId = Date.now().toString(); // Use a timestamp or UUID for uniqueness
        // Add new client to Firestore
        const patronDocRef = doc(collection(db, "patrons"));
        await setDoc(patronDocRef, {
          patronId,
          fullName,
          role,
          basicSalary,
          phone,
          email,
          address,
        });
        // Add a corresponding salary entry
        const salaryDocRef = doc(collection(db, "salaries"));
        await setDoc(salaryDocRef, {
          patronId, // Link to the patronId
          fullName, // Optional: Add name for clarity
          basicSalary: parseFloat(basicSalary) || 0,
          additions: [],
          totalSalary: parseFloat(basicSalary) || 0,
          updatedAt: new Date().toISOString(),
        });

        // Add to local state
        setClients((prevClients) => [
          ...prevClients,
          {
            firebaseId: patronDocRef.id,
            fullName,
            role,
            basicSalary,
            phone,
            email,
            address,
            action: (
              <div>
                <button
                  style={{ marginRight: 5 }}
                  onClick={() =>
                    editClient({
                      firebaseId: patronDocRef.id,
                      patronId,
                      fullName,
                      role,
                      basicSalary,
                      phone,
                      email,
                      address,
                    })
                  }
                >
                  Edit
                </button>
                <button onClick={() => sendWhatsAppMessage(phone)}>Send Message</button>
              </div>
            ),
          },
        ]);
      }
      handleClose(); // Close the modal after adding or editing
    } catch (error) {
      console.error("Error saving client to Firestore:", error);
      alert("Failed to save client. Please try again.");
    }
  };

  const editClient = (client) => {
    setEditClientData(client);
    setOpen(true);
  };

  const sendWhatsAppMessage = (phone) => {
    const url = `https://wa.me/${phone}`;
    window.open(url, "_blank");
  };

  const addRole = (newRole) => {
    if (!roles.includes(newRole)) {
      setRoles([...roles, newRole]);
    }
  };

  const handleCardClick = (salary) => {
    console.log("Clicked Salary:", salary);

    // Ensure basicSalary is correctly pulled from the selected salary object
    const updatedSalary = {
      ...salary,
      id: salary.id,
      basicSalary: salary.basicSalary || 0, // Base salary from the patron's data
      category: salary.category || "",
      date: salary.date || "",
      amount: salary.amount || 0,
      funeral: salary.funeral || "",
      newCategory: "",
      newCategoryFuneral: "",
    };

    console.log("Updated Selected Salary:", updatedSalary);
    setSelectedSalary(updatedSalary);
    setEditModalOpen(true);
  };

  const handleInfoClick = (salary) => {
    setSelectedSalary(salary);
    setInfoModalOpen(true);
  };
  const saveOrUpdateAdditions = async (salaryId, addition) => {
    try {
      if (!salaryId || !addition) {
        console.error("Missing salaryId or addition:", { salaryId, addition });
        alert("No salary selected or missing fields.");
        return;
      }

      console.log("Saving addition to Firestore:", { salaryId, addition });

      // Update Firestore
      const salaryDocRef = doc(db, "salaries", salaryId); // salaryId must match the Firestore `id` field
      await updateDoc(salaryDocRef, {
        additions: arrayUnion(addition), // Add the addition to Firestore
        totalSalary: (selectedSalary.basicSalary || 0) + addition.amount, // Update total salary
        updatedAt: new Date().toISOString(),
      });

      console.log("Firestore update successful for salary ID:", salaryId);

      // Update local state
      setSalaries((prevSalaries) =>
        prevSalaries.map((salary) =>
          salary.id === salaryId
            ? {
                ...salary,
                additions: [...(salary.additions || []), addition], // Ensure `additions` is an array
                totalSalary: (salary.totalSalary || salary.basicSalary || 0) + addition.amount, // Update local total
              }
            : salary
        )
      );

      console.log("Updated local salaries state:", salaries);
      alert("Additions saved successfully!");
      handleEditModalClose();
    } catch (error) {
      console.error("Error saving additions:", error);
      alert("Failed to save additions. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    if (!selectedSalary?.newCategory || !selectedSalary?.newCategory.trim()) {
      alert("Category name is required!");
      return;
    }

    try {
      const newCategory = selectedSalary.newCategory.trim();

      // Add new category to Firestore and include patronId
      const categoryDocRef = doc(collection(db, "categories"));
      await setDoc(categoryDocRef, {
        name: newCategory,
        patronId: selectedSalary.patronId || "", // Link the patron ID
        salaryId: selectedSalary.id || "", // Link the salary ID
        createdAt: new Date().toISOString(),
      });

      console.log("New category added:", {
        name: newCategory,
        patronId: selectedSalary.patronId || "",
        salaryId: selectedSalary.id || "",
      });

      // Update local categories state (if applicable)
      setCategories((prev) => [
        ...prev,
        { name: newCategory, patronId: selectedSalary.patronId || "" },
      ]);

      // Update selectedSalary with the new category (optional)
      setSelectedSalary((prev) => ({
        ...prev,
        category: newCategory,
      }));

      alert("New category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const clearSalaries = () => {
    setSalaries((prevSalaries) => prevSalaries.map((salary) => ({ ...salary, additions: [] })));
  };

  const getConsolidatedAdditions = (additions) => {
    const consolidated = additions.reduce((acc, curr) => {
      const existing = acc.find((item) => item.category === curr.category);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, []);
    return consolidated;
  };
  const onUpdatePatron = async (patronId, updatedPatron) => {
    try {
      // Find the Firebase document ID for the patron
      const firebaseId = updatedPatron.firebaseId || null; // Ensure `firebaseId` exists
      if (!firebaseId) {
        console.error("Firebase ID is missing for the patron.");
        alert("Failed to update patron. Please try again.");
        return;
      }

      // Reference the Firestore document
      const patronDocRef = doc(db, "patrons", firebaseId);

      // Update the Firestore document
      await updateDoc(patronDocRef, updatedPatron);

      console.log("Patron updated in Firestore:", updatedPatron);

      // Update the local state
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.firebaseId === firebaseId ? { ...client, ...updatedPatron } : client
        )
      );

      alert("Patron updated successfully!");
    } catch (error) {
      console.error("Error updating patron in Firebase:", error);
      alert("Failed to update patron. Please try again.");
    }
  };
  const generatePdf = (selectedSalary) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(`Details for ${selectedSalary.name}`, 10, 10);

    // Add role and basic salary
    doc.setFontSize(14);
    doc.text(`Role: ${selectedSalary.role}`, 10, 20);
    doc.text(`Basic Salary: R${selectedSalary.basicSalary.toFixed(2)}`, 10, 30);

    // Add additions
    doc.setFontSize(12);
    doc.text("Additions:", 10, 40);

    selectedSalary.additions.forEach((addition, index) => {
      doc.text(
        `${index + 1}. ${addition.category} on ${addition.date}: R${addition.amount} ${
          addition.funeral ? `(Funeral: ${addition.funeral})` : ""
        }`,
        10,
        50 + index * 10
      );
    });

    // Save the PDF
    doc.save(`${selectedSalary.name}-details.pdf`);
  };
  const [categories, setCategories] = useState([
    "Public Holiday",
    "Sunday",
    "Overtime",
    "Night Pickup",
    "Embalming",
    "Venue Setup",
  ]);

  useEffect(() => {
    console.log("Modal Opened with Selected Salary:", selectedSalary);
  }, [editModalOpen, selectedSalary]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Patrons Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Patrons
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                  Add New Contact
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: clientsTableData().columns, rows: clients }}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>

          {/* Salaries Section */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white">
                  Salaries
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearSalaries}
                  sx={{ marginBottom: 3, color: "green" }}
                >
                  Clear Salaries for All Patrons
                </Button>
                <Grid container spacing={3}>
                  {salaries.map((salary) => (
                    <Grid item xs={12} md={6} lg={4} key={salary.name}>
                      <Card
                        sx={{ padding: 2, cursor: "pointer", position: "relative" }}
                        onClick={() => handleCardClick(salary)}
                      >
                        {/* Info Button */}
                        <IconButton
                          sx={{ position: "absolute", top: 8, right: 8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInfoClick(salary);
                          }}
                        >
                          <Icon>help_outline</Icon>
                        </IconButton>
                        <MDTypography variant="h6">{salary.name}</MDTypography>
                        <MDTypography variant="body2" color="text">
                          Total Salary: R
                          {(
                            salary.basicSalary +
                            salary.additions.reduce((total, addition) => total + addition.amount, 0)
                          ).toFixed(2)}
                        </MDTypography>

                        <MDBox mt={2}>
                          <MDTypography variant="body2" fontWeight="medium">
                            Additions:
                          </MDTypography>
                          {getConsolidatedAdditions(salary.additions).map((addition, index) => (
                            <Chip
                              key={index}
                              label={`${addition.category}: R${addition.amount}`}
                              sx={{ margin: "4px" }}
                              color="primary"
                              size="small"
                            />
                          ))}
                        </MDBox>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {/* Info Modal */}
      <Modal open={infoModalOpen} onClose={handleInfoModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: 400,
            maxHeight: "90vh", // Limit height to viewport
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          {selectedSalary && (
            <>
              <MDTypography variant="h6" fontWeight="medium">
                {selectedSalary.name}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Role: {selectedSalary.role}
              </MDTypography>
              <MDTypography variant="body2" color="text" mt={1}>
                Basic Salary: R{selectedSalary.basicSalary.toFixed(2)}
              </MDTypography>
              <MDBox mt={2}>
                <MDTypography variant="body2" fontWeight="medium">
                  Additions:
                </MDTypography>
                <ul>
                  {selectedSalary.additions.map((addition, index) => (
                    <li key={index}>
                      {addition.category} on {addition.date}: R{addition.amount}{" "}
                      {addition.funeral ? `(Funeral: ${addition.funeral})` : ""}
                    </li>
                  ))}
                </ul>
              </MDBox>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => generatePdf(selectedSalary)}
                sx={{ mt: 2, color: "red" }}
              >
                Download as PDF
              </Button>
            </>
          )}
        </Box>
      </Modal>
      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: 400,
            maxHeight: "90vh", // Limit height to viewport
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          <MDTypography variant="h6" fontWeight="medium">
            Edit Additions for {selectedSalary?.name}
          </MDTypography>

          {/* Select Category */}
          <TextField
            select
            label="Category"
            value={selectedSalary?.category || ""}
            onChange={(e) => {
              console.log("Updated Category:", e.target.value); // Debugging log
              setSelectedSalary({ ...selectedSalary, category: e.target.value });
            }}
            fullWidth
            margin="normal"
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem value="add-new-category">+ Add New Category</MenuItem>
          </TextField>

          {/* Add New Category */}
          {selectedSalary?.category === "add-new-category" && (
            <>
              <TextField
                label="New Category Name"
                fullWidth
                margin="normal"
                onChange={(e) =>
                  setSelectedSalary({
                    ...selectedSalary,
                    newCategory: e.target.value,
                  })
                }
              />
              <TextField
                label="Funeral Name (Optional)"
                fullWidth
                margin="normal"
                onChange={(e) =>
                  setSelectedSalary({
                    ...selectedSalary,
                    newCategoryFuneral: e.target.value,
                  })
                }
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddCategory}
                sx={{ mt: 2 }}
              >
                Save New Category
              </Button>
            </>
          )}

          {/* Funeral Field for Embalming and Venue Setup */}
          {["Embalming", "Venue Setup"].includes(selectedSalary?.category) && (
            <TextField
              label="Funeral Name"
              fullWidth
              margin="normal"
              onChange={(e) => setSelectedSalary({ ...selectedSalary, funeral: e.target.value })}
            />
          )}

          {/* Date Field */}
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setSelectedSalary({ ...selectedSalary, date: e.target.value })}
          />

          {/* Amount Field */}
          <TextField
            label="Amount"
            type="number"
            value={selectedSalary?.amount || ""}
            fullWidth
            margin="normal"
            onChange={(e) => {
              console.log("Updated Amount:", e.target.value); // Debugging log
              setSelectedSalary({ ...selectedSalary, amount: parseFloat(e.target.value) });
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("Selected Salary State before Save:", selectedSalary);

              if (!selectedSalary || !selectedSalary.id) {
                console.error("No salary selected or missing ID:", selectedSalary);
                alert("No salary selected or missing fields.");
                return;
              }

              const { category, date, amount } = selectedSalary;

              if (!category || !date || amount === null || amount === undefined) {
                console.error("Missing fields: ", { category, date, amount });
                alert("All fields (Category, Date, and Amount) are required.");
                return;
              }

              const addition = {
                category,
                date,
                funeral: selectedSalary.funeral || selectedSalary.newCategoryFuneral || null,
                amount,
              };

              console.log("Saving Addition:", addition);
              saveOrUpdateAdditions(selectedSalary.id, addition);
            }}
          >
            Save
          </Button>
        </Box>
      </Modal>
      ;
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: 400,
            maxHeight: "90vh", // Limit height to viewport
            overflowY: "auto", // Enable vertical scrolling
          }}
        >
          <AddClientForm
            onSubmit={addClient}
            onCancel={handleClose}
            roles={roles}
            onAddRole={addRole}
            defaultData={editClientData || {}}
          />
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Patrons;
