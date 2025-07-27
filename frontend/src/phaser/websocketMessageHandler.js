/**
 * WebSocket Message Handler
 *
 * Handles incoming WebSocket messages and routes them to appropriate scenes.
 * Provides clean separation between WebSocket communication and scene logic.
 */

/**
 * Handle incoming WebSocket messages.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} message - Parsed message from server.
 */
export function handleIncomingMessage(game, message) {
  const { type, data, status, error } = message;

  console.log(`WebSocketMessageHandler: Processing message type: ${type}.`);

  switch (type) {
    case "join_game_response":
      handleGameJoinResponse(game, { status, data, error });
      break;

    case "world_update":
      handleWorldUpdate(game, data);
      break;

    case "entity_update":
      handleEntityUpdate(game, data);
      break;

    case "player_update":
      handlePlayerUpdate(game, data);
      break;

    case "perception_update":
      handlePerceptionUpdate(game, data);
      break;

    case "player_disconnected":
      handlePlayerDisconnected(game, data);
      break;

    case "error":
      handleServerError(game, message.message || error);
      break;

    default:
      console.warn(`WebSocketMessageHandler: Unknown message type: ${type}.`);
  }
}

/**
 * Handle game join response from server.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} response - Server response containing status, data, and error.
 */
function handleGameJoinResponse(game, response) {
  console.log("WebSocketMessageHandler: Processing game join response:", response);

  const scene = game.scene.getScene("OVERWORLD_SCENE");
  console.log("WebSocketMessageHandler: Found scene:", !!scene);

  if (response.status === "success") {
    console.log("WebSocketMessageHandler: Game join successful!");
    if (scene && scene.handleGameJoined) {
      console.log("WebSocketMessageHandler: Calling scene.handleGameJoined.");
      scene.handleGameJoined(response.data);
    } else {
      console.warn("WebSocketMessageHandler: No scene found to handle game joined. Scene:", scene);
      console.warn("WebSocketMessageHandler: Scene has handleGameJoined method:", !!(scene && scene.handleGameJoined));
    }
  } else {
    console.error("WebSocketMessageHandler: Game join failed:", response.error);
    if (scene && scene.handleGameJoinError) {
      scene.handleGameJoinError(response.error);
    }
  }
}

/**
 * Handle world updates from server.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} data - World update data.
 */
function handleWorldUpdate(game, data) {
  const scene = game.scene.getScene("OVERWORLD_SCENE");
  if (scene && scene.handleWorldUpdate) {
    scene.handleWorldUpdate(data);
  }
}

/**
 * Handle entity updates from server.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} data - Entity update data.
 */
function handleEntityUpdate(game, data) {
  const scene = game.scene.getScene("OVERWORLD_SCENE");
  if (scene && scene.handleEntityUpdate) {
    scene.handleEntityUpdate(data);
  }
}

/**
 * Handle player updates from server.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} data - Player update data.
 */
function handlePlayerUpdate(game, data) {
  const scene = game.scene.getScene("OVERWORLD_SCENE");
  if (scene && scene.handlePlayerUpdate) {
    scene.handlePlayerUpdate(data);
  }
}

/**
 * Handle player disconnection notifications.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} data - Disconnection data.
 */
function handlePlayerDisconnected(game, data) {
  console.log("WebSocketMessageHandler: Player disconnected:", data);

  // Notify all relevant scenes.
  game.scene.scenes.forEach((scene) => {
    if (scene.handlePlayerDisconnected) {
      scene.handlePlayerDisconnected(data);
    }
  });
}

/**
 * Handle perception updates from server.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {object} data - Perception update data.
 */
function handlePerceptionUpdate(game, data) {
  const scene = game.scene.getScene("OVERWORLD_SCENE");
  if (scene && scene.handlePerceptionUpdate) {
    scene.handlePerceptionUpdate(data);
  }
}

/**
 * Handle server error messages.
 * @param {Phaser.Game} game - Phaser game instance.
 * @param {string} errorMessage - Error message from server.
 */
function handleServerError(game, errorMessage) {
  console.error("WebSocketMessageHandler: Server error:", errorMessage);

  // Notify all scenes about the error.
  game.scene.scenes.forEach((scene) => {
    if (scene.handleServerError) {
      scene.handleServerError(errorMessage);
    }
  });
}
