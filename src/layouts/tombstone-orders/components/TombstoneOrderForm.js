import React, { useState, useRef, useEffect } from "react"; // Add useEffect here
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactSketchCanvas } from "react-sketch-canvas";
import jsPDF from "jspdf";

// Import Material Dashboard 2 context
import { useMaterialUIController } from "context";

function TombstoneOrderForm() {
  const [orderType, setOrderType] = useState("Burial");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    cityTown: "",
    stateProvince: "",
    zipPostalCode: "",
    installationDateTime: "",
    collectionDate: "",
    installationAddress: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    tombstoneCode: "",
    description: "",
    curbSize: "",
    extraService: "",
    deceasedName: "",
    deceasedDOB: "",
    deceasedDOD: "",
    urnColor: "",
    engraving: "",
    selectedUrn: null,
    selectedFont: "",
    engravingLine1: "",
    engravingLine2: "",
    engravingLine3: "",
  }); // Store all form data with defaults
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Track preview mode
  const [expanded, setExpanded] = useState({
    tombstoneDetails: true,
    lettering: true,
  });

  const [pdfURL, setPdfURL] = useState(null); // State to store PDF preview URL

  // Access the sidebar state from the global Material UI controller
  const [controller] = useMaterialUIController();
  const { miniSidenav } = controller;

  const canvasRef = useRef(null); // Use ref for the canvas

  const [urnImageBase64, setUrnImageBase64] = useState(null); // Store the selected urn base64 string

  // Update form data dynamically
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "selectedUrn") {
      // Load the base64 image for the selected urn
      const urnImageMap = {
        Cube: "/urns/urn_cube.png",
        Georgian: "/urns/urn_georgian.png",
        Tuscany: "/urns/urn_tuscany.png",
        "Double Tuscany": "/urns/urn_double-tuscany.png",
        "Keepsake Square": "/urns/urn_keepsake-square.png",
        "Keepsake Tuscany": "/urns/urn_keepsake-tuscany.png",
        "Keepsake Vase": "/urns/urn_keepsake-vase.png",
        Military: "/urns/urn_military.png",
        "Infant Urn": "/urns/urn_pet-urn (1).png",
        "Pet Urn": "/urns/urn_pet-urn.png",
        Phoenix: "/urns/urn_phoenix.png",
        "Windsor Elite": "/urns/urn_windsor-elite.png",
        Windsor: "/urns/urn_windsor.png",
        "Wooden Urn": "/urns/urn_wooden-urn.png",
        Zenith: "/urns/urn_zenith.png",
      };

      const urnImagePath = urnImageMap[value];
      if (urnImagePath) {
        const response = await fetch(urnImagePath);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setUrnImageBase64(reader.result);
        reader.readAsDataURL(blob);
      }
    }
  };

  // Generate PDF for preview or download
  const generatePDF = async () => {
    const doc = new jsPDF();
    const logoPath = "/favicon.png"; // Replace with the actual path to your logo
    let y = 20; // Start vertical position

    // Function to add the logo on each page
    const addLogo = async () => {
      const response = await fetch(logoPath);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          doc.addImage(base64data, "PNG", 180, 10, 20, 10); // Adjust dimensions and position as needed
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    };

    // Add the logo to the first page
    await addLogo();

    // Add Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Tombstone Order Details", 105, y, { align: "center" });
    y += 10;

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 10;

    // Section: Customer Information
    doc.setFontSize(14);
    doc.text("Customer Information", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // First Name and Last Name Side-by-Side
    doc.text(`First Name: ${formData.firstName || "N/A"}`, 10, y);
    doc.text(`Last Name: ${formData.lastName || "N/A"}`, 110, y); // Offset for the second column
    y += 10;

    // Phone Number and Email Side-by-Side
    doc.text(`Phone Number: ${formData.phoneNumber || "N/A"}`, 10, y);
    doc.text(`Email: ${formData.email || "N/A"}`, 110, y);
    y += 10;

    // Address and City Side-by-Side
    doc.text(`Address: ${formData.address || "N/A"}`, 10, y);
    doc.text(`City/Town: ${formData.cityTown || "N/A"}`, 110, y);
    y += 10;

    // State/Province and ZIP/Postal Code Side-by-Side
    doc.text(`State/Province: ${formData.stateProvince || "N/A"}`, 10, y);
    doc.text(`ZIP/Postal Code: ${formData.zipPostalCode || "N/A"}`, 110, y);
    y += 20;

    // Section: Order Type
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 10, y);
    doc.setFont("helvetica", "normal");
    y += 10;

    doc.setFontSize(12);
    doc.text(`Order Type: ${orderType}`, 10, y);
    y += 10;

    if (orderType === "Burial") {
      doc.setFontSize(14);
      doc.text("Burial Details", 10, y);
      y += 10;

      doc.setFontSize(12);
      doc.text(`Installation Date & Time: ${formData.installationDateTime || "N/A"}`, 10, y);
      doc.text(`Collection Date: ${formData.collectionDate || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Installation Address: ${formData.installationAddress || "N/A"}`, 10, y);
      doc.text(`Street Address Line 2: ${formData.streetAddressLine2 || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`City: ${formData.city || "N/A"}`, 10, y);
      doc.text(`State/Province: ${formData.state || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Postal/Zip Code: ${formData.postalCode || "N/A"}`, 10, y);
      doc.text(`Tombstone Code: ${formData.tombstoneCode || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Description: ${formData.description || "N/A"}`, 10, y);
      doc.text(`Curb Size: ${formData.curbSize || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Extra Service: ${formData.extraService || "N/A"}`, 10, y);
      y += 20;

      // Check space for canvas image
      if (canvasImage) {
        if (y + 90 > 280) {
          doc.addPage();
          y = 20;
          await addLogo(); // Add logo to the new page
        }
        doc.text("Tombstone Draft:", 10, y);
        y += 10;
        doc.addImage(canvasImage, "PNG", 10, y, 190, 80); // Adjust position and size as needed
        y += 90;
      }
    } else if (orderType === "Cremation") {
      doc.setFontSize(14);
      doc.text("Cremation Details", 10, y);
      y += 10;

      doc.setFontSize(12);
      doc.text(`Deceased Name: ${formData.deceasedName || "N/A"}`, 10, y);
      doc.text(`Date of Birth: ${formData.deceasedDOB || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Date of Death: ${formData.deceasedDOD || "N/A"}`, 10, y);
      doc.text(`Urn Color: ${formData.urnColor || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      // Add the urn image if available
      if (urnImageBase64) {
        if (y + 110 > 280) {
          doc.addPage();
          y = 20;
          await addLogo(); // Add logo to the new page
        }
        doc.text("Selected Urn Style:", 10, y);
        y += 10;
        doc.addImage(urnImageBase64, "PNG", 10, y, 100, 100); // Adjust dimensions and position
        y += 110;
      }

      doc.text(`Engraving: ${formData.engraving || "N/A"}`, 10, y);
      doc.text(`Selected Font: ${formData.selectedFont || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Engraving Line 1: ${formData.engravingLine1 || "N/A"}`, 10, y);
      doc.text(`Engraving Line 2: ${formData.engravingLine2 || "N/A"}`, 110, y); // Side-by-side
      y += 10;

      doc.text(`Engraving Line 3: ${formData.engravingLine3 || "N/A"}`, 10, y);
      y += 20;
    }

    // Section: Additional Notes
    if (y + 20 > 280) {
      doc.addPage();
      y = 20;
      await addLogo(); // Add logo to the new page
    }
    doc.setFontSize(14);
    doc.text("Additional Notes", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`${formData.additionalMessage || "N/A"}`, 10, y);

    // Check if there’s enough space for the signature section on the last page
    if (y + 40 > 280) {
      doc.addPage();
      y = 20;
    }

    // Add Signature Section
    y = 280; // Position at the bottom of the page
    doc.setFontSize(12);
    doc.text("Signature:", 10, y);
    doc.line(30, y, 100, y); // Signature line
    y += 10;

    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date of Signature: ${currentDate}`, 10, y);

    return doc;
  };

  // Handle Submit and switch to Preview mode
  const handleSubmit = () => {
    setIsPreviewMode(true); // Enable preview mode
  };

  // Handle Order Completion
  const handleComplete = async () => {
    const pdf = await generatePDF(); // Await the async function
    pdf.save("Tombstone_Order.pdf"); // Download the PDF
    alert("Order completed! PDF has been downloaded.");
  };

  // Handle Editing the form
  const handleEdit = () => {
    setIsPreviewMode(false); // Switch back to edit mode
  };

  const handleAccordionToggle = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [canvasImage, setCanvasImage] = useState(null); // Store the canvas image as a base64 string

  const canvasStyles = {
    border: "2px solid #1976d2",
    borderRadius: "4px",
    width: "100%",
    height: "400px",
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const saveDrawing = async () => {
    if (canvasRef.current) {
      const data = await canvasRef.current.exportImage("png"); // Export the image as a base64 string
      setCanvasImage(data); // Save the image in the state for later use in the PDF
      alert("Draft saved! The drawing will be included in the PDF preview.");
    }
  };

  // useEffect Hook for Preview Mode
  useEffect(() => {
    const generatePreview = async () => {
      if (isPreviewMode) {
        const pdf = await generatePDF(); // Generate the PDF
        const url = pdf.output("datauristring"); // Generate a data URI for the PDF
        setPdfURL(url); // Set the URL to state
      }
    };
    generatePreview();
  }, [isPreviewMode]); // Triggered when `isPreviewMode` changes

  // Conditional Rendering: Preview Mode
  if (isPreviewMode) {
    // Show loading if PDF is being generated
    if (!pdfURL) {
      return (
        <Box
          sx={{
            marginLeft: miniSidenav ? "80px" : "260px",
            transition: "margin-left 0.3s ease-in-out",
            padding: "16px",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Generating Preview...
          </Typography>
        </Box>
      );
    }

    // Render the PDF Preview
    return (
      <Box
        sx={{
          marginLeft: miniSidenav ? "80px" : "260px",
          transition: "margin-left 0.3s ease-in-out",
          padding: "16px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Tombstone Order Preview
        </Typography>
        <iframe
          src={pdfURL}
          title="PDF Preview"
          width="100%"
          height="600px"
          style={{ border: "1px solid #ccc", marginBottom: "16px" }}
        ></iframe>
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginRight: 2,
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{
              marginRight: 2,
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            onClick={handleComplete}
          >
            Complete Order
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginLeft: miniSidenav ? "80px" : "260px", // Dynamically adjust based on sidebar
        transition: "margin-left 0.3s ease-in-out", // Smooth transition
        padding: "16px",
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          Tombstone Order Form
        </Typography>

        {/* Customer Information */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Billing Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                name="firstName"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last Name" fullWidth name="lastName" onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phoneNumber"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" fullWidth name="email" onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Address" fullWidth name="address" onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="City/Town" fullWidth name="cityTown" onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">State/Province</Typography>
              <TextField
                select
                // label="Select Province"
                fullWidth
                name="stateProvince"
                value={formData.stateProvince || ""}
                onChange={handleInputChange}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">-- Select Province --</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Free State">Free State</option>
                <option value="Gauteng">Gauteng</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="Northern Cape">Northern Cape</option>
                <option value="North West">North West</option>
                <option value="Western Cape">Western Cape</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ZIP/Postal Code"
                fullWidth
                name="zipPostalCode"
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Order Type */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Order Type
          </Typography>
          <RadioGroup
            row
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            sx={{ justifyContent: "flex-start", mb: 2 }}
          >
            <FormControlLabel value="Burial" control={<Radio />} label="Burial" />
            <FormControlLabel value="Cremation" control={<Radio />} label="Cremation" />
          </RadioGroup>
        </Box>

        {/* Tombstone Details - Visible only for Burial */}
        {orderType === "Burial" && (
          <>
            {/* Tombstone Details */}
            <Accordion
              expanded={expanded.tombstoneDetails}
              onChange={() => handleAccordionToggle("tombstoneDetails")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Tombstone Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="installationDateTime"
                      label="Installation Date & Time"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.installationDateTime || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="collectionDate"
                      label="Collection Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.collectionDate || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="installationAddress"
                      label="Installation Address"
                      fullWidth
                      value={formData.installationAddress || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="streetAddressLine2"
                      label="Street Address Line 2"
                      fullWidth
                      value={formData.streetAddressLine2 || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="city"
                      label="City"
                      fullWidth
                      value={formData.city || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="state"
                      label="State / Province"
                      fullWidth
                      value={formData.state || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="postalCode"
                      label="Postal / Zip Code"
                      fullWidth
                      value={formData.postalCode || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="tombstoneCode"
                      label="Tombstone Code"
                      fullWidth
                      value={formData.tombstoneCode || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.description || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h12" gutterBottom>
                      Curb Size
                    </Typography>
                    <RadioGroup
                      name="curbSize"
                      row
                      value={formData.curbSize || ""}
                      onChange={(e) =>
                        handleInputChange({ target: { name: "curbSize", value: e.target.value } })
                      }
                    >
                      <FormControlLabel value="Adult" control={<Radio />} label="Adult" />
                      <FormControlLabel value="Child" control={<Radio />} label="Child" />
                      <FormControlLabel value="Military" control={<Radio />} label="Military" />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="extraService"
                      label="Specific Description for Extra Service"
                      fullWidth
                      multiline
                      rows={7}
                      value={formData.extraService || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Lettering Section */}
            <Accordion
              expanded={expanded.lettering}
              onChange={() => handleAccordionToggle("lettering")}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">Lettering</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      fullWidth
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.dateOfBirth || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="dateOfDeath"
                      label="Date of Death"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.dateOfDeath || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="funeralDate"
                      label="Funeral Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.funeralDate || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="additionalMessage"
                      label="Additional Message"
                      fullWidth
                      multiline
                      rows={6}
                      value={formData.additionalMessage || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="messageOnLedger"
                      label="Message on Ledger"
                      fullWidth
                      multiline
                      rows={6}
                      value={formData.messageOnLedger || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="messageOnBible"
                      label="Message on Bible"
                      fullWidth
                      multiline
                      rows={6}
                      value={formData.messageOnBible || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="colorChoiceNotes"
                      label="Color Choice Notes"
                      fullWidth
                      value={formData.colorChoiceNotes || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Tombstone Shape Draft */}
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Tombstone Shape Draft
              </Typography>
              <ReactSketchCanvas
                ref={canvasRef}
                style={canvasStyles}
                strokeWidth={2}
                strokeColor="#1976d2"
              />
              <Box mt={2} textAlign="center">
                <Button
                  variant="outlined"
                  sx={{
                    marginRight: 2,
                    color: "black",
                    borderColor: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                    },
                  }}
                  onClick={clearCanvas}
                >
                  Clear Drawing
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                  onClick={saveDrawing}
                >
                  Save Drawing
                </Button>
              </Box>
            </Box>
          </>
        )}

        {orderType === "Cremation" && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Deceased Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="deceasedName"
                  label="Deceased Name"
                  fullWidth
                  value={formData.deceasedName || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="deceasedDOB"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.deceasedDOB || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="deceasedDOD"
                  label="Date of Death"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.deceasedDOD || ""}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Urn Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {/* Urn Style */}
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Urn Style</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {[
                          { name: "Cube", file: "urn_cube.png" },
                          { name: "Georgian", file: "urn_georgian.png" },
                          { name: "Tuscany", file: "urn_tuscany.png" },
                          { name: "Double Tuscany", file: "urn_double-tuscany.png" },
                          { name: "Keepsake Square", file: "urn_keepsake-square.png" },
                          { name: "Keepsake Tuscany", file: "urn_keepsake-tuscany.png" },
                          { name: "Keepsake Vase", file: "urn_keepsake-vase.png" },
                          { name: "Military", file: "urn_military.png" },
                          { name: "Infant Urn", file: "urn_pet-urn (1).png" },
                          { name: "Pet Urn", file: "urn_pet-urn.png" },
                          { name: "Phoenix", file: "urn_phoenix.png" },
                          { name: "Windsor Elite", file: "urn_windsor-elite.png" },
                          { name: "Windsor", file: "urn_windsor.png" },
                          { name: "Wooden Urn", file: "urn_wooden-urn.png" },
                          { name: "Zenith", file: "urn_zenith.png" },
                          { name: "Tuscany", file: "urn_tuscany.png" },
                        ].map((urn) => (
                          <Grid item xs={12} sm={4} key={urn.name}>
                            <Box
                              sx={{
                                border: `2px solid ${
                                  formData.selectedUrn === urn.name ? "#1976d2" : "#ccc"
                                }`, // Highlight selected urn
                                borderRadius: "8px",
                                overflow: "hidden",
                                cursor: "pointer",
                                backgroundColor:
                                  formData.selectedUrn === urn.name
                                    ? "rgba(25, 118, 210, 0.1)"
                                    : "transparent", // Shading for selected urn
                                "&:hover": { borderColor: "#1976d2" },
                              }}
                              onClick={() =>
                                handleInputChange({
                                  target: { name: "selectedUrn", value: urn.name },
                                })
                              } // Update selected urn state
                            >
                              <img
                                src={`/urns/${urn.file}`} // Ensure your images are in the public/urns folder
                                alt={urn.name}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "150px",
                                  display: "block",
                                  margin: "0 auto", // Center the image within the container
                                }}
                              />
                              <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{ padding: "8px" }}
                              >
                                {urn.name}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle1" mt={2}>
                        Selected Urn Style: {formData.selectedUrn || "None"}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Urn Color */}
                <Grid item xs={12}>
                  <TextField
                    name="urnColor"
                    label="Urn Color"
                    fullWidth
                    value={formData.urnColor || ""}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Engraving */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Engraving
                  </Typography>
                  <select
                    name="engraving"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                    value={formData.engraving || ""}
                    onChange={(e) => handleInputChange(e)}
                  >
                    <option value="engraving_urn">Engraving on Urn</option>
                    <option value="single_brass_plate">Single Brass Plate</option>
                    <option value="double_plate">Double Plate/Black on Brass</option>
                  </select>
                </Grid>

                {/* Font Selection */}
                <Grid item xs={12}>
                  {/* Font Selection */}
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Font Selection</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {[
                          { name: "Times New Roman", style: "Times New Roman" },
                          { name: "Arial", style: "Arial" },
                          { name: "Verdana", style: "Verdana" },
                          { name: "Courier New", style: "Courier New" },
                          { name: "Arial Bold", style: "Arial, Bold" },
                          { name: "Arial Bold/Italic", style: "Arial, Bold Italic" },
                        ].map((font) => (
                          <Grid item xs={12} sm={6} md={4} key={font.name}>
                            <Box
                              sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                cursor: "pointer",
                                textAlign: "center",
                                "&:hover": { borderColor: "#1976d2" },
                                backgroundColor:
                                  formData.selectedFont === font.style ? "#e3f2fd" : "transparent", // Highlight selected font
                              }}
                              onClick={() =>
                                handleInputChange({
                                  target: { name: "selectedFont", value: font.style },
                                })
                              } // Set the selected font
                            >
                              <Typography style={{ fontFamily: font.style }} variant="h6">
                                {font.name}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle1" mt={2}>
                        Selected Font:{" "}
                        <span style={{ fontFamily: formData.selectedFont }}>
                          {formData.selectedFont || "None"}
                        </span>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {/* Engraving Lines */}
                <Grid item xs={12}>
                  <TextField
                    name="engravingLine1"
                    label="Engraving Line 1: Name"
                    fullWidth
                    value={formData.engravingLine1 || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="engravingLine2"
                    label="Engraving Line 2: Date of Birth & Death"
                    fullWidth
                    value={formData.engravingLine2 || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="engravingLine3"
                    label="Engraving Line 3: Term of Endearment"
                    fullWidth
                    value={formData.engravingLine3 || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Submit Section */}
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              marginRight: 2,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            onClick={handleSubmit} // Switch to preview mode
          >
            Submit Order
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              color: "green",
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default TombstoneOrderForm;
