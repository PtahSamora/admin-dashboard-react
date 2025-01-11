import { isWithinInterval, subDays } from "date-fns";

// Sample data from clientele
const funeralsData = [
  { staff: "John Michael", funeralDate: "2024-12-24" },
  { staff: "John Michael", funeralDate: "2024-12-26" },
  { staff: "Alexa Liras", funeralDate: "2024-12-23" },
  { staff: "John Michael", funeralDate: "2024-12-28" },
  { staff: "Alexa Liras", funeralDate: "2024-12-29" },
];

// Staff contact data
const staffContactData = [
  { name: "John Michael", phoneNumber: "1234567890" },
  { name: "Alexa Liras", phoneNumber: "1234567891" },
];

// Helper function to get a staff member's phone number
const getStaffPhoneNumber = (staffName) => {
  const staff = staffContactData.find((member) => member.name === staffName);
  return staff ? staff.phoneNumber : null;
};

export default function staffTableData() {
  // Calculate funerals completed in the last 7 days
  const calculateFunerals = (staffName) => {
    const now = new Date();
    return funeralsData.filter(
      (funeral) =>
        funeral.staff === staffName &&
        isWithinInterval(new Date(funeral.funeralDate), {
          start: subDays(now, 7),
          end: now,
        })
    ).length;
  };

  // Function to create the WhatsApp message link
  const generateWhatsAppLink = (staffName) => {
    const phoneNumber = getStaffPhoneNumber(staffName);
    if (!phoneNumber) return "Phone number not available";

    const message = `Hello ${staffName}, you have been assigned tasks in the last 7 days. Please review your assignments and respond as required.`;
    return (
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        Send Message
      </a>
    );
  };

  return {
    columns: [
      { Header: "Staff Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Function", accessor: "function", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Employment Date", accessor: "employed", align: "center" },
      { Header: "Funerals (Last 7 Days)", accessor: "funeralsCompleted", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: [
      {
        name: "John Michael",
        function: "Manager",
        status: <span style={{ color: "green", fontWeight: "bold" }}>Online</span>,
        employed: "23/04/18",
        funeralsCompleted: calculateFunerals("John Michael"),
        action: generateWhatsAppLink("John Michael"),
      },
      {
        name: "Alexa Liras",
        function: "Coordinator",
        status: <span style={{ color: "gray", fontWeight: "bold" }}>Last seen: 11/01/23</span>,
        employed: "15/03/20",
        funeralsCompleted: calculateFunerals("Alexa Liras"),
        action: generateWhatsAppLink("Alexa Liras"),
      },
    ],
  };
}
