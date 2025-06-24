// Importing Dependencies:
import Phaser from "phaser";
import { useEffect, useRef } from "react";

// Importing Logic:
import GameScene from "../phaser/gameScene.js";

// Importing Styles:
import "./PhaserComponent.css";

export default function PhaserComponent() {
  // Using refs to manage the Phaser game instance and container accross re-renders.
  const containerRef = useRef(null);
  const gameRef = useRef(null);

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
      const config = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width,
        height,
        scene: GameScene, // Importing the scene from phaser/gameScene.js
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 200 },
          },
        },
      };

      // If a game instance already exists, destroy it before creating a new one.
      gameRef.current = new Phaser.Game(config);
    }

    // Create the Phaser game instance when the component mounts.
    createGame();

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
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="phaser-component-container" style={{ width: "100%", height: "100%" }}></div>
  );
}
