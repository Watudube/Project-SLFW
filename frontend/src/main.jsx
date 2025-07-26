// Dependencies:
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Components:
import App from "./App.jsx";

// Styles:
import "./main.css";

// Render the main application.
// Note: StrictMode is removed for compatibility with Phaser.
createRoot(document.getElementById("root")).render(<App />);
