import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

function InvoicesTable({ invoices, onSendWhatsApp }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Client Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Items</th>
          <th>Total Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.clientName}</td>
            <td>{invoice.phone}</td>
            <td>{invoice.email}</td>
            <td>{invoice.items}</td>
            <td>{invoice.totalAmount}</td>
            <td>{invoice.status}</td>
            <td>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSendWhatsApp(invoice.phone, `/invoice/${invoice.id}`)}
              >
                WhatsApp
              </Button>
              <Button variant="outlined" style={{ marginLeft: 5 }}>
                Download
              </Button>
              <Button variant="text" style={{ marginLeft: 5 }}>
                Print
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

InvoicesTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  onSendWhatsApp: PropTypes.func.isRequired,
};

export default InvoicesTable;
