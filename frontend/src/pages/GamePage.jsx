// Importing Dependencies:
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Importing Components:
import PhaserComponent from "../components/PhaserComponent";

// Importing Contexts:
import { UserContext } from "../contexts/UserContext";

// Importing Services:
import { websocketService } from "../services/websocketService";

// Importing Styles:
import "./GamePage.css";

/**
 * Represents the Game Page of the application, which serves as the main entry point for users.
 * @returns Home Page Component
 */
export default function GamePage() {
  // Subscribing to User Context (changes to context states should trigger re-render):
  const { userToken, isLoading, logout, forceLogout } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("GamePage mounting...");

  /**
   * Generic logout handler, intended for normal user logout (not forced due to WebSocket disconnection).
   */
  const handleLogout = () => {
    logout(); // Clear user data from context and session storage.
    navigate("/"); // Navigate out of the GamePage.
  };

  // WebSocket connection management for this component:
  useEffect(() => {
    // Only connect to websocket if we have a user token and are not loading.
    if (userToken && !isLoading) {
      websocketService.connect(undefined, userToken); // First argument is the URL, which defaults to the base URL in the service if undefined.

      // Handle WebSocket disconnection
      const handleDisconnect = (disconnectData) => {
        console.log("WebSocket disconnected, logging out user and redirecting to login...");
        console.log("Disconnect details:", disconnectData);
        forceLogout("websocket_disconnect"); // Clear user data from context and session storage.
        navigate("/"); // Navigate out of the GamePage.
      };

      // Listen for WebSocket disconnection:
      websocketService.on("disconnected", handleDisconnect);

      // Removes "disconnected" listener and disconnects WebSocket when component unmounts.
      return () => {
        websocketService.off("disconnected", handleDisconnect);
        websocketService.disconnect();
      };
    }
  }, [userToken, isLoading, logout, navigate, forceLogout]);

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
        <PhaserComponent websocketService={websocketService} userToken={userToken} />
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
