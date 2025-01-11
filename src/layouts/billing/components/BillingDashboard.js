import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import CreateInvoiceForm from "./components/CreateInvoiceForm";
import InvoicesTable from "./components/InvoicesTable";
import PaymentsTable from "./components/PaymentsTable";

function BillingDashboard() {
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  const handleOpenInvoiceModal = () => setOpenInvoiceModal(true);
  const handleCloseInvoiceModal = () => setOpenInvoiceModal(false);

  const addInvoice = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
    handleCloseInvoiceModal();
  };

  const sendWhatsAppInvoice = (phone, invoiceUrl) => {
    const url = `https://wa.me/${phone}?text=Your%20invoice%20is%20available%20here:%20${encodeURIComponent(
      invoiceUrl
    )}`;
    window.open(url, "_blank");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Invoices Section */}
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
                  Invoices
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <Button variant="contained" color="primary" onClick={handleOpenInvoiceModal}>
                  Create New Invoice
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <InvoicesTable invoices={invoices} onSendWhatsApp={sendWhatsAppInvoice} />
              </MDBox>
            </Card>
          </Grid>

          {/* Payments Section */}
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
                  Payments
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <PaymentsTable payments={payments} />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Create Invoice Modal */}
      <Modal open={openInvoiceModal} onClose={handleCloseInvoiceModal}>
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
            width: 500,
          }}
        >
          <CreateInvoiceForm onSubmit={addInvoice} onCancel={handleCloseInvoiceModal} />
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default BillingDashboard;
