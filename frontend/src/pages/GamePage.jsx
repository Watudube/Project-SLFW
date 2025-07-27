// Dependencies:
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// Components:
import PhaserComponent from "../components/PhaserComponent";

// Contexts:
import { UserContext } from "../contexts/UserContext";

// Styles:
import "./GamePage.css";

/**
 * Game Page Component
 *
 * Main game interface where users play the game.
 * Contains the Phaser game component and logout functionality.
 *
 * @returns {JSX.Element} Game page component.
 */
export default function GamePage() {
  // Subscribe to User Context (changes to context states should trigger re-render).
  const { isLoading, logout } = useContext(UserContext);
  const navigate = useNavigate();

  /**
   * Handle user logout by clearing user data and navigating to home page.
   */
  const handleLogout = () => {
    logout(); // Clear user data from context and session storage.
    navigate("/"); // Navigate out of the GamePage.
  };

  // If still loading user data, show loading state.
  if (isLoading) {
    return <div className="loading-container">Loading user data...</div>;
  }

  console.log("Redering GamePage with PhaserComponent...");

  // The main game page content.
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
