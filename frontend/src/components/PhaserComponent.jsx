// Dependencies:
import Phaser from "phaser";
import { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Logic:
import OverworldScene from "../phaser/overworldScene.js";
import WebSocketManager from "../phaser/websocketManager.js";

// Contexts:
import { UserContext } from "../contexts/UserContext.jsx";

// Styles:
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

    // Always destroy existing game instance before creating a new one
    if (gameRef.current) {
      console.log("Destroying existing Phaser game instance for re-login...");
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    // Create Phaser game instance
    console.log("Creating new Phaser game instance...");

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

    // Store React callbacks on game instance for scenes to access
    gameRef.current.reactCallbacks = {
      onDisconnected: (disconnectData) => {
        console.log("PhaserComponent: WebSocket disconnected, logging out user...", disconnectData);

        // Ensure thorough cleanup before logout
        if (gameRef.current?.webSocketManager) {
          console.log("PhaserComponent: Disconnecting WebSocket manager before logout...");
          gameRef.current.webSocketManager.disconnect();
        }

        // Force logout
        forceLogout("websocket_disconnect");
        
        // Navigate after cleanup
        navigate("/");
      },
      onCriticalError: (errorMessage) => {
        console.log("PhaserComponent: Critical error occurred:", errorMessage);

        // Ensure thorough cleanup before logout
        if (gameRef.current?.webSocketManager) {
          console.log("PhaserComponent: Disconnecting WebSocket manager due to critical error...");
          gameRef.current.webSocketManager.disconnect();
        }

        // Force logout
        forceLogout("critical_error");
        
        // Navigate after cleanup
        navigate("/");
      },
    };

    console.log("PhaserComponent: React callbacks set on game instance:", !!gameRef.current.reactCallbacks);

    // Add WebSocket manager to the game:
    gameRef.current.webSocketManager = new WebSocketManager(gameRef.current);

    // Connect to WebSocket
    gameRef.current.webSocketManager.connect(userToken);

    // Cleanup function to disconnect WebSocket instance on unmount.
    return () => {
      console.log("Cleaning up PhaserComponent...");

      if (gameRef.current?.webSocketManager) {
        gameRef.current.webSocketManager.disconnect();
      }

      // Destroy game instance when userToken changes (logout/login)
      if (gameRef.current) {
        console.log("Destroying Phaser game instance due to token change...");
        gameRef.current.destroy(true);
        gameRef.current = null;
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

    // Cleanup function to remove resize listener only
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Effect to handle component unmount - final cleanup
  useEffect(() => {
    return () => {
      if (gameRef.current) {
        console.log("Final cleanup: Destroying Phaser game instance...");
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
