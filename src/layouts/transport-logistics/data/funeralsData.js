const funeralsData = [
  {
    id: 1,
    name: "John Doe",
    address: "123 Home St, Pretoria",
    churchAddress: "456 Church Rd, Pretoria",
    cemeteryAddress: "789 Cemetery Ln, Pretoria",
    deathDate: "2023-12-20",
    funeralDate: "2023-12-25",
    tasks: [{ id: 1, name: "Arrange flowers", status: "To Be Done", assignedTo: "John Doe" }],
  },
  {
    id: 2,
    name: "Jane Smith",
    address: "111 Home St, Cape Town",
    churchAddress: "222 Church Rd, Cape Town",
    cemeteryAddress: "333 Cemetery Ln, Cape Town",
    deathDate: "2023-12-18",
    funeralDate: "2023-12-23",
    tasks: [
      { id: 2, name: "Coordinate transport", status: "To Be Done", assignedTo: "Jane Smith" },
    ],
  },
];

export default funeralsData;
