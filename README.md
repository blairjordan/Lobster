# Lobster

An API for lobby, inventory and in-game economy.

![](images/logo.png?raw=true)

## Getting started

Clone this repository

    git clone https://github.com/blairjordan/Lobster.git

From the Lobster directory, run:

    npm install
    
Start the application:      
    
    npm start

Run in prod:

	forever start dist/server.js
	
**Database**

The easiest way to create the database is to run MongoDB within a Docker container:

    docker run -p 27017:27017 --name lobsterdb -d mongo

## API
## games

A game represents a multiplayer game instance.

### /games

List all games.

	/game

### /games/create

**Method:** POST

Create a new game.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|name|string|Name of the game to create|yes|

**Example:**
	
    /game/create?name=GAMENAME

### /games/add_player

Add an existing player to a game.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|game_name|string|The name of the game to add the player to|yes|
|player_name|string|Player name|yes|

**Example:**

URL:

    /game/add_player
 
 JSON:
    
    { 
      "game_name": "test_game",
      "player_name": "player_name"
    }

### /games/update_player
**Method:** POST

Update a player's details within a game, such as the player's position.

Any updates to the player trigger a change to the player's `timestamp`.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|game_name|string|The name of the game where the player exists|yes|
|player_name|string|Player name|yes|
|x|string|Player's X coordinate|no|
|y|string|Player's Y coordinate|no|
|z|string|Player's Z coordinate|no|

**Example:**

URL

    /games/update_player

JSON:

    { 
      "game_name": "test_game",
      "player_name": "test_player",
      "x": 1,
      "y": 2,
      "z": 3
    }



## players

An individual player. New players are not associated with a game by default.

### /players/find

Fetch  a player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|id|string|The player ID|no|
|name|string|Player name|no|

### /player/create

Register a new player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|name|string|Player name|yes|

**Example**

    /player/create?name=PLAYERNAME

