// Importing Dependencies:
import Phaser from "phaser";

// Importing Services:
import SceneService from "./sceneService.js";

// Importing Event Handlers:
import { addWebSocketHandlers } from "./sceneEventHandlers.js";

// Importing Constants:
import { SCENE_KEYS } from "./sceneKeys";
import { sprites } from "../services/spriteDirectory.js";

/**
 * This scene represents the main game overworld where the player interacts with the game.
 */
class OverworldScene extends Phaser.Scene {
  /**
   * Initializes the scene with a unique key.
   */
  constructor() {
    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} instance initializing...`);

    super({
      key: SCENE_KEYS.OVERWORLD_SCENE,
    }); // Unique key for the scene, used to identify it in the game.

    // Initializing properties for objects in the scene.
    this.player = null; // Placeholder for player object.
    this.cursors = null; // Placeholder for cursor keys.

    // Game world data:
    this.gameboardData = null;
    this.tileSize = 16; // Size of each tile in pixels.
    this.tiles = new Map();
    this.entities = new Map();
    this.tileGrid = new Map();

    // Player data:
    this.playerEntity = null;
    this.playerTileId = null;

    // Layers for organized rendering:
    this.tileLayer = null;
    this.entityLayer = null;

    // Input throttling properties:
    this.lastInputTime = 0;
    this.inputThrottle = 200;

    // Game state:
    this.isGameReady = false;

    // React callback placeholders
    this.onDisconnected = null;
    this.onCriticalError = null;

    // Add WebSocket event handlers to this scene
    addWebSocketHandlers(this);
  }

  // ------------ Overwriting Phaser Scene Methods ------------ //

  /**
   * Initializes the scene, setting up keyboard controls and other keybinds.
   * This method is called once when the scene is created.
   */
  init() {
    console.log("Registering keybinds...");

    // Initialize keyboard controls:
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = this.input.keyboard.addKeys("W,S,A,D");
  }

  /**
   * Preload assets for the scene.
   * This method is called before create.
   */
  preload() {
    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} assets preloading...`);

    // Load all sprites from the sprite directory:
    Object.entries(sprites).forEach(([key, path]) => {
      this.load.image(key, path);
    });
  }

  /**
   * Create the game objects and sets up the scene.
   * This method is called after preload.
   */
  create() {
    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} creating scene...`);

    // Create layers for organized rendering:
    this.tileLayer = this.add.group();
    this.entityLayer = this.add.group();

    // Set up camera:
    this.cameras.main.setBackgroundColor(0x2c3e50);

    // Get React callbacks from game instance
    if (this.game.reactCallbacks) {
      this.setReactCallbacks(this.game.reactCallbacks.onDisconnected, this.game.reactCallbacks.onCriticalError);
    }
  }

  /**
   * Phaser built in update method.
   * This main update loop that runs every frame.
   */
  update() {
    this.handleInput();

    // TODO: Add more update logic as needed.
  }

  destroy() {
    // Clear all collections.
    this.tiles.clear();
    this.entities.clear();
    this.tileGrid.clear();

    // Call parent destroy.
    super.destroy();
  }

  // ---------------------------------------------- //
  // ------ Overworld Scene Specific Methods ------ //

  /**
   * Set callbacks for communicating with React layer
   * @param {Function} onDisconnected - Callback for disconnection
   * @param {Function} onCriticalError - Callback for critical errors
   */
  setReactCallbacks(onDisconnected, onCriticalError) {
    this.onDisconnected = onDisconnected;
    this.onCriticalError = onCriticalError;
  }

  /**
   * Handle player input and send actions to server.
   */
  handleInput() {
    // If WebSocket manager is not connected, do nothing.
    if (!this.game.webSocketManager || !this.game.webSocketManager.isConnectionActive()) {
      return;
    }

    // Only process input if game is ready.
    if (!this.isGameReady) {
      return;
    }

    // Throttle input to prevent spamming actions.
    const currentTime = this.time.now;
    if (currentTime - this.lastInputTime < this.inputThrottle) return;

    let action = null;
    let data = {};

    // TODO: For future input handling where player position is needed:
    const playerCoords = SceneService.getPlayerTileCoords(this);

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

    if (action) {
      this.game.webSocketManager.sendPlayerAction(action, data);
      this.lastInputTime = currentTime;
    }
  }
}

export default OverworldScene;
