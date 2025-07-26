// Dependencies:
import { useContext } from "react";
import { Navigate } from "react-router-dom";

// Contexts:
import { UserContext } from "../contexts/UserContext";

// Styles:
import "./ProtectedRoute.css";

/**
 * Protected Route Component
 *
 * Wrapper component that requires user authentication.
 * Redirects to login page if user is not authenticated.
 * Shows loading state while checking authentication status.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render if authenticated.
 * @returns {JSX.Element} Protected route component.
 */
export default function ProtectedRoute({ children }) {
  const { userToken, isLoading } = useContext(UserContext);

  // Show loading while checking authentication.
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated.
  if (!userToken) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated.
  return children;
}
