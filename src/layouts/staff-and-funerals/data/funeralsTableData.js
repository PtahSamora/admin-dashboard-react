import React from "react";
import PropTypes from "prop-types";

const Progress = ({ value }) => (
  <div>
    <span>Progress: {value}%</span>
  </div>
);

Progress.propTypes = {
  value: PropTypes.number.isRequired, // Validation for 'value'
};

export default function funeralsTableData() {
  return {
    columns: [
      { Header: "Name", accessor: "name" },
      { Header: "Location", accessor: "location" },
      { Header: "Tasks", accessor: "tasks" },
      { Header: "Completion", accessor: "completion" },
    ],
    rows: [
      {
        name: "John Doe",
        location: "123 Main St, Springfield",
        tasks: "Planning, Transport, Burial",
        completion: <Progress value={75} />,
      },
    ],
  };
}
