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
  const containerRef = useRef(null); // Ref for the container where Phaser will render in.
  const gameRef = useRef(null); // Ref for the Phaser game instance.
  const listenersSetupRef = useRef(false); // Flag for if listeners are already set up (helps avoid race conditions).

  // IMPORTANT: Only using one useEffect to handle both game creation and WebSocket setup, to avoid race conditions.
  useEffect(() => {
    // Don't proceed if essential dependencies (WS, userToken) are missing:
    if (!containerRef.current || !websocketService || !userToken) {
      return;
    }

    // If game instance doesn't exist in this component, create it:
    if (!gameRef.current) {
      console.log("Creating Phaser game instance...");

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
          pixelArt: true, // Good for pixel art sprites.
          antialias: false,
        },
        scale: {
          mode: Phaser.Scale.RESIZE, // Automatically resize to fit container.
          autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game in the container.
        },
      };

      // Create the Phaser game instance.
      gameRef.current = new Phaser.Game(PhaserConfig);
    }

    // Setting up websocket listeners if setup flag is not true:
    if (!listenersSetupRef.current) {
      console.log("Setting up WebSocket listeners...");

      /**
       * Handles successful game join and initial data loading.
       * @param {*} data - The data received from the server when joining game.
       */
      const gameJoinedListener = (data) => {
        console.log("gameJoinedListener received data:");
        console.log(data);
        if (gameRef.current) {
          const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
          if (scene && scene.handleInitialGameboardData) {
            scene.handleInitialGameboardData(data.initial_gameboard);
          }
        }
      };

      /**
       * Handles game join errors.
       * WIP: This function will log the error message for now.
       * @param {*} error - Error message from server.
       */
      const gameJoinErrorListener = (error) => {
        console.error("Failed to join game:", error);
      };

      /**
       * Passes world update data to the Phaser scene to handle.
       * This function is called when the WebSocket service receives a "worldUpdate" event.
       * @param {*} data - The data received from the server containing world updates.
       */
      const worldUpdateListener = (data) => {
        console.log("worldUpdateListener update received:");
        console.log(data);
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
        console.log("entityUpdateListener update received:");
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
        console.log("playerUpdateListener received:", data);
        if (gameRef.current) {
          const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
          if (scene && scene.handlePlayerUpdate) {
            scene.handlePlayerUpdate(data);
          }
        }
      };

      /**
       * Handles server errors.
       * WIP: This function will log the error message for now.
       * @param {*} error - Error message from server.
       */
      const serverErrorListener = (error) => {
        console.error("Server error received:", error);
      };

      /**
       * Handles player disconnection events.
       * WIP: This function will log the disconnection data for now.
       * @param {*} data - Disconnection data.
       */
      const playerDisconnectedListener = (data) => {
        console.log("Player disconnected:");
        console.log(data);
      };

      // Register event listeners for WebSocket events
      websocketService.on("gameJoined", gameJoinedListener);
      websocketService.on("gameJoinError", gameJoinErrorListener);
      websocketService.on("worldUpdate", worldUpdateListener);
      websocketService.on("entityUpdate", entityUpdateListener);
      websocketService.on("playerUpdate", playerUpdateListener);
      websocketService.on("serverError", serverErrorListener);
      websocketService.on("playerDisconnected", playerDisconnectedListener);

      // Store cleanup function for later use
      gameRef.current.wsCleanup = () => {
        websocketService.off("gameJoined", gameJoinedListener);
        websocketService.off("gameJoinError", gameJoinErrorListener);
        websocketService.off("worldUpdate", worldUpdateListener);
        websocketService.off("entityUpdate", entityUpdateListener);
        websocketService.off("playerUpdate", playerUpdateListener);
        websocketService.off("serverError", serverErrorListener);
        websocketService.off("playerDisconnected", playerDisconnectedListener);
      };

      listenersSetupRef.current = true;
    }

    /**
     * Sets up the WebSocket service in the Phaser scene.
     * @returns {boolean} - True if setup was successful, false if game or websocketService is not available.
     */
    const setupWebSocketInScene = () => {
      // Check if gameRef and websocketService are available before proceeding.
      if (gameRef.current && websocketService) {
        const scene = gameRef.current.scene.getScene(SCENE_KEYS.OVERWORLD_SCENE);
        // If scene is available and has a method to set the WebSocket service, call it.
        if (scene && typeof scene.setWebSocketService === "function") {
          console.log("Passing WebSocket service to scene...");
          scene.setWebSocketService(websocketService);
          return true;
        }
      }
      return false;
    };

    // If setup of WebSocket in scene fails (due to game, game's scene or websocketService not existing), poll the
    // setupWebSocketInScene function every 100ms until it succeeds or times out after 10 seconds.
    if (!setupWebSocketInScene()) {
      const checkScene = () => {
        if (setupWebSocketInScene()) {
          clearInterval(intervalId);
        }
      };
      console.log("Game, scene or websocketService instances not yet available, polling for instances...");
      const intervalId = setInterval(checkScene, 100); // Check every 100ms.

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => clearInterval(intervalId), 10000);
      console.error(
        "Failed to set up WebSocket in scene. Polling for game, scene and websocketService instances stopped."
      );
    }

    // Cleanup related to websocketService when this component unmounts:
    return () => {
      console.log("Cleaning up PhaserComponent...");

      // Clean up WebSocket listeners
      if (gameRef.current && gameRef.current.wsCleanup) {
        gameRef.current.wsCleanup();
        delete gameRef.current.wsCleanup;
      }

      // Reset listeners setup flag
      listenersSetupRef.current = false;
    };
  }, [websocketService, userToken]);

  // Separate useEffect for adding resize listener to window:.
  useEffect(() => {
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
    window.addEventListener("resize", handleResize); // "resize" is a native event that fires when the window is resized.

    // Main cleanup (unrelated to websocketService) for this component:
    return () => {
      window.removeEventListener("resize", handleResize);
      // Destroy game only when component unmounts completely:
      if (gameRef.current) {
        console.log("Destroying Phaser game instance...");
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef} // Ref for the container where Phaser will render in.
      className="phaser-component-container"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        border: "2px solid #444", // TODO: Remove visual border for production.
        borderRadius: "8px",
        overflow: "hidden",
      }}
    ></div>
  );
}
