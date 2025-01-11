import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DataTable from "examples/Tables/DataTable";
import staffTableData from "../data/staffTableData";

function StaffTable() {
  const { columns, rows } = staffTableData();

  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [message, setMessage] = useState("");

  const handleOpen = (staffName) => {
    setSelectedStaff(staffName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStaff(null);
    setMessage("");
  };

  return (
    <div>
      <DataTable
        table={{
          columns,
          rows: rows.map((row) => ({
            ...row,
            action: (
              <Button variant="contained" color="primary" onClick={() => handleOpen(row.name)}>
                {row.action}
              </Button>
            ),
          })),
        }}
      />

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h3>Send Message to {selectedStaff}</h3>
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert(`Message sent to ${selectedStaff}: ${message}`);
              handleClose();
            }}
          >
            Send
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default StaffTable;
