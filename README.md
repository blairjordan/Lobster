
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

	forever start bin/www
	
**Database**

The easiest way to create the database is to run MongoDB within a Docker container:

    docker run -p 27017:27017 --name lobsterdb -d mongo

## API
## game

A game represents a multiplayer game instance.

### /game

List all games.

	/game

### /game/create

Create a new game.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|name|string|Name of the game to create|yes|

**Example:**
	
    /game/create?name=GAMENAME

### /game/add_player

Add an existing player to a game.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|game_id|string|The ID of the game to add the player to|yes|
|player_id|string|Player ID|yes|

**Example:**

    /game/add_player?game_id=GAMEID&player_id=PLAYERID

### /game/update_player
Update a player's details within a game, such as the player's position.

Any updates to the player trigger a change to the player's `timestamp`.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|game_id|string|The ID of the game where the player exists|yes|
|player_id|string|Player ID|yes|
|x|string|Player's X coordinate|no|
|y|string|Player's Y coordinate|no|
|z|string|Player's Z coordinate|no|

**Example:**

    /game/update_player?game_id=GAMEID&player_id=PLAYERID&x=X&y=Y&z=Z

## player

An individual player. New players are not associated with a game by default.

### /player

Fetch  a player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|id|string|The player ID|no|
|name|string|Player name|no|

**Examples**

    /player?name=PLAYERNAME
    /player?id=PLAYERID

### /player/create

Register a new player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|name|string|Player name|yes|

**Example**

    /player/create?name=PLAYERNAME
