// Importing Dependencies:
import Phaser from "phaser";
import { useEffect, useRef } from "react";

// Importing Logic:
import OverworldScene from "../phaser/overworldScene.js";

// Importing Constants:
import { SCENE_KEYS } from "../phaser/sceneKeys.js";

// Importing Styles:
import "./PhaserComponent.css";

export default function PhaserComponent({ websocketService, userToken }) {
  // Using refs to manage the Phaser game instance and container accross re-renders.
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  // Set up WebSocket event listeners for game updates:
  useEffect(() => {
    if (!websocketService || !userToken) return; // If no websocket service or user token, do not set up listeners.

    /**
     * Handles successful game join and initial data loading
     * @param {*} data - The data received from the server when joining game
     */
    const gameJoinedListener = (data) => {
      console.log("Game joined successfully, received data:");
      console.log(data);
      if (gameRef.current) {
        const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
        if (scene && scene.handleInitialGameboardData) {
          scene.handleInitialGameboardData(data.initial_gameboard);
        }
      }
    };

    /**
     * Handles game join errors
     * @param {*} error - Error message from server
     */
    const gameJoinErrorListener = (error) => {
      console.error("Failed to join game:", error);
      // You could show an error message to the user here
    };

    /**
     * Passes world update data to the Phaser scene to handle.
     * This function is called when the WebSocket service receives a "worldUpdate" event.
     * @param {*} data - The data received from the server containing world updates.
     */
    const worldUpdateListener = (data) => {
      console.log("World update received:", data);
      if (gameRef.current) {
        const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
        if (scene && scene.handleWorldUpdate) {
          scene.handleWorldUpdate(data);
        }
      }
    };

    /**
     * Passes entity update data to the Phaser scene to handle.
     * This function is called when the WebSocket service receives an "entityUpdate" event.
     * @param {*} data - The data received from the server containing entity updates.
     */
    const entityUpdateListener = (data) => {
      console.log("Entity update received:");
      console.log(data);
      if (gameRef.current) {
        const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
        if (scene && scene.handleEntityUpdate) {
          scene.handleEntityUpdate(data);
        }
      }
    };

    /**
     * Passes player update data to the Phaser scene to handle.
     * This function is called when the WebSocket service receives a "playerUpdate" event.
     * @param {*} data - The data received from the server containing player updates.
     */
    const playerUpdateListener = (data) => {
      console.log("Player update received:", data);
      if (gameRef.current) {
        const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
        if (scene && scene.handlePlayerUpdate) {
          scene.handlePlayerUpdate(data);
        }
      }
    };

    /**
     * Handles server errors
     * @param {*} error - Error message from server
     */
    const serverErrorListener = (error) => {
      console.error("Server error received:", error);
      // You could show an error notification to the user here
    };

    /**
     * Handles player disconnection events
     * @param {*} data - Disconnection data
     */
    const playerDisconnectedListener = (data) => {
      console.log("Player disconnected:", data);
      // Handle other players disconnecting
    };

    // Register event listeners for WebSocket events
    websocketService.on("gameJoined", gameJoinedListener);
    websocketService.on("gameJoinError", gameJoinErrorListener);
    websocketService.on("worldUpdate", worldUpdateListener);
    websocketService.on("entityUpdate", entityUpdateListener);
    websocketService.on("playerUpdate", playerUpdateListener);
    websocketService.on("serverError", serverErrorListener);
    websocketService.on("playerDisconnected", playerDisconnectedListener);

    // Cleanup listeners when component unmounts or dependencies change
    return () => {
      websocketService.off("gameJoined", gameJoinedListener);
      websocketService.off("gameJoinError", gameJoinErrorListener);
      websocketService.off("worldUpdate", worldUpdateListener);
      websocketService.off("entityUpdate", entityUpdateListener);
      websocketService.off("playerUpdate", playerUpdateListener);
      websocketService.off("serverError", serverErrorListener);
      websocketService.off("playerDisconnected", playerDisconnectedListener);
    };
  }, [websocketService, userToken]);

  useEffect(() => {
    /**
     * Configures and creates a new Phaser game instance and attaches it
     * to the container.
     */
    function createGame() {
      // Getting the width and height of the container to set the game size.
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      // Configuring the Phaser game instance.
      const PhaserConfig = {
        type: Phaser.AUTO, // Automatically choose WebGL or Canvas rendering.
        parent: containerRef.current, // Attach the game to the div container returned by this component.
        width,
        height,
        scene: [OverworldScene], // TODO: Add more scenes via this list later in development.
        physics: {
          default: "arcade", // Using Arcade Physics system. TODO: Change if needed.
          arcade: {
            gravity: { y: 0 }, // No gravity in the overworld scene.
            debug: false, // TODO: Set to false in production!!! Shows collision boxes and other debug info.
          },
        },
        render: {
          pixelArt: true, // Good for pixel art sprites
          antialias: false,
        },
        scale: {
          mode: Phaser.Scale.RESIZE, // Automatically resize to fit container
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      // Create the Phaser game instance.
      gameRef.current = new Phaser.Game(PhaserConfig);

      // Wait for scene to be ready before passing WebSocket service
      if (websocketService && gameRef.current) {
        gameRef.current.events.once("ready", () => {
          const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
          if (scene) {
            scene.setWebSocketService(websocketService);
            console.log("✅ WebSocket service passed to scene!");
          } else {
            console.error("❌ Scene not found when setting WebSocket service!");
          }
        });

        // Also try to set it immediately in case the scene is already ready
        setTimeout(() => {
          const scene = gameRef.current?.scene?.getScene(SCENE_KEYS.OVERWORLD_SCENE);
          if (scene && !scene.websocketService) {
            scene.setWebSocketService(websocketService);
            console.log("✅ WebSocket service passed to scene (delayed)!");
          }
        }, 100);
      }
    }

    // Create the Phaser game instance when the component mounts.
    if (containerRef.current && !gameRef.current) {
      createGame();
    }

    /**
     * Handles window resize events to adjust the Phaser game scale.
     */
    function handleResize() {
      if (gameRef.current && gameRef.current.scale) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        gameRef.current.scale.resize(width, height);
      }
    }

    // Adding the resize event listener to adjust the game scale on window resize.
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [websocketService]);

  return (
    <div
      ref={containerRef}
      className="phaser-component-container"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px", // Ensure minimum height
        border: "2px solid #444", // Visual border to see the game area
        borderRadius: "8px",
        overflow: "hidden",
      }}
    ></div>
  );
}
