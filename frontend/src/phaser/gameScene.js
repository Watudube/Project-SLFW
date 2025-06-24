import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  /**
   * Constructor for the GameScene class.
   * Initializes the scene with a unique key.
   */
  constructor() {
    super({ key: GameScene.name }); // Unique key for the scene, used to identify it in the game.

    // Initializing properties for objects in the scene.
    this.player = null; // Placeholder for player object.
    this.cursors = null; // Placeholder for cursor keys.
  }

  /**
   * Preload assets for the scene.
   * This method is called before create.
   */
  preload() {
    // Setting the base URL for loading assets.
    this.load.setBaseURL("https://labs.phaser.io"); // Getting assets from Phaser's website.

    // Assets from Phaser's website:
    this.load.image("sky", "assets/skies/space3.png"); // (key, path)
    this.load.image("logo", "assets/sprites/phaser3-logo.png"); // (key, path)
    this.load.image("red", "assets/particles/red.png"); // (key, path)
  }

  /**
   * Create the game objects and sets up the scene.
   * This method is called after preload.
   */
  create() {
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
  }
}

export default GameScene;
