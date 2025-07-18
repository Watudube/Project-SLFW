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
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // WebSocket connection management:
  useEffect(() => {
    // Only connect if we have a user token and are not loading, connecting to the WebSocket server.
    // This ensures we don't attempt to connect before the user token is available.
    if (userToken && !isLoading) {
      websocketService.connect(undefined, userToken); // First argument is the URL, which defaults to the base URL in the service if undefined.

      // Handle WebSocket disconnection
      const handleDisconnect = (disconnectData) => {
        console.log("WebSocket disconnected, logging out user and redirecting to login...");
        console.log("Disconnect details:", disconnectData);
        forceLogout("websocket_disconnect"); // Clear user data from context
        navigate("/"); // Navigate to login page
      };

      // Listen for WebSocket disconnection
      websocketService.on("disconnected", handleDisconnect);

      // Disconnect from WebSocket server when component unmounts or userToken changes.
      return () => {
        websocketService.off("disconnected", handleDisconnect);
        websocketService.disconnect();
      };
    }
  }, [userToken, isLoading, logout, navigate, forceLogout]);

  if (isLoading) {
    return <div className="loading-container">Loading user data...</div>;
  }

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
