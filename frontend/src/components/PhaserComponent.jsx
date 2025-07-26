// Importing Dependencies:
import Phaser from "phaser";
import { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Importing Logic:
import OverworldScene from "../phaser/overworldScene.js";
import WebSocketManager from "../phaser/websocketManager.js";

// Importing Contexts:
import { UserContext } from "../contexts/UserContext.jsx";

// Importing Styles:
import "./PhaserComponent.css";

export default function PhaserComponent() {
  const containerRef = useRef(null); // Reference to the container where Phaser will render.
  const gameRef = useRef(null); // Reference to the Phaser game instance.

  const { forceLogout, userToken } = useContext(UserContext);

  const navigate = useNavigate(); // Navigation function to redirect users.

  // Effect to initialize Phaser game instance when component mounts.
  useEffect(() => {
    // If container is not ready or userToken is not available, do not initialize Phaser.
    if (!containerRef.current || !userToken) {
      return;
    }

    // Create Phaser game instance if it doesn't exist.
    if (!gameRef.current) {
      console.log("Creating Phaser game instance...");

      // Get container dimensions:
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      // Phaser configuration for the game instance.
      const PhaserConfig = {
        type: Phaser.AUTO, // Automatically choose WebGL or Canvas.
        parent: containerRef.current,
        width,
        height,
        scene: [OverworldScene], // TODO: Add other scenes as needed.
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: false,
          },
        },
        render: {
          pixelArt: true,
          antialias: false,
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      // Create the Phaser game instance:
      gameRef.current = new Phaser.Game(PhaserConfig);

      // Add WebSocket manager to the game:
      gameRef.current.webSocketManager = new WebSocketManager(gameRef.current);

      // Set up scene callbacks for React communication:
      const scene = gameRef.current.scene.getScene("OverworldScene");
      if (scene) {
        scene.setReactCallbacks(
          // onDisconnected
          (disconnectData) => {
            // TODO: Handle disconnection logic here.
            console.log("WebSocket disconnected, logging out user...");
            forceLogout("websocket_disconnect");
            navigate("/");
          },
          // onCriticalError
          (errorMessage) => {
            // TODO: Handle critical error logic here.
            console.log("Critical error occurred:", errorMessage);
            forceLogout("critical_error");
            navigate("/");
          }
        );
      }

      // Connect to WebSocket
      gameRef.current.webSocketManager.connect(userToken);
    }

    // Cleanup function to disconnect WebSocket instance on unmount.
    return () => {
      console.log("Cleaning up PhaserComponent...");

      if (gameRef.current?.webSocketManager) {
        gameRef.current.webSocketManager.disconnect();
      }
    };
  }, [userToken, forceLogout, navigate]);

  // Effect to handle window resize:
  useEffect(() => {
    function handleResize() {
      if (gameRef.current && gameRef.current.scale && containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        gameRef.current.scale.resize(width, height);
      }
    }

    window.addEventListener("resize", handleResize); // "resize" is a native browser event.

    // Cleanup function to remove resize listener and destroy game instance.
    return () => {
      window.removeEventListener("resize", handleResize);

      if (gameRef.current) {
        console.log("Destroying Phaser game instance...");
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="phaser-component-container"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        border: "2px solid #444",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    ></div>
  );
}
