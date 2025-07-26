// Importing Constants:
import { WEBSOCKET_BASEURL } from "../services/endpointURLs.js";

// Importing Message Handlers:
import { handleIncomingMessage } from "./websocketMessageHandler.js";

/**
 * WebSocket Manager for Phaser Game.
 * Handles all WebSocket communication from within the Phaser game context.
 */
class WebSocketManager {
  constructor(game) {
    this.game = game;
    this.socket = null;
    this.isConnected = false;
    this.userToken = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  /**
   * Connect to WebSocket server
   * @param {string} userToken - User authentication token
   * @param {string} url - WebSocket server URL (optional)
   */
  connect(userToken, url = WEBSOCKET_BASEURL) {
    if (this.isConnected || this.socket) {
      console.warn("WebSocket already connected or connecting!");
      return;
    }

    this.userToken = userToken;
    console.log("WebSocketManager: Connecting to server...");

    try {
      this.socket = new WebSocket(url);
      this.setupEventHandlers();
    } catch (error) {
      console.error("WebSocketManager: Failed to create WebSocket connection:", error);
      this.handleConnectionError();
    }
  }

  /**
   * Set up WebSocket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log("WebSocketManager: Connection established");
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Join game session
      this.sendMessage({
        type: "join_game",
        userToken: this.userToken,
      });
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocketManager: Received message:", data);

        // Route message to appropriate handler
        handleIncomingMessage(this.game, data);
      } catch (error) {
        console.error("WebSocketManager: Failed to parse message:", error);
      }
    };

    this.socket.onclose = (event) => {
      console.log("WebSocketManager: Connection closed", event.code, event.reason);
      this.isConnected = false;
      this.socket = null;

      // Handle reconnection if not a normal closure
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      } else {
        this.handleDisconnection(event);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocketManager: Connection error:", error);
      this.handleConnectionError();
    };
  }

  /**
   * Send a message to the server
   * @param {object} message - Message to send
   */
  sendMessage(message) {
    if (!this.isConnected || !this.socket) {
      console.warn("WebSocketManager: Cannot send message - not connected");
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("WebSocketManager: Failed to send message:", error);
      return false;
    }
  }

  /**
   * Send player action to server
   * @param {string} action - Action type
   * @param {object} data - Action data
   */
  sendPlayerAction(action, data) {
    return this.sendMessage({
      type: "player_action",
      userToken: this.userToken,
      action,
      data,
    });
  }

  /**
   * Attempt to reconnect to the server
   */
  attemptReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(
      `WebSocketManager: Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
    );

    setTimeout(() => {
      if (this.userToken) {
        this.connect(this.userToken);
      }
    }, delay);
  }

  /**
   * Handle connection errors
   */
  handleConnectionError() {
    // Notify game scenes about connection issues
    const scene = this.game.scene.getScene("OVERWORLD_SCENE");
    if (scene && scene.handleConnectionError) {
      scene.handleConnectionError();
    }
  }

  /**
   * Handle disconnection (when reconnection fails or is not attempted)
   */
  handleDisconnection(event) {
    console.log("WebSocketManager: Handling final disconnection");

    // Notify all scenes about disconnection
    this.game.scene.scenes.forEach((scene) => {
      if (scene.handleDisconnection) {
        scene.handleDisconnection(event);
      }
    });

    // Clear user token
    this.userToken = null;
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.isConnected = false;
      this.socket.close(1000, "User initiated disconnect");
      this.socket = null;
    }
    this.userToken = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Check if connected
   * @returns {boolean}
   */
  isConnectionActive() {
    return this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   * @returns {object}
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      hasSocket: !!this.socket,
      socketState: this.socket ? this.socket.readyState : null,
      hasUserToken: !!this.userToken,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

export default WebSocketManager;
