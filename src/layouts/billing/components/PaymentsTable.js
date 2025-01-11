import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function PaymentsTable({ payments }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Contractor Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Purpose</TableCell>
            <TableCell>Payment Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.contractorName}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.purpose}</TableCell>
              <TableCell>{payment.paymentDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Add PropTypes validation
PaymentsTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      contractorName: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      purpose: PropTypes.string.isRequired,
      paymentDate: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PaymentsTable;
