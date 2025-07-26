import json
import os

LENGTH = 16
WIDTH = 16

def generate_gameboard_json():
    """
    Generate a complete gameboard JSON with:
    - 16x16 grid
    - Wall tiles on the perimeter
    - Grass tiles in the interior
    - Player entity on tile (7,7)
    """
    
    # Initialize the gameboard structure
    gameboard = {
        "id": 1,
        "num_levels": 1,
        "levels": [
            {
                "id": 1,
                "gameboard_id": 1,
                "z_index": 0,
                "length": LENGTH,
                "width": WIDTH,
                "tiles": []
            }
        ]
    }
    
    # Generate all tiles
    tile_id = 1
    tiles = []
    
    for y in range(WIDTH):
        for x in range(LENGTH):
            # Determine if this is a wall tile (on the edge)
            is_wall = (x == 0 or x == LENGTH-1 or y == 0 or y == WIDTH-1)
            
            # Create base tile
            tile = {
                "id": tile_id,
                "level_id": 1,
                "x_coord": x,
                "y_coord": y,
                "type": "wall" if is_wall else "floor",
                "is_wall": is_wall,
                "sprite": "tile_wall_single" if is_wall else "tile_grass_01",
                "speed": 0 if is_wall else 1,
                "entities": []
            }
            
            # Add player entity on tile (7,7)
            # if x == 7 and y == 7:
            #     player_entity = {
            #         "id": 101,
            #         "tile_id": tile_id,
            #         "type": "player",
            #         "label": "Player Character",
            #         "description": "The main character controlled by the player",
            #         "sprite": "player_human.png"
            #     }
            #     tile["entities"].append(player_entity)
            
            tiles.append(tile)
            tile_id += 1
    
    tile = {
        "id": -1,
        "level_id": 1,
        "x_coord": LENGTH + 100,
        "y_coord": WIDTH + 100,
        "type": "floor",
        "is_wall": False,
        "sprite": "tile_grass_01",
        "speed": 0,
        "entities": []
    }
    tiles.append(tile)
    
    
    # Add tiles to the level
    gameboard["levels"][0]["tiles"] = tiles
    
    return gameboard

def save_gameboard_to_file(filename=None):
    """Generate and save the gameboard to a JSON file"""
    if filename is None:
        # Always save to backend/assets/gameboard_16x16.json relative to this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        assets_path = os.path.join(script_dir, "../assets/gameboard_16x16.json")
        filename = os.path.normpath(assets_path)
    gameboard = generate_gameboard_json()
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(gameboard, f, indent=2, ensure_ascii=False)
    print(f"Gameboard JSON saved to {filename}")
    print(f"Total tiles: {len(gameboard['levels'][0]['tiles'])}")
    
    # Count wall vs floor tiles
    tiles = gameboard['levels'][0]['tiles']
    wall_count = sum(1 for tile in tiles if tile['is_wall'])
    floor_count = sum(1 for tile in tiles if not tile['is_wall'])
    player_tiles = sum(1 for tile in tiles if tile['entities'])
    
    print(f"Wall tiles: {wall_count}")
    print(f"Floor tiles: {floor_count}")
    print(f"Tiles with entities: {player_tiles}")

def print_board_visualization():
    """Print a visual representation of the board layout"""
    print("\nBoard Layout (W=Wall, G=Grass, P=Player):")
    print("  " + "".join(f"{i:2}" for i in range(WIDTH)))
    
    for y in range(WIDTH):
        row = f"{y:2}"
        for x in range(LENGTH):
            if x == 0 or x == LENGTH-1 or y == 0 or y == WIDTH-1:
                char = "W"
            # elif x == 7 and y == 7:
            #     char = "P"
            else:
                char = "G"
            row += f" {char}"
        print(row)

# Generate and save the gameboard
save_gameboard_to_file()

# Print visualization
print_board_visualization()

# Show sample of the JSON structure
gameboard = generate_gameboard_json()
print(f"\nSample tiles:")
print(f"Corner wall (0,0): {json.dumps(gameboard['levels'][0]['tiles'][0], indent=2)}")
print(f"Player tile (7,7): {json.dumps(gameboard['levels'][0]['tiles'][7*LENGTH + 7], indent=2)}")
print(f"Interior grass (5,5): {json.dumps(gameboard['levels'][0]['tiles'][5*WIDTH + 5], indent=2)}")