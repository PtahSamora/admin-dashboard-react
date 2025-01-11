import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { SalariesProvider } from "context/SalariesContext"; // Import only what's needed

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <SalariesProvider>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </SalariesProvider>
);
