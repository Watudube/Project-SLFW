// Dependencies:
import Phaser from "phaser";

// Services:
import SceneService from "./sceneService.js";

// Event Handlers:
import { addWebSocketHandlers } from "./sceneEventHandlers.js";

// Constants:
import { SCENE_KEYS } from "./sceneKeys";
import { sprites } from "../services/spriteDirectory.js";

/**
 * Main game overworld scene where the player interacts with the game.
 */
class OverworldScene extends Phaser.Scene {
  /**
   * Initialize the scene with a unique key.
   */
  constructor() {
    console.log(`${SCENE_KEYS.OVERWORLD_SCENE} instance initializing...`);

    super({
      key: SCENE_KEYS.OVERWORLD_SCENE,
    });

    // Initialize properties for objects in the scene.
    this.player = null;
    this.cursors = null;

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

    // React callback placeholders:
    this.onDisconnected = null;
    this.onCriticalError = null;

    // Add WebSocket event handlers to this scene.
    addWebSocketHandlers(this);
  }

  // -------------------- Phaser Scene Methods -------------------- //

  /**
   * Initialize the scene, setting up keyboard controls and other keybinds.
   * This method is called once when the scene is created.
   */
  init() {
    console.log("[OverworldScene] init() called - Initializing scene...");

    // Initialize scene state variables (don't call resetSceneState here as layers don't exist yet).
    this.player = null;
    this.gameboardData = null;
    this.playerEntity = null;
    this.playerTileId = null;
    this.isGameReady = false;

    // Initialize collections.
    this.tiles = new Map();
    this.entities = new Map();
    this.tileGrid = new Map();

    console.log("[OverworldScene] Scene state initialized");

    // Initialize keyboard controls with error checking.
    try {
      console.log("[OverworldScene] Creating keyboard controls...");
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys("W,S,A,D");
      console.log("[OverworldScene] Keyboard inputs initialized successfully:", {
        cursors: this.cursors,
        wasdKeys: this.wasdKeys,
      });
    } catch (error) {
      console.error("[OverworldScene] Failed to initialize keyboard inputs:", error);
      // Set them to null so create() can try again.
      this.cursors = null;
      this.wasdKeys = null;
    }

    // Add WebSocket event handlers to this scene.
    addWebSocketHandlers(this);
    console.log("[OverworldScene] WebSocket event handlers added");

    console.log("[OverworldScene] init() completed successfully");
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
    console.log(`[${SCENE_KEYS.OVERWORLD_SCENE}] create() called - Creating scene...`);

    // Ensure keyboard inputs are properly set up (fallback if init failed)
    try {
      if (!this.cursors) {
        console.warn("[OverworldScene] Cursors not found, recreating...");
        this.cursors = this.input.keyboard.createCursorKeys();
      }
      if (!this.wasdKeys) {
        console.warn("[OverworldScene] WASD keys not found, recreating...");
        this.wasdKeys = this.input.keyboard.addKeys("W,S,A,D");
      }
      console.log("[OverworldScene] Keyboard setup verified:", {
        cursors: this.cursors,
        wasdKeys: this.wasdKeys,
      });
    } catch (error) {
      console.error("[OverworldScene] Failed to set up keyboard inputs in create:", error);
    }

    // Create layers for organized rendering:
    console.log("[OverworldScene] Creating display layers...");
    this.tileLayer = this.add.group();
    this.entityLayer = this.add.group();
    console.log("[OverworldScene] Display layers created:", {
      tileLayer: this.tileLayer,
      entityLayer: this.entityLayer,
    });

    // Set up camera:
    this.cameras.main.setBackgroundColor(0x2c3e50);
    console.log("[OverworldScene] Camera background set");

    // Get React callbacks from game instance
    if (this.game.reactCallbacks) {
      this.setReactCallbacks(this.game.reactCallbacks.onDisconnected, this.game.reactCallbacks.onCriticalError);
      console.log("[OverworldScene] React callbacks set up");
    } else {
      console.warn("[OverworldScene] No React callbacks found on game instance");
    }

    console.log(`[${SCENE_KEYS.OVERWORLD_SCENE}] create() completed - Scene ready for game join`);
    console.log(`[OverworldScene] Keyboard inputs status - Cursors: ${!!this.cursors}, WASD: ${!!this.wasdKeys}`);

    // Process any pending gameboard data that arrived before scene was ready
    if (this.pendingGameboardData) {
      console.log("[OverworldScene] Processing pending gameboard data...");
      this.handleGameJoined(this.pendingGameboardData);
      this.pendingGameboardData = null;
    }
  }

  /**
   * Phaser built in update method.
   * This main update loop that runs every frame.
   */
  update() {
    // Test keyboard inputs even when game isn't ready (for debugging)
    this.testKeyboardInputs();

    this.handleInput();

    // TODO: Add more update logic as needed.
  }

  /**
   * Test keyboard inputs for debugging
   */
  testKeyboardInputs() {
    try {
      // Test if this.input exists and has keyboard property
      if (!this.input) {
        console.log("[OverworldScene] this.input is null/undefined");
        return;
      }

      if (!this.input.keyboard) {
        console.log("[OverworldScene] this.input.keyboard is null/undefined");
        return;
      }

      // Test if cursors exist
      if (this.cursors) {
        if (this.cursors.left.isDown) {
          console.log("[OverworldScene] Left arrow key detected!");
        }
        if (this.cursors.right.isDown) {
          console.log("[OverworldScene] Right arrow key detected!");
        }
        if (this.cursors.up.isDown) {
          console.log("[OverworldScene] Up arrow key detected!");
        }
        if (this.cursors.down.isDown) {
          console.log("[OverworldScene] Down arrow key detected!");
        }
      }

      // Test if WASD keys exist
      if (this.wasdKeys) {
        if (this.wasdKeys.W.isDown) {
          console.log("[OverworldScene] W key detected!");
        }
        if (this.wasdKeys.A.isDown) {
          console.log("[OverworldScene] A key detected!");
        }
        if (this.wasdKeys.S.isDown) {
          console.log("[OverworldScene] S key detected!");
        }
        if (this.wasdKeys.D.isDown) {
          console.log("[OverworldScene] D key detected!");
        }
      }
    } catch (error) {
      console.error("[OverworldScene] Error in testKeyboardInputs:", error);
    }
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
   * Reset all scene state for a fresh start
   * This should only be called when the scene needs to be completely cleared
   */
  resetSceneState() {
    console.log("[OverworldScene] resetSceneState() called - Clearing scene state...");

    // Clear all game objects and data
    this.player = null;
    this.gameboardData = null;
    this.playerEntity = null;
    this.playerTileId = null;

    // Clear all collections safely
    if (this.tiles) {
      console.log("[OverworldScene] Clearing tiles collection...");
      this.tiles.clear();
    }
    if (this.entities) {
      console.log("[OverworldScene] Clearing entities collection...");
      this.entities.clear();
    }
    if (this.tileGrid) {
      console.log("[OverworldScene] Clearing tileGrid collection...");
      this.tileGrid.clear();
    }

    // Only clear layers if they exist and are valid Phaser objects
    if (this.tileLayer && this.tileLayer.destroy) {
      console.log("[OverworldScene] Destroying tile layer...");
      this.tileLayer.destroy();
    }
    if (this.entityLayer && this.entityLayer.destroy) {
      console.log("[OverworldScene] Destroying entity layer...");
      this.entityLayer.destroy();
    }

    // Reset layers to null (they'll be recreated in create())
    this.tileLayer = null;
    this.entityLayer = null;

    // Reset game state
    this.isGameReady = false;

    // Reset callbacks (but don't clear keyboard inputs - they should persist)
    this.onDisconnected = null;
    this.onCriticalError = null;

    console.log("[OverworldScene] resetSceneState() completed");
  }

  /**
   * Handle player input and send actions to server.
   */
  handleInput() {
    // Check if keyboard inputs are available
    if (!this.cursors || !this.wasdKeys) {
      console.warn("OverworldScene: Keyboard inputs not initialized");
      return;
    }

    // If WebSocket manager is not connected, do nothing.
    if (!this.game.webSocketManager || !this.game.webSocketManager.isConnectionActive()) {
      // console.log("OverworldScene: WebSocket not connected, skipping input");
      return;
    }

    // Only process input if game is ready.
    if (!this.isGameReady) {
      console.log("OverworldScene: Game not ready, skipping input. isGameReady:", this.isGameReady);
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
      console.log("OverworldScene: Sending player action:", action, data);
      this.game.webSocketManager.sendPlayerAction(action, data);
      this.lastInputTime = currentTime;
    }
  }
}

export default OverworldScene;
