// Importing Dependencies:
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importing Page Components:
import HomePage from "./pages/HomePage";

// Importing Components:
import PageTemplate from "./components/PageTemplate";

// Importing Contexts:
import { UserProvider } from "./contexts/UserContext";

// Importing Styles:
import "./App.css";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PageTemplate />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
