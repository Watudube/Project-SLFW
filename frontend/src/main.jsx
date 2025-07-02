// Importing Dependencies:
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Importing Components:
import App from "./App.jsx";

// Importing Styles:
import "./main.css";

createRoot(document.getElementById("root")).render(
  // Removed the default strict mode wrapper for simplicity and phaser.
  <App />
);
