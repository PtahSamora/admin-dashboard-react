import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { SalariesContext } from "context/SalariesContext"; // Import the context for salaries

function Dashboard() {
  const { salaries } = useContext(SalariesContext); // Access salaries from context
  const { tasks } = reportsLineChartData;

  // Calculate the total salaries dynamically
  const calculateTotalSalaries = (salaries) => {
    return salaries.reduce((total, salary) => {
      const additionsTotal = salary.additions.reduce((sum, addition) => sum + addition.amount, 0);
      return total + salary.basicSalary + additionsTotal;
    }, 0);
  };

  const totalSalaries = calculateTotalSalaries(salaries);

  // Chart data for total salaries
  const salariesChartData = {
    labels: ["Total Salaries"],
    datasets: [
      {
        label: "Salaries (R)",
        data: [totalSalaries],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Registered Deaths */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="primary"
              icon="person"
              title="Registered Deaths"
              count={42} // Replace with dynamic count
              percentage={{
                color: "success",
                amount: "+4%",
                label: "than last week",
              }}
            />
          </Grid>
          {/* Orders */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="success"
              icon="shopping_cart"
              title="Orders"
              count={30} // Replace with dynamic count
              percentage={{
                color: "success",
                amount: "+10%",
                label: "than last week",
              }}
            />
          </Grid>
          {/* Revenue */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="info"
              icon="attach_money"
              title="Revenue"
              count="R24,000" // Replace with dynamic revenue
              percentage={{
                color: "success",
                amount: "+15%",
                label: "than last week",
              }}
            />
          </Grid>
          {/* Customers */}
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="warning"
              icon="group"
              title="Customers"
              count={128} // Replace with dynamic count
              percentage={{
                color: "success",
                amount: "+8%",
                label: "than last week",
              }}
            />
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* Website Views (WhatsApp to Patreons) */}
            <Grid item xs={12} lg={6}>
              <ReportsBarChart
                color="info"
                title="WhatsApp Messages to Patreons"
                description="Performance over the week"
                chart={reportsBarChartData}
              />
            </Grid>
            {/* Total Salaries Chart */}
            <Grid item xs={12} lg={6}>
              <ReportsBarChart
                color="success"
                title="Patrons' Total Salaries"
                description="Includes salaries and additions"
                chart={salariesChartData}
              />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* Completed Tasks */}
            <Grid item xs={12} lg={12}>
              <ReportsLineChart
                color="primary"
                title="Completed Tasks"
                description="Funerals completed tasks"
                chart={tasks}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
