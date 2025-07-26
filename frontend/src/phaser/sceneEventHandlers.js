/**
 * Scene WebSocket Event Handlers
 *
 * Contains all WebSocket-related event handlers for game scenes.
 * Provides clean separation between scene logic and WebSocket handling.
 */

import SceneService from "./sceneService.js";

/**
 * Add WebSocket event handling methods to a scene.
 * @param {Phaser.Scene} scene - The scene to add handlers to.
 */
export function addWebSocketHandlers(scene) {
  /**
   * Handle successful game join and initial data from server.
   * @param {object} data - Initial game data from server.
   */
  scene.handleGameJoined = function (data) {
    console.log("SceneEventHandlers: [Start] Handling game joined, data:", data);

    // Check if scene is fully created (has layers).
    if (!this.tileLayer || !this.entityLayer) {
      console.warn(
        "SceneEventHandlers: Scene not fully created yet, layers missing. Deferring gameboard processing..."
      );
      // Store the data to process later when scene is ready.
      this.pendingGameboardData = data;
      return;
    }

    if (data.initial_gameboard) {
      console.log("✅ Found initial_gameboard, calling handleInitialGameboardData");
      this.handleInitialGameboardData(data.initial_gameboard);
      // Set scene as ready to receive updates.
      this.isGameReady = true;
      console.log("✅ Scene is now ready for input (isGameReady = true)");
    } else {
      console.error("❌ No initial_gameboard in data. Full data object:", data);
      this.isGameReady = false;
      console.log("❌ Scene NOT ready for input (isGameReady = false)");
    }

    console.log("SceneEventHandlers: [End] Handling game joined.");
  };

  /**
   * Handle game join errors from server.
   * @param {string} error - Error message from server.
   */
  scene.handleGameJoinError = function (error) {
    console.error("SceneEventHandlers: Game join failed:", error);

    // TODO: Could show error UI or attempt to reconnect.
    this.isGameReady = false;
  };

  /**
   * Handle initial gameboard data from server.
   * @param {object} gameboardData - Complete gameboard data.
   */
  scene.handleInitialGameboardData = function (gameboardData) {
    console.log("SceneEventHandlers: [Start] Processing initial gameboard, data:", gameboardData);

    this.gameboardData = gameboardData;

    // Clear and render the new gameboard.
    SceneService.clearWorld(this);
    SceneService.renderGameboard(this);
    SceneService.setupCamera(this);

    console.log("SceneEventHandlers: [End] Processing initial gameboard data.");
  };

  /**
   * Handle world updates from server.
   * @param {object} data - World update data.
   */
  scene.handleWorldUpdate = function (data) {
    console.log("SceneEventHandlers: [Start] Processing world update, data:", data);

    if (!this.isGameReady) {
      console.warn("Received world update before game is ready!");
      return;
    }

    // TODO: Login in here are generally placeholders, for now.
    // TODO: Add checks as needed.

    // Update gameboard data based on server changes.
    if (data.tiles) {
      SceneService.updateTiles(this, data.tiles);
    }

    // Handle level changes if provided.
    if (data.level_changes) {
      SceneService.handleLevelChanges(this, data.level_changes);
    }

    console.log("SceneEventHandlers: [End] Processing world update data.");
  };

  /**
   * Handle entity updates from server
   * @param {object} data - Entity update data
   */
  scene.handleEntityUpdate = function (data) {
    console.log("SceneEventHandlers: [Start] Processing entity update, data:", data);

    if (!this.isGameReady) {
      console.warn("SceneEventHandlers: Received entity update before game is ready");
      return;
    }

    // Handle entities based on server data.
    if (data.entities) {
      SceneService.updateEntities(this, data.entities);
    }

    // Handle new entities.
    if (data.new_entities) {
      SceneService.addNewEntities(this, data.new_entities);
    }

    // Handle entities that are to be removed.
    if (data.removed_entities) {
      SceneService.removeEntities(this, data.removed_entities);
    }

    console.log("SceneEventHandlers: [End] Processing entity update.");
  };

  /**
   * Handle player updates from server.
   * @param {object} data - Player update data.
   */
  scene.handlePlayerUpdate = function (data) {
    console.log("SceneEventHandlers: [Start] Processing player update, data:", data);

    if (!this.isGameReady) {
      console.warn("SceneEventHandlers: Received player update before game is ready");
      return;
    }

    // Update player position and state.
    if (data.position) {
      SceneService.updatePlayerPosition(this, data.position);
    }

    // Update player stats.
    if (data.stats) {
      SceneService.updatePlayerStats(this, data.stats);
    }

    // Update player inventory if provided.
    if (data.inventory) {
      SceneService.updatePlayerInventory(this, data.inventory);
    }

    console.log("SceneEventHandlers: [End] Processing player update.");
  };

  /**
   * Handle player disconnection events.
   * @param {object} data - Disconnection data.
   */
  scene.handlePlayerDisconnected = function (data) {
    console.log("SceneEventHandlers: [Start] Player disconnected data:", data);

    // Remove disconnected player from the scene.
    if (data.player_id && this.entities.has(data.player_id)) {
      const entity = this.entities.get(data.player_id);
      if (entity.sprite) {
        entity.sprite.destroy();
      }
      this.entities.delete(data.player_id);
    }

    console.log("SceneEventHandlers: [End] Player disconnected.");
  };

  /**
   * Handle server errors.
   * @param {string} errorMessage - Error message from server.
   */
  scene.handleServerError = function (errorMessage) {
    console.error("SceneEventHandlers: Server error:", errorMessage);

    // If error is critical, might need to disconnect.
    if (errorMessage.includes("authentication") || errorMessage.includes("session")) {
      this.handleCriticalError(errorMessage);
    }
  };

  /**
   * Handle connection errors.
   */
  scene.handleConnectionError = function () {
    console.warn("SceneEventHandlers: Connection error detected!");
    this.isGameReady = false;
  };

  /**
   * Handle disconnection events.
   * @param {object} event - Disconnection event.
   */
  scene.handleDisconnection = function (event) {
    console.log("SceneEventHandlers: [Start] Handling disconnection, event:", event);

    this.isGameReady = false;

    // Clean up game state thoroughly.
    SceneService.clearWorld(this);

    // Reset scene state if method exists.
    if (this.resetSceneState) {
      this.resetSceneState();
    }

    // Notify React layer about disconnection.
    if (this.onDisconnected) {
      console.log("SceneEventHandlers: Calling onDisconnected callback...");
      this.onDisconnected(event);
    } else {
      console.warn("SceneEventHandlers: No onDisconnected callback available!");
    }

    console.log("SceneEventHandlers: [End] Handling disconnection.");
  };

  /**
   * Handle critical errors that require disconnection.
   * @param {string} errorMessage - Critical error message.
   */
  scene.handleCriticalError = function (errorMessage) {
    console.error("SceneEventHandlers: Critical error:", errorMessage);

    // Force disconnection.
    if (this.game.webSocketManager) {
      this.game.webSocketManager.disconnect();
    }

    // Notify React layer.
    if (this.onCriticalError) {
      this.onCriticalError(errorMessage);
    }
  };

  /**
   * Handle authentication errors from server.
   * @param {string} errorMessage - Authentication error message.
   */
  scene.handleAuthenticationError = function (errorMessage) {
    console.error("SceneEventHandlers: Authentication error:", errorMessage);

    // Clear game state and scene immediately
    this.isGameReady = false;

    // Clean up scene completely
    SceneService.clearWorld(this);

    // Reset scene state if method exists
    if (this.resetSceneState) {
      console.log("SceneEventHandlers: Calling resetSceneState for authentication failure...");
      this.resetSceneState();
    }

    // Stop any ongoing input processing
    if (this.input && this.input.keyboard) {
      this.input.keyboard.removeAllKeys();
    }

    // Notify React layer about authentication failure
    if (this.onCriticalError) {
      console.log("SceneEventHandlers: Calling onCriticalError for authentication failure...");
      this.onCriticalError(`Authentication failed: ${errorMessage}`);
    } else {
      console.warn("SceneEventHandlers: No onCriticalError callback available for authentication failure!");
    }
  };

  // Initialize scene properties.
  scene.isGameReady = false;
}
