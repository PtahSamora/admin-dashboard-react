import React from "react";
import { DocusealForm } from "@docuseal/react";

const DocusealFormComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "start", // Align at the top for scroll support
        height: "100vh", // Full viewport height
        paddingLeft: "260px", // Offset for the sidebar width
        boxSizing: "border-box", // Include padding in size calculations
        overflowY: "auto", // Enable vertical scrolling
        paddingTop: "20px", // Add some spacing at the top
        paddingBottom: "20px", // Add spacing at the bottom for better UX
      }}
    >
      <DocusealForm
        src="https://docuseal.com/d/xLxrMYz54W3hUG"
        email="ssamoraam@gmail.com"
        onComplete={(data) => console.log(data)}
      />
    </div>
  );
};

export default DocusealFormComponent;
