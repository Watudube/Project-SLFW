// Importing Dependencies:
import { Outlet } from "react-router-dom";

// Importing Components:

// Importing Styles:
import "./PageTemplate.css";

export default function PageTemplate() {
  return (
    <main className="template-container">
      <Outlet />
    </main>
  );
}
