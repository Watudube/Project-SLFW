# Simplified WebSocket and Phaser Architecture

This document explains the new simplified architecture for WebSocket communication and Phaser game management.

## Overview

The previous architecture had complex coupling between React components and WebSocket event listeners, making it difficult to maintain and debug. The new architecture provides clear separation of concerns:

- **React Layer**: Handles UI, user authentication, and high-level navigation
- **Phaser Layer**: Owns and manages WebSocket connections, game state, and scene logic
- **Clear Boundaries**: Well-defined interfaces between layers

## Architecture Components

### 1. WebSocket Manager (`phaser/websocketManager.js`)

- **Purpose**: Manages WebSocket connections from within Phaser
- **Responsibilities**:
  - Connection establishment and management
  - Message sending/receiving
  - Automatic reconnection with exponential backoff
  - Error handling and connection monitoring
- **Owned by**: Phaser Game instance
- **Access**: `game.webSocketManager`

### 2. WebSocket Message Handler (`phaser/websocketMessageHandler.js`)

- **Purpose**: Routes incoming WebSocket messages to appropriate scene handlers
- **Responsibilities**:
  - Parse incoming messages
  - Route messages based on type
  - Handle message-specific logic
  - Error handling for malformed messages
- **Called by**: WebSocketManager when messages are received

### 3. Scene Event Handlers (`phaser/sceneEventHandlers.js`)

- **Purpose**: Provides WebSocket event handling capabilities to scenes
- **Responsibilities**:
  - Game join/leave handling
  - WebSocket event routing and processing
  - Error and disconnection handling
  - Critical error management
- **Used by**: OverworldScene (and other scenes)
- **Pattern**: Mixin pattern for reusable event handling
- **Dependencies**: Uses SceneService for all scene state updates

### 4. Scene Service (`phaser/sceneService.js`)

- **Purpose**: Centralized scene state management and rendering utilities
- **Responsibilities**:
  - World rendering (tiles, entities, camera)
  - Scene state updates (tiles, entities, player)
  - Game object management and cleanup
  - Level transitions and changes
- **Used by**: Scene event handlers and scenes directly
- **Pattern**: Static utility class

### 5. Simplified PhaserComponent (`components/PhaserComponent.jsx`)

- **Purpose**: Simple React wrapper for Phaser game
- **Responsibilities**:
  - Create and destroy Phaser game instance
  - Handle window resize events
  - Provide callbacks for React communication
  - Minimal WebSocket coordination
- **Simplified from**: Complex event listener management removed

### 6. Updated OverworldScene (`phaser/overworldScene.js`)

- **Purpose**: Main game scene with integrated WebSocket handling
- **Changes**:
  - Uses WebSocketManager instead of external service
  - Integrated event handlers from mixin
  - Cleaner input handling
  - Better error handling and state management

## Communication Flow

### 1. Connection Establishment

```
React (PhaserComponent) → Phaser Game → WebSocketManager → Server
```

### 2. Incoming Messages

```
Server → WebSocketManager → MessageHandler → Scene Event Handlers → SceneService → Scene Update
```

### 3. Outgoing Messages (Player Actions)

```
Scene Input → WebSocketManager → Server
```

### 4. Disconnection/Errors

```
WebSocketManager → Scene Handlers → React Callbacks → Navigation/Logout
```

## Benefits of New Architecture

### 1. **Clear Separation of Concerns**

- React handles UI and navigation
- Phaser handles game logic and WebSocket communication
- No complex coupling between layers

### 2. **Simplified Event Management**

- No manual event listener setup/cleanup in React
- Event handlers are self-contained within Phaser
- Automatic cleanup when game is destroyed

### 3. **Better Error Handling**

- Centralized error handling in WebSocketManager
- Automatic reconnection with exponential backoff
- Clear error propagation to React layer

### 4. **Improved Maintainability**

- Each file has a single, clear responsibility
- SceneService provides centralized scene state management
- Easy to test individual components
- Simple to add new message types or scenes
- Clean separation between WebSocket events and scene logic

### 5. **Enhanced Code Reusability**

- SceneService methods can be used independently of WebSocket events
- Scene state operations are standardized and consistent
- Helper methods are accessible to all scenes and components
- Reduced code duplication across different scenes

### 5. **Robust Connection Management**

- Connection owned by Phaser (game lifetime)
- Proper cleanup on game destruction
- No race conditions between React and Phaser

## File Organization

```
frontend/src/
├── phaser/
│   ├── websocketManager.js      # WebSocket connection management
│   ├── websocketMessageHandler.js  # Message routing
│   ├── sceneEventHandlers.js   # Scene event handling mixin
│   ├── sceneService.js         # Scene state management and rendering
│   └── overworldScene.js       # Updated main scene
├── components/
│   └── PhaserComponent.jsx     # Simplified Phaser wrapper
├── pages/
│   └── GamePage.jsx           # Simplified game page
└── services/
    └── websocketService.js    # DEPRECATED - kept for reference
```

## Migration Notes

### What Changed

- WebSocket connection moved from React to Phaser
- Event listeners consolidated into scene handlers
- PhaserComponent significantly simplified
- GamePage no longer manages WebSocket connections

### What Stayed the Same

- User authentication flow
- Game rendering and physics
- Basic game functionality
- UI components and styling

### Breaking Changes

- `websocketService` is no longer used in React components
- PhaserComponent no longer accepts `websocketService` prop
- GamePage no longer needs WebSocket useEffect

## Usage Examples

### Adding a New Message Type

1. Add case in `websocketMessageHandler.js`
2. Add handler method in `sceneEventHandlers.js`
3. Use SceneService methods for scene updates if needed
4. Use handler in your scene

### Adding a New Scene

1. Create scene class
2. Add `addWebSocketHandlers(this)` in constructor
3. Implement required handler methods
4. Use SceneService for scene state management
5. Add to Phaser config

### Using SceneService Methods

```javascript
// Direct scene state management:
SceneService.updateTiles(scene, tilesData);
SceneService.updatePlayerPosition(scene, positionData);
SceneService.clearWorld(scene);
SceneService.renderGameboard(scene);

// In WebSocket event handlers (automatically called):
SceneService.updateEntities(this, data.entities);
SceneService.addNewEntities(this, data.new_entities);
```

### Sending Player Actions

```javascript
// In scene:
this.game.webSocketManager.sendPlayerAction("move", { direction: "north" });
```

### Handling Disconnections

```javascript
// Automatically handled, but you can add custom logic:
scene.handleDisconnection = function (event) {
  // Custom disconnection logic
  // React callbacks are automatically called
};
```

This new architecture provides a much cleaner, more maintainable foundation for your game's networking layer.

## Recent Improvements

### SceneService Refactoring

The helper methods have been moved from `sceneEventHandlers.js` to `SceneService.js` for better separation of concerns:

**Before:**

- Mixed WebSocket event handling with scene state management
- Helper methods tied to WebSocket events
- Code duplication potential across scenes

**After:**

- Pure WebSocket event handling in `sceneEventHandlers.js`
- Centralized scene state management in `SceneService.js`
- Reusable, testable scene operations
- Clear API: `SceneService.methodName(scene, data)`

### Benefits of the Refactor

1. **Single Responsibility**: Each file has one clear purpose
2. **Reusability**: SceneService methods work independently of WebSocket events
3. **Testability**: Easier to unit test scene operations
4. **Consistency**: Standardized API for all scene state operations
5. **Maintainability**: Changes to scene logic centralized in one place

This architecture now provides optimal separation between communication (WebSocket) and game state management (SceneService).
