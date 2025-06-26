import Phaser from "phaser";
import { SCENE_KEYS } from "./scene-keys";

/**
 * This scene represents the main game overworld where the player interacts with the game.
 */
class OverworldScene extends Phaser.Scene {
  /**
   * Initializes the scene with a unique key.
   */
  constructor() {
    super({
      key: SCENE_KEYS.OVERWORLD_SCENE,
    }); // Unique key for the scene, used to identify it in the game.

    // Initializing properties for objects in the scene.
    this.player = null; // Placeholder for player object.
    this.cursors = null; // Placeholder for cursor keys.

    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} instance initializing...`);
  }

  init() {
    // Undefined.
  }

  /**
   * Preload assets for the scene.
   * This method is called before create.
   */
  preload() {
    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} assets preloading...`);
    // Setting the base URL for loading assets.
    this.load.setBaseURL("https://labs.phaser.io"); // Getting assets from Phaser's website.

    // Assets from Phaser's website:
    this.load.image("sky", "assets/skies/space3.png"); // (key, path)
    this.load.image("logo", "assets/sprites/phaser3-logo.png"); // (key, path)
    this.load.image("red", "assets/particles/red.png"); // (key, path)

    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} assets preloaded!`);
  }

  /**
   * Create the game objects and sets up the scene.
   * This method is called after preload.
   */
  create() {
    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} creating scene...`);
    // Adding a background image to the scene.
    this.add.image(400, 300, "sky"); // (x position, y position, key)

    const particles = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    const logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    particles.startFollow(logo);

    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} scene created!`);
  }

  update() {
    // Undefined.
  }
}

export default OverworldScene;
