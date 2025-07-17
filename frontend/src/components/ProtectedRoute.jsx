// Importing Dependencies:
import { useContext } from "react";
import { Navigate } from "react-router-dom";

// Importing Contexts:
import { UserContext } from "../contexts/UserContext";

// Importing Styles:
import "./ProtectedRoute.css";

/**
 * Protected route component that requires authentication.
 * Redirects to login page if user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { userToken, isLoading } = useContext(UserContext);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!userToken) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated
  return children;
}
