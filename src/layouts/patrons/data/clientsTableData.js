export default function clientsTableData() {
  const columns = [
    { Header: "Full Name", accessor: "fullName" },
    { Header: "Role", accessor: "role" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "Basic Salary", accessor: "basicSalary" }, // Ensure this is defined only once
    { Header: "Actions", accessor: "action" },
  ];

  const rows = [
    // Example data for the rows, make sure this aligns with your data structure
    {
      fullName: "John Doe",
      role: "Driver",
      phone: "1234567890",
      email: "johndoe@example.com",
      address: "123 Main St",
      basicSalary: 5000,
      action: "Edit/Delete", // Replace with action buttons or logic
    },
  ];

  return { columns, rows };
}
