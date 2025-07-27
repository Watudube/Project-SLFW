// Constants:
import { WEBSOCKET_BASEURL } from "../services/endpointURLs.js";

// Message Handlers:
import { handleIncomingMessage } from "./websocketMessageHandler.js";

/**
 * WebSocket Manager for Phaser Game.
 *
 * Handles all WebSocket communication from within the Phaser game context.
 */
class WebSocketManager {
  constructor(game, userToken = null) {
    this.game = game;
    this.socket = null;
    this.isConnected = false;
    this.userToken = userToken;
  }

  /**
   * Connect to WebSocket server.
   * @param {string} url - WebSocket server URL (default: WEBSOCKET_BASEURL).
   */
  connect(url = WEBSOCKET_BASEURL) {
    if (this.isConnected || this.socket) {
      console.warn("WebSocketManager: WebSocket already connected or connecting!");
      return;
    }

    try {
      console.log("WebSocketManager: Connecting to WebSocket server at", url);
      this.socket = new WebSocket(url); // This creates a new WebSocket instance and connects it to the server.
      this.setupEventHandlers();
    } catch (error) {
      console.error("WebSocketManager: Failed to create WebSocket connection:", error);
      this.handleConnectionError();
    }
  }

  /**
   * Setup WebSocket event handlers, handles connection open (including initial game join),
   * message receive, close, and error events.
   * @returns {void}
   * */
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log("WebSocketManager: Connection established!");
      this.isConnected = true;

      // Join game session with current token.
      const joinMessage = {
        type: "join_game",
        userToken: this.userToken,
      };
      console.log(
        "WebSocketManager: Sending join_game with token:",
        this.userToken ? `${this.userToken.substring(0, 10)}...` : "null"
      );
      this.sendMessage(joinMessage);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocketManager: Received message:", data);

        // Route message to appropriate handler:
        handleIncomingMessage(this.game, data);
      } catch (error) {
        console.error("WebSocketManager: Failed to process message:", error);
        console.error("Message data:", event.data);
      }
    };

    this.socket.onclose = (event) => {
      console.log("WebSocketManager: Connection closed!", event.code, event.reason);
      this.isConnected = false;

      // Don't handle disconnection if we already handled it in disconnect().
      if (event.reason === "User initiated disconnect") {
        this.socket = null;
        return;
      }

      // Check if this was due to invalid token (backend sends code 1008 for invalid token):
      if (event.code === 1008 && event.reason === "Invalid token") {
        console.log("WebSocketManager: Connection closed due to invalid token - triggering critical error.");
        // For authentication failures, trigger critical error callback directly
        if (this.game.reactCallbacks && this.game.reactCallbacks.onCriticalError) {
          this.game.reactCallbacks.onCriticalError("Authentication failed: Invalid token");
        }
      }

      this.socket = null; // Clear socket reference to prevent further messages.

      // Always handle disconnection. Design choice: We don't want to attempt to reconnect automatically and risk partial initialization of some states.
      this.handleDisconnection(event);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocketManager: Connection error:", error);
      this.handleConnectionError();
    };
  }

  /**
   * Send a message to the server.
   * @param {object} message - Message to send.
   */
  sendMessage(message) {
    if (!this.isConnected || !this.socket) {
      console.warn("WebSocketManager: Cannot send message - not connected!");
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
   * Send player action to server.
   * @param {string} action - Action type.
   * @param {object} data - Action data.
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
   * Handle connection errors.
   */
  handleConnectionError() {
    // Notify game scenes about connection issues
    const scene = this.game.scene.getScene("OVERWORLD_SCENE");
    if (scene && scene.handleConnectionError) {
      scene.handleConnectionError();
    }
  }

  /**
   * Handle disconnection (when reconnection fails or is not attempted).
   */
  handleDisconnection(event) {
    console.log("WebSocketManager: Handling final disconnection:", event);

    // Notify all scenes about disconnection
    this.game.scene.scenes.forEach((scene) => {
      if (scene.handleDisconnection) {
        console.log("WebSocketManager: Notifying scene about disconnection:", scene.scene.key);
        scene.handleDisconnection(event);
      }
    });

    // For unexpected disconnections, ensure React callbacks are triggered
    // This provides a safety net in case scene callbacks don't work
    if (!event.wasUserInitiated) {
      console.log("WebSocketManager: Unexpected disconnection detected - ensuring React callback is triggered:");

      // Try to trigger the onDisconnected callback as a fallback
      if (this.game.reactCallbacks && this.game.reactCallbacks.onDisconnected) {
        console.log("WebSocketManager: Triggering React onDisconnected callback for unexpected disconnection:");
        this.game.reactCallbacks.onDisconnected(event);
      } else {
        console.warn("WebSocketManager: No React onDisconnected callback available!");
      }
    }

    // Clear user token
    this.userToken = null;
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    console.log("WebSocketManager: disconnect() called.");

    if (this.socket) {
      console.log("WebSocketManager: Closing WebSocket connection...");
      this.isConnected = false;

      // Call handleDisconnection BEFORE closing to ensure React callbacks work
      this.handleDisconnection({ code: 1000, reason: "User initiated disconnect", wasUserInitiated: true });

      // Close the socket if it's not already closed
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close(1000, "User initiated disconnect");
      }
      this.socket = null;
    } else {
      console.log("WebSocketManager: No socket to disconnect! No action taken.");
    }

    // Clear user token as part of cleanup
    this.userToken = null;
    console.log("WebSocketManager: disconnect() completed!");
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
    };
  }
}

export default WebSocketManager;
