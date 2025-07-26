// Dependencies:
import { Outlet } from "react-router-dom";

// Styles:
import "./PageTemplate.css";

/**
 * Page Template Component
 *
 * Provides a common layout structure for all pages.
 * Uses React Router's Outlet to render child route components.
 *
 * @returns {JSX.Element} Page template component.
 */
export default function PageTemplate() {
  return (
    <main className="template-container">
      <Outlet />
    </main>
  );
}
