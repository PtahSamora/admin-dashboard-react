import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TombstoneOrderForm from "./components/TombstoneOrderForm";

function TombstoneOrders() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <TombstoneOrderForm />
      <Footer />
    </DashboardLayout>
  );
}

export default TombstoneOrders;
