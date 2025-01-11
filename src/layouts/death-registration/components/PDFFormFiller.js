import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "pdfjs-dist";

const PDFFormFiller = () => {
  const [pdfBytes, setPdfBytes] = useState(null);

  // Load the PDF file on component mount
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const url = "/bi132.pdf"; // Path to the PDF file in the /public directory
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const pdfArrayBuffer = await response.arrayBuffer();
        setPdfBytes(pdfArrayBuffer);
      } catch (error) {
        console.error("Failed to load the PDF:", error);
      }
    };

    loadPdf();
  }, []);

  // Helper function to download the filled PDF
  const savePdf = async () => {
    try {
      if (!pdfBytes) {
        console.error("No PDF loaded to save.");
        return;
      }

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Filled_BI132_Form.pdf";
      link.click();
    } catch (error) {
      console.error("Failed to save the PDF:", error);
    }
  };

  return (
    <div>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          marginLeft: "260px", // Adjust for sidebar width
          paddingLeft: "20px",
        }}
      >
        {pdfBytes ? (
          <Worker
            workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}
          >
            <Viewer fileUrl={pdfBytes} />
          </Worker>
        ) : (
          <div>Loading PDF...</div>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={savePdf}
          style={{
            padding: "10px 20px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save PDF
        </button>
      </div>
    </div>
  );
};

export default PDFFormFiller;
