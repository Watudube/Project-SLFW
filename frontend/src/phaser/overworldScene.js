// Importing Dependencies:
import Phaser from "phaser";

// Importing Constants:
import { SCENE_KEYS } from "./sceneKeys";

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
    this.websocketService = null; // WebSocket service reference.

    // TODO: Decide if these properties are needed:
    this.entities = new Map(); // Store game entities.
    this.worldData = null; // Store world state.

    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} instance initializing...`);
  }

  init() {
    // Initialize keyboard controls:
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = this.input.keyboard.addKeys("W,S,A,D");

    // Input throttling properties:
    this.lastInputTime = 0; // milliseconds
    this.inputThrottle = 100; // milliseconds
  }

  /**
   * Sets the WebSocket service reference for this scene.
   * @param {WebSocketService} websocketService - The WebSocket service instance.
   */
  setWebSocketService(websocketService) {
    this.websocketService = websocketService;
    console.log("WebSocket service connected to OverworldScene");
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

    // WIP: Store the logo as our player for now
    this.player = logo;

    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} scene created!`);
  }

  update() {
    this.handleInput();
  }

  /**
   * Handle player input and send actions to server.
   */
  handleInput() {
    // If WebSocket service is not connected, do nothing, ensuring that we only
    // send actions when the connection is active.
    if (!this.websocketService || !this.websocketService.isConnected) return;

    // Throttle input to prevent spamming actions.
    const currentTime = this.time.now;
    if (currentTime - this.lastInputTime < this.inputThrottle) return;

    let action = null;
    let data = {};

    // Check for movement input:
    // WIP: Change the data object as needed.
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      action = "move";
      data = { direction: "west" };
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      action = "move";
      data = { direction: "east" };
    } else if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      action = "move";
      data = { direction: "north" };
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      action = "move";
      data = { direction: "south" };
    }

    // Send action to server if we have one.
    if (action) {
      this.websocketService.sendPlayerAction(action, data);
      this.lastInputTime = currentTime; // Update last input time to throttle further actions.
    }
  }

  // -------------------------------------

  /**
   * Handle world updates from the server
   * @param {object} data - World update data
   */
  handleWorldUpdate(data) {
    console.log("Handling world update in scene:", data);
    this.worldData = data;
    // Update world state based on server data
    // This could include terrain changes, weather, time of day, etc.
  }

  /**
   * Handle entity updates from the server
   * @param {object} data - Entity update data
   */
  handleEntityUpdate(data) {
    console.log("Handling entity update in scene:", data);

    // Update or create entities based on server data
    if (data.entities) {
      data.entities.forEach((entityData) => {
        const entityId = entityData.id;

        if (this.entities.has(entityId)) {
          // Update existing entity
          const entity = this.entities.get(entityId);
          entity.setPosition(entityData.x, entityData.y);
        } else {
          // Create new entity (placeholder - you'd create appropriate sprites)
          const entity = this.add.circle(entityData.x, entityData.y, 10, 0x00ff00);
          this.entities.set(entityId, entity);
        }
      });
    }
  }

  /**
   * Handle player updates from the server
   * @param {object} data - Player update data
   */
  handlePlayerUpdate(data) {
    console.log("Handling player update in scene:", data);

    // Update player position and state based on server data
    if (this.player && data.position) {
      this.player.setPosition(data.position.x, data.position.y);
    }

    // Update player stats, inventory, etc.
    if (data.stats) {
      // Handle player stats updates
    }
  }
}

export default OverworldScene;
