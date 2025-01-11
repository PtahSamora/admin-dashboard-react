import React, { useState } from "react";
import { Grid, TextField, Button, Divider } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import backgroundImage from "assets/images/bg-profile.jpeg";
import MDAvatar from "components/MDAvatar";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Funeral Parlour Name",
    managerName: "Funeral Parlour",
    contactNumber: "",
    address: "",
    websiteURL: "",
    socialMediaLinks: "",
    description: "",
    operatingHours: "",
    caskets: [],
    urns: [],
  });

  const [casketImages, setCasketImages] = useState([]);
  const [urnImages, setUrnImages] = useState([]);
  const [logo, setLogo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "casket") {
      setCasketImages(files);
    } else if (type === "urn") {
      setUrnImages(files);
    } else if (type === "logo") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveProfile = () => {
    console.log("Profile saved:", profile);
    console.log("Casket Images:", casketImages);
    console.log("Urn Images:", urnImages);
    alert("Profile saved successfully!");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox position="relative" mb={5}>
        {/* Background Section */}
        <MDBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="18.75rem"
          borderRadius="xl"
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        />
        {/* White Card Section */}
        <Card
          sx={{
            position: "relative",
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
            backgroundColor: "white",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
          }}
        >
          {/* Header Section */}
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <label htmlFor="logo-upload">
                <MDAvatar
                  src={logo || ""}
                  alt="profile-logo"
                  size="xl"
                  shadow="sm"
                  sx={{ cursor: "pointer" }}
                />
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e, "logo")}
              />
            </Grid>
            <Grid item>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <MDTypography variant="h5" fontWeight="medium">
                  {profile.name}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  {profile.managerName}
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>

          {/* Editable Form Section */}
          <MDBox mt={5} mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6" fontWeight="medium">
                  Edit Funeral Parlour Profile
                </MDTypography>
                <TextField
                  label="Parlour Name"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Manager Name"
                  fullWidth
                  margin="normal"
                  name="managerName"
                  value={profile.managerName}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Contact Number"
                  fullWidth
                  margin="normal"
                  name="contactNumber"
                  value={profile.contactNumber}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Address"
                  fullWidth
                  margin="normal"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Website URL"
                  fullWidth
                  margin="normal"
                  name="websiteURL"
                  value={profile.websiteURL}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDTypography variant="h6" fontWeight="medium">
                  Additional Information
                </MDTypography>
                <TextField
                  label="Social Media Links"
                  fullWidth
                  margin="normal"
                  name="socialMediaLinks"
                  value={profile.socialMediaLinks}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Operating Hours"
                  fullWidth
                  margin="normal"
                  name="operatingHours"
                  value={profile.operatingHours}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Description/About Us"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  name="description"
                  value={profile.description}
                  onChange={handleInputChange}
                />
                <MDBox mb={2}>
                  <MDTypography variant="subtitle2">Casket Images</MDTypography>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "casket")}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDTypography variant="subtitle2">Urn Images</MDTypography>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "urn")}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" color="primary" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Profile;
