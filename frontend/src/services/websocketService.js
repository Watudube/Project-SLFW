// Importing Constants:
import { WEBSOCKET_BASEURL } from "./endpointURLs.js";

/**
 * This SHOULD be a !Singleton! service that manages WebSocket communication between
 * the frontend and the game server, avoid multiple instances! It handles:
 * - Connection management (connect, disconnect, reconnect).
 * - Message sending/receiving.
 * - Event system for other parts of your app to subscribe to updates.
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.userToken = null;

    // Event system: Map stores arrays of handler callback functions (see on() method) for each event type.
    // Example: this.eventHandlers.get('worldUpdate') = [handlerCallback1, handlerCallback2, ...]
    this.eventHandlers = new Map();
  }

  /**
   * Establishes WebSocket connection to the server
   * @param {string} url - WebSocket server URL (defaults to a base URL if no value provided).
   * @param {string} userToken - User authentication token.
   */
  connect(url = WEBSOCKET_BASEURL, userToken) {
    this.userToken = userToken;
    this.socket = new WebSocket(url);

    // Event handler: Fires when connection is successfully established.
    this.socket.onopen = () => {
      console.log("Connecting to WebSocket server...");

      // Join game session with the user token. On successful connection,
      // the server should send back a confirmation message and game data.
      console.log(`Joining game with user token: ${this.userToken}.`);
      this.socket.send(JSON.stringify({ type: "join_game", user_token: this.userToken }));

      this.isConnected = true;
      this.reconnectAttempts = 0; // Reset reconnect counter on successful connection.
      console.log("WebSocket connection established!");
    };

    // Event handler: Fires when server sends a message.
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data); // Convert JSON string to JS object.
      this.routeMessage(data); // Route message to appropriate handler based on message type.
    };

    // Event handler: Fires when connection is lost!
    this.socket.onclose = () => {
      console.log("WebSocket connection closed!");
      this.isConnected = false;
      this.attemptReconnect();
    };

    // Event handler: Fires when there's a connection error.
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  /**
   * Attempts to reconnect to the WebSocket server.
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect();
      }, 3000); // Wait 3 seconds before trying again.
    } else {
      console.error("Failed to reconnect after maximum attempts.");
      window.alert("Failed to reconnect to the game server. Please try again later.");
    }
  }

  /**
   * Sends player actions to the server.
   * @param {string} action - Type of action (e.g., 'move', 'interact', 'attack')
   * @param {object} data - Action-specific data (e.g., direction, target)
   */
  sendPlayerAction(action, data) {
    // Only send if connection is active.
    if (this.isConnected) {
      this.socket.send(
        // Create standardized message format for server:
        JSON.stringify({
          user_token: this.userToken, // Include user token for authentication.
          type: "player_action", // Specify message type as player action.
          action, // Specific player action type.
          data, // Action data payload.
        })
      );
    }
  }

  /**
   * Routes incoming server messages to appropriate event handlers.
   * @param {object} message - Parsed JSON message from server.
   */
  routeMessage(message) {
    const { type, data } = message;

    // TODO: Adjust or add more message handler types as needed.
    switch (type) {
      case "world_update":
        this.emit("worldUpdate", data);
        break;
      case "entity_update":
        this.emit("entityUpdate", data);
        break;
      case "player_update":
        this.emit("playerUpdate", data);
        break;
      case "join_game_response":
        console.log("Successfully joined game:", data);
        break;
      default:
        console.warn("Unknown message type:", type);
    }
  }

  /**
   * Registers a unique handler callback function (presumably defined from a phase scene
   * or react component object) to be called when a specific event is emitted.
   * NOTE TO DEVS: Corresponing event types should be defined in routeMessage() of this class.
   * @param {string} event - Event name to listen for.
   * @param {function} handler - Callback function to execute when event fires.
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Removes a specific handler for an event.
   * @param {string} event - Event name.
   * @param {function} handler - Handler function to remove.
   */
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1); // Remove the handler from the array.
      }
    }
  }

  /**
   * Trigger all registered handlers for a specific event.
   * @param {string} event - Event name to emit.
   * @param {object} data - Data to pass to all handlers.
   */
  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach((handler) => handler(data));
    }
  }

  /**
   * Closes the WebSocket connection.
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();
