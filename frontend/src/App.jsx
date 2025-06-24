// Importing Dependencies:
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importing Page Components:
import HomePage from "./pages/HomePage";

// Importing Components:
import PageTemplate from "./components/PageTemplate";

// Importing Styles:
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageTemplate />}>
          {/* Define the route for the home page */}
          <Route path="/" element={<HomePage />} />
          {/* You can add more routes here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
