import Phaser from "phaser";

/**
 * Utility methods for managing the game scene, including rendering tiles and entities.
 */
class SceneService {
  /**
   * Clear all world objects and references from the scene.
   * @param {Phaser.Scene} scene
   */
  static clearWorld(scene) {
    console.log("SceneService: Clearing world...");

    // Delete all tiles and entities from the scene's memory.
    if (scene.tiles) {
      scene.tiles.forEach((tile) => {
        if (tile.sprite) {
          tile.sprite.destroy();
        }
      });
      scene.tiles.clear();
    }

    if (scene.entities) {
      scene.entities.forEach((entity) => {
        if (entity.sprite) {
          entity.sprite.destroy();
        }
      });
      scene.entities.clear();
    }

    // Clear tile grid
    if (scene.tileGrid) {
      scene.tileGrid.clear();
    }

    // Clear and destroy layers.
    if (scene.tileLayer) {
      scene.tileLayer.clear(true, true);
      scene.tileLayer.destroy();
      scene.tileLayer = null;
    }
    if (scene.entityLayer) {
      scene.entityLayer.clear(true, true);
      scene.entityLayer.destroy();
      scene.entityLayer = null;
    }

    // Clear player references.
    if (scene.player) {
      scene.player.destroy();
      scene.player = null;
    }

    scene.playerEntity = null;
    scene.playerTileId = null;

    console.log("SceneService: World cleared successfully.");
  }

  /**
   * Render all tiles and entities for the current gameboard.
   * @param {Phaser.Scene} scene
   */
  static renderGameboard(scene) {
    if (!scene.gameboardData || !scene.gameboardData.levels) {
      console.warn("No gameboard data to render!");
      console.log("Current gameboard data:");
      console.log(scene.gameboardData);
      return;
    }

    // Ensure layers exist before rendering anything
    if (!scene.tileLayer) {
      console.warn("SceneService: tileLayer not found during gameboard render, creating...");
      if (!scene.add) {
        console.error("SceneService: Scene.add is not available! Scene may not be fully initialized.");
        return;
      }
      scene.tileLayer = scene.add.group();
    }
    if (!scene.entityLayer) {
      console.warn("SceneService: entityLayer not found during gameboard render, creating...");
      if (!scene.add) {
        console.error("SceneService: Scene.add is not available! Scene may not be fully initialized.");
        return;
      }
      scene.entityLayer = scene.add.group();
    }

    // TODO: Add logic to set level based on player's current position.
    // For now, we are setting the first level as the active level.
    const level = scene.gameboardData.levels[0];
    if (!level || !level.tiles) {
      console.warn("No level or tiles data found!");
      return;
    }

    level.tiles.forEach((tile) => SceneService.renderTile(scene, tile));

    // Render all entities but keep them hidden - they will be shown via perception updates
    level.tiles.forEach((tile) => {
      if (tile.entities && tile.entities.length > 0) {
        tile.entities.forEach((entity) => SceneService.renderEntity(scene, entity, tile));
      }
    });

    console.log(`Rendering level with ${level.id}...`);
  }

  /**
   * Render a single tile.
   * @param {Phaser.Scene} scene
   * @param {object} tileData
   */
  static renderTile(scene, tileData) {
    // Ensure layers exist before rendering
    if (!scene.tileLayer) {
      console.warn("SceneService: tileLayer not found, recreating layers...");
      scene.tileLayer = scene.add.group();
    }
    if (!scene.entityLayer) {
      console.warn("SceneService: entityLayer not found, recreating layers...");
      scene.entityLayer = scene.add.group();
    }

    const x = tileData.x_coord * scene.tileSize;
    const y = tileData.y_coord * scene.tileSize;
    let spriteKey = tileData.sprite;

    console.log(`Rendering tile at (${tileData.x_coord}, ${tileData.y_coord}) with sprite '${spriteKey}'.`);

    // Validate sprite exists before using.
    if (!scene.textures.exists(spriteKey)) {
      console.warn(`Sprite key '${spriteKey}' not found, using placeholder...`);
      spriteKey = "placeholder";
    }

    const tileSprite = scene.add.image(x, y, spriteKey);
    tileSprite.setOrigin(0, 0);
    tileSprite.setDisplaySize(scene.tileSize, scene.tileSize);
    // Hide tiles by default - they will be shown via perception updates
    tileSprite.setVisible(false);
    scene.tileLayer.add(tileSprite);

    scene.tiles.set(tileData.id, { sprite: tileSprite, data: tileData });
    const coordKey = `${tileData.x_coord},${tileData.y_coord}`;
    scene.tileGrid.set(coordKey, tileData);
  }

  /**
   * Render a single entity.
   * @param {Phaser.Scene} scene
   * @param {object} entityData
   * @param {object} tileData
   */
  static renderEntity(scene, entityData, tileData) {
    // Ensure layers exist before rendering
    if (!scene.entityLayer) {
      console.warn("SceneService: entityLayer not found, recreating layers...");
      scene.entityLayer = scene.add.group();
    }
    if (!scene.tileLayer) {
      console.warn("SceneService: tileLayer not found, recreating layers...");
      scene.tileLayer = scene.add.group();
    }

    const x = tileData.x_coord * scene.tileSize + scene.tileSize / 2;
    const y = tileData.y_coord * scene.tileSize + scene.tileSize / 2;
    const entitySprite = scene.add.image(x, y, entityData.sprite);
    entitySprite.setOrigin(0.5, 0.5);
    // Hide entities by default - they will be shown via perception updates
    entitySprite.setVisible(false);
    scene.entityLayer.add(entitySprite);

    scene.entities.set(entityData.id, { sprite: entitySprite, data: entityData, tileId: tileData.id });
    if (entityData.name === "Player") {
      // If this is the player entity, update the scene's player reference
      if (scene.player) {
        scene.player.destroy();
      }

      scene.player = entitySprite;
      scene.playerEntity = entityData;
      scene.playerTileId = tileData.id;
    }
  }

  /**
   * Utility: Get current player tile coordinates.
   */
  static getPlayerTileCoords(scene) {
    if (!scene.playerTileId) return null;
    const tileInfo = scene.tiles.get(scene.playerTileId);
    if (!tileInfo) return null;
    return { x: tileInfo.data.x_coord, y: tileInfo.data.y_coord };
  }

  /**
   * Setup camera to follow player or center on gameboard.
   */
  static setupCamera(scene) {
    if (scene.player) {
      // Center camera on player:
      scene.cameras.main.centerOn(scene.player.x, scene.player.y);
      scene.cameras.main.startFollow(scene.player);
    } else if (scene.gameboardData?.levels?.[0]) {
      // Center camera on middle of the gameboard:
      const level = scene.gameboardData.levels[0];
      const centerX = (level.width * scene.tileSize) / 2;
      const centerY = (level.length * scene.tileSize) / 2;
      scene.cameras.main.centerOn(centerX, centerY);
    }

    if (scene.gameboardData?.levels?.[0]) {
      const level = scene.gameboardData.levels[0];
      scene.cameras.main.setBounds(0, 0, level.width * scene.tileSize, level.length * scene.tileSize);
    }
  }

  // ------------ Scene State Update Methods ------------ //

  /**
   * Update tiles based on server data
   * @param {Phaser.Scene} scene
   * @param {Array} tilesData - Array of tile updates
   */
  static updateTiles(scene, tilesData) {
    tilesData.forEach((tileData) => {
      if (scene.tiles.has(tileData.id)) {
        // Update existing tile
        const tile = scene.tiles.get(tileData.id);
        tile.data = { ...tile.data, ...tileData };

        // Update sprite if needed
        if (tileData.sprite && tile.sprite) {
          tile.sprite.setTexture(tileData.sprite);
        }
      } else {
        // Render new tile
        SceneService.renderTile(scene, tileData);
      }
    });
  }

  /**
   * Update entities based on server data
   * @param {Phaser.Scene} scene
   * @param {Array} entitiesData - Array of entity updates
   */
  static updateEntities(scene, entitiesData) {
    entitiesData.forEach((entityData) => {
      if (scene.entities.has(entityData.id)) {
        const entity = scene.entities.get(entityData.id);
        entity.data = { ...entity.data, ...entityData };

        // Update sprite position if needed
        if (entityData.position && entity.sprite) {
          const tileInfo = scene.tiles.get(entity.tileId);
          if (tileInfo) {
            const x = tileInfo.data.x_coord * scene.tileSize + scene.tileSize / 2;
            const y = tileInfo.data.y_coord * scene.tileSize + scene.tileSize / 2;
            entity.sprite.setPosition(x, y);
          }
        }
      }
    });
  }

  /**
   * Add new entities to the scene
   * @param {Phaser.Scene} scene
   * @param {Array} newEntities - Array of new entities
   */
  static addNewEntities(scene, newEntities) {
    newEntities.forEach((entityData) => {
      const tileInfo = scene.tiles.get(entityData.tile_id);
      if (tileInfo) {
        SceneService.renderEntity(scene, entityData, tileInfo.data);
      }
    });
  }

  /**
   * Remove entities from the scene
   * @param {Phaser.Scene} scene
   * @param {Array} entityIds - Array of entity IDs to remove
   */
  static removeEntities(scene, entityIds) {
    entityIds.forEach((entityId) => {
      if (scene.entities.has(entityId)) {
        const entity = scene.entities.get(entityId);
        if (entity.sprite) {
          entity.sprite.destroy();
        }
        scene.entities.delete(entityId);
      }
    });
  }

  /**
   * Update player position
   * @param {Phaser.Scene} scene
   * @param {object} positionData - New position data
   */
  static updatePlayerPosition(scene, positionData) {
    if (scene.player && positionData.tile_id) {
      const tileInfo = scene.tiles.get(positionData.tile_id);
      if (tileInfo) {
        const x = tileInfo.data.x_coord * scene.tileSize + scene.tileSize / 2;
        const y = tileInfo.data.y_coord * scene.tileSize + scene.tileSize / 2;

        // Smooth movement animation could be added here
        scene.player.setPosition(x, y);

        // Update player tile reference
        scene.playerTileId = positionData.tile_id;

        // Update camera to follow player
        scene.cameras.main.centerOn(x, y);
      }
    }
  }

  /**
   * Update player stats
   * @param {Phaser.Scene} scene
   * @param {object} statsData - New stats data
   */
  static updatePlayerStats(scene, statsData) {
    if (scene.playerEntity) {
      scene.playerEntity = { ...scene.playerEntity, ...statsData };
    }
  }

  /**
   * Update player inventory
   * @param {Phaser.Scene} scene
   * @param {object} inventoryData - New inventory data
   */
  static updatePlayerInventory(scene, inventoryData) {
    // Handle inventory updates
    console.log("SceneService: Updating player inventory:", inventoryData);

    // TODO: Implement inventory update logic
    // This could update UI elements, player data, etc.
  }

  /**
   * Handle level changes
   * @param {Phaser.Scene} scene
   * @param {object} levelChanges - Level change data
   */
  static handleLevelChanges(scene, levelChanges) {
    console.log("SceneService: Handling level changes:", levelChanges);

    // Could implement level transitions here
    // For now, just re-render the gameboard
    if (levelChanges.new_level) {
      scene.gameboardData = levelChanges.new_level;
      SceneService.clearWorld(scene);
      SceneService.renderGameboard(scene);
      SceneService.setupCamera(scene);
    }
  }

  /**
   * Update perception area with tiles from perception update
   * @param {Phaser.Scene} scene
   * @param {Array} perceptionTiles - Array of tiles within player's perception radius
   */
  static updatePerceptionArea(scene, perceptionTiles) {
    console.log("SceneService: Updating perception area with", perceptionTiles.length, "tiles");

    // Create a set of currently visible tile IDs for efficient lookup
    const visibleTileIds = new Set(perceptionTiles.map(tile => tile.id));

    // Hide/show tiles based on perception
    scene.tiles.forEach((tileInfo, tileId) => {
      if (tileInfo.sprite) {
        // Show tile if it's in perception, hide if not
        tileInfo.sprite.setVisible(visibleTileIds.has(tileId));
      }
    });

    // Hide/show entities based on their tile's visibility
    scene.entities.forEach((entityInfo, entityId) => {
      if (entityInfo.sprite && entityInfo.tileId) {
        // Show entity if its tile is in perception, hide if not
        entityInfo.sprite.setVisible(visibleTileIds.has(entityInfo.tileId));
      }
    });

    // Update tile data with fresh perception data
    perceptionTiles.forEach((tileData) => {
      if (scene.tiles.has(tileData.id)) {
        // Update existing tile data
        const tileInfo = scene.tiles.get(tileData.id);
        tileInfo.data = { ...tileInfo.data, ...tileData };
        
        // Update entities on this tile
        if (tileData.entities && tileData.entities.length > 0) {
          SceneService.updateEntitiesOnTile(scene, tileData);
        }
      } else {
        // Render new tile that came into perception
        SceneService.renderTile(scene, tileData);
        
        // Render entities on this new tile
        if (tileData.entities && tileData.entities.length > 0) {
          tileData.entities.forEach((entity) => SceneService.renderEntity(scene, entity, tileData));
        }
      }
    });

    console.log("SceneService: Perception area update completed");
  }

  /**
   * Update entities on a specific tile
   * @param {Phaser.Scene} scene
   * @param {object} tileData - Tile data containing entities
   */
  static updateEntitiesOnTile(scene, tileData) {
    // Remove entities that are no longer on this tile
    const currentEntitiesOnTile = Array.from(scene.entities.values())
      .filter(entityInfo => entityInfo.tileId === tileData.id);
    
    const newEntityIds = new Set(tileData.entities.map(entity => entity.id));
    
    currentEntitiesOnTile.forEach((entityInfo) => {
      if (!newEntityIds.has(entityInfo.data.id)) {
        // Entity is no longer on this tile, remove it
        if (entityInfo.sprite) {
          entityInfo.sprite.destroy();
        }
        scene.entities.delete(entityInfo.data.id);
      }
    });

    // Add or update entities on this tile
    tileData.entities.forEach((entityData) => {
      if (scene.entities.has(entityData.id)) {
        // Update existing entity
        const entityInfo = scene.entities.get(entityData.id);
        entityInfo.data = { ...entityInfo.data, ...entityData };
        entityInfo.tileId = tileData.id;
        
        // Update sprite position if entity exists
        if (entityInfo.sprite) {
          const x = tileData.x_coord * scene.tileSize + scene.tileSize / 2;
          const y = tileData.y_coord * scene.tileSize + scene.tileSize / 2;
          entityInfo.sprite.setPosition(x, y);
          entityInfo.sprite.setVisible(true);
          
          // Update player reference if this is the player
          if (entityData.name === "Player") {
            scene.player = entityInfo.sprite;
            scene.playerEntity = entityData;
            scene.playerTileId = tileData.id;
          }
        }
      } else {
        // Render new entity
        SceneService.renderEntity(scene, entityData, tileData);
      }
    });
  }
}

export default SceneService;
