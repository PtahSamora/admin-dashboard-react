const billingData = {
  invoices: [
    {
      id: 1,
      clientName: "John Doe",
      phone: "1234567890",
      email: "john.doe@example.com",
      items: "Casket, Funeral Flowers",
      totalAmount: 1200,
      status: "Pending",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      phone: "9876543210",
      email: "jane.smith@example.com",
      items: "Urn, Cremation Service",
      totalAmount: 800,
      status: "Paid",
    },
  ],
  payments: [
    {
      id: 1,
      contractorName: "Michael Johnson",
      amount: 500,
      purpose: "Driver Services",
      paymentDate: "2024-01-10",
    },
    {
      id: 2,
      contractorName: "Anna Wilson",
      amount: 300,
      purpose: "Catering Services",
      paymentDate: "2024-01-12",
    },
  ],
};

export default billingData;
