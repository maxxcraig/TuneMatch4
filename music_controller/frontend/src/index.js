import React from "react";
import ReactDOM from "react-dom/client";  // Import the correct module
import App from "./components/App";
import "./styles/styles.css";

// Create a root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render your App inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
