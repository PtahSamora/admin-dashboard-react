import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import RowList from "./components/RowList";
import { collection, doc, setDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path to your Firebase config
import { useEffect } from "react";

// Mock staff data
const staffData = [
  { id: 1, name: "John Doe", function: "Manager", phoneNumber: "1234567890" },
  { id: 2, name: "Jane Smith", function: "Coordinator", phoneNumber: "0987654321" },
  { id: 3, name: "Mike Johnson", function: "Logistics", phoneNumber: "1122334455" },
];

const Funerals = () => {
  const [funerals, setFunerals] = useState([]);

  const handleDeleteFuneral = (funeralId) => {
    // Filter out the funeral to remove it from the UI
    setFunerals((prevFunerals) => prevFunerals.filter((funeral) => funeral.id !== funeralId));
  };

  // Add a new funeral and save to Firebase
  const addFuneral = async () => {
    const newFuneral = {
      id: Date.now(), // Unique ID
      name: "New Funeral",
      address: "",
      cemeteryAddress: "",
      churchAddress: "",
      deathDate: "",
      funeralDate: "",
      familyContactName: "",
      familyContactNumber: "",
      tasks: [], // Start with an empty list of tasks
    };

    try {
      const funeralDocRef = doc(collection(db, "funerals"));
      await setDoc(funeralDocRef, {
        ...newFuneral,
        firebaseId: funeralDocRef.id, // Save the Firebase document ID
      });

      setFunerals((prev) => [newFuneral, ...prev]); // Add to UI
      console.log("Funeral added to Firebase with ID:", funeralDocRef.id);
    } catch (error) {
      console.error("Error adding funeral to Firebase:", error);
      alert("Failed to add funeral. Please try again.");
    }
  };

  // Update funeral in Firebase
  const handleUpdateFuneral = async (funeralId, updatedFuneral) => {
    if (updatedFuneral === null) {
      // Remove the funeral from the local state
      setFunerals((prev) => prev.filter((funeral) => funeral.id !== funeralId));
      return;
    }

    try {
      const funeralToUpdate = funerals.find((funeral) => funeral.id === funeralId);
      if (funeralToUpdate) {
        const firebaseId = funeralToUpdate.firebaseId;
        const funeralDocRef = doc(db, "funerals", firebaseId);
        await updateDoc(funeralDocRef, updatedFuneral);

        setFunerals((prev) =>
          prev.map((funeral) =>
            funeral.id === funeralId ? { ...updatedFuneral, firebaseId } : funeral
          )
        );
        console.log("Funeral updated in Firebase:", updatedFuneral);
      }
    } catch (error) {
      console.error("Error updating funeral in Firebase:", error);
      alert("Failed to update funeral. Please try again.");
    }
  };
  const fetchFunerals = async () => {
    try {
      const funeralsCollection = collection(db, "funerals");
      const snapshot = await getDocs(funeralsCollection);
      const fetchedFunerals = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Use Firestore's document ID as the unique identifier
      }));
      setFunerals(fetchedFunerals); // Update the funerals state
      console.log("Funerals fetched successfully:", fetchedFunerals);
    } catch (error) {
      console.error("Error fetching funerals from Firebase:", error);
      alert("Failed to fetch funerals. Please check your connection or try again.");
    }
  };

  useEffect(() => {
    fetchFunerals();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Funerals</Typography>
          <Button variant="contained" color="primary" onClick={addFuneral}>
            Add Funeral
          </Button>
        </Box>
        <RowList
          funerals={funerals}
          staff={staffData}
          onUpdateFuneral={handleUpdateFuneral}
          onDeleteFuneral={handleDeleteFuneral}
        />
      </Container>
      <Footer />
    </DashboardLayout>
  );
};

export default Funerals;
