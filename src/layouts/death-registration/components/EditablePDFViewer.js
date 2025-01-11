import React, { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const EditablePDFViewer = () => {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPdf = async () => {
    const url = "/bi132.pdf"; // Path to your PDF in the /public folder
    const response = await fetch(url);
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    setPdfDoc(pdfDoc);
    setIsLoading(false);
  };

  const savePdf = async () => {
    if (pdfDoc) {
      const pdfBytes = await pdfDoc.save();
      saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "Filled_BI132_Form.pdf");
    }
  };

  useEffect(() => {
    loadPdf();
  }, []);

  useEffect(() => {
    const renderPdf = async () => {
      if (pdfDoc && canvasRef.current) {
        const page = pdfDoc.getPage(0); // Render the first page
        const viewport = { width: canvasRef.current.width, height: canvasRef.current.height };
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        page.render(renderContext);
      }
    };

    renderPdf();
  }, [pdfDoc]);

  return (
    <div>
      {isLoading ? (
        <div>Loading PDF...</div>
      ) : (
        <div>
          <canvas
            ref={canvasRef}
            style={{
              border: "1px solid #ddd",
              margin: "auto",
              display: "block",
            }}
            width="800"
            height="600"
          />
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
      )}
    </div>
  );
};

export default EditablePDFViewer;
