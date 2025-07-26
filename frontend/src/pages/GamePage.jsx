// Importing Dependencies:
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Importing Components:
import PhaserComponent from "../components/PhaserComponent";

// Importing Contexts:
import { UserContext } from "../contexts/UserContext";

// Importing Styles:
import "./GamePage.css";

/**
 * Represents the Game Page of the application, which serves as the main entry point for users.
 * @returns Home Page Component
 */
export default function GamePage() {
  // Subscribing to User Context (changes to context states should trigger re-render):
  const { isLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("GamePage mounting...");

  /**
   * Handles user logout by clearing user data and navigating to the home page.
   * @returns {void}
   */
  const handleLogout = () => {
    logout(); // Clear user data from context and session storage.
    navigate("/"); // Navigate out of the GamePage.
  };

  // If still loading user data, show loading state:
  if (isLoading) {
    return <div className="loading-container">Loading user data...</div>;
  }

  // The main game page content:
  return (
    <div className="game-page-container">
      <div className="game-title-container">
        <h1>Project-SLFW</h1>
        <p>
          <i>Name Pending</i>
        </p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="gui-container">
        <PhaserComponent />
      </div>
      <div className="insrtuctions-container">
        <h3>
          <u>Instructions:</u>
        </h3>
        <p>w - Move north.</p>
        <p>a - Move west.</p>
        <p>s - Move south.</p>
        <p>d - Move east.</p>
      </div>
    </div>
  );
}
