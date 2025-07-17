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
    // Delete all tiles and entities from the scene's memory.
    scene.tiles.forEach((tile) => tile.sprite?.destroy());
    scene.entities.forEach((entity) => entity.sprite?.destroy());

    // Clear all collections and references.
    scene.tiles.clear();
    scene.entities.clear();
    scene.tileGrid.clear();
    if (scene.tileLayer) scene.tileLayer.clear(true, true);
    if (scene.entityLayer) scene.entityLayer.clear(true, true);
    scene.player = null;
    scene.playerEntity = null;
    scene.playerTileId = null;
  }

  /**
   * Render all tiles and entities for the current gameboard.
   * @param {Phaser.Scene} scene
   */
  static renderGameboard(scene) {
    if (!scene.gameboardData || !scene.gameboardData.levels) {
      console.warn("No gameboard data to render");
      return;
    }

    // TODO: Add logic to set level based on player's current position.
    // For now, we are setting the first level as the active level.
    const level = scene.gameboardData.levels[0];
    if (!level || !level.tiles) {
      console.warn("No level or tiles data found");
      return;
    }

    level.tiles.forEach((tile) => SceneService.renderTile(scene, tile));

    // TODO:  Need to add logic to only render entities the player can see.
    //        For now, we render all entities in the first level.
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
    const x = tileData.x_coord * scene.tileSize;
    const y = tileData.y_coord * scene.tileSize;
    let spriteKey = tileData.sprite;
    if (spriteKey && spriteKey.endsWith(".png")) spriteKey = spriteKey.replace(".png", "");

    // Validate sprite exists before using
    if (!scene.textures.exists(spriteKey)) {
      console.warn(`Sprite key '${spriteKey}' not found, using placeholder...`);
      spriteKey = "tile_grass_01"; // TODO: Add an error sprite or fallback tile.
    }

    const tileSprite = scene.add.image(x, y, spriteKey);
    tileSprite.setOrigin(0, 0);
    tileSprite.setDisplaySize(scene.tileSize, scene.tileSize);
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
    const x = tileData.x_coord * scene.tileSize + scene.tileSize / 2;
    const y = tileData.y_coord * scene.tileSize + scene.tileSize / 2;
    const entitySprite = scene.add.image(x, y, entityData.sprite);
    entitySprite.setOrigin(0.5, 0.5);
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
}

export default SceneService;
