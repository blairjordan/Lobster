
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
    
Run the docker container for PostgreSQL:

    docker network create pegleg
    docker run --name lobster --rm -e POSTGRES_PASSWORD=lobster -p 5432:5432 -itd --network=pegleg -d postgres:latest
    docker run -p 80:80 -itd --network=pegleg -e "PGADMIN_DEFAULT_EMAIL=user@domain.com" -e "PGADMIN_DEFAULT_PASSWORD=postgres" -d dpage/pgadmin4
    
You can fetch your Postgres IP using the following command:

    docker network inspect pegleg
    
## API
## players

An individual player. New players are not associated with a game by default.
___
### /players/all
**Method:** GET

Fetch all players.

___
### /players/find
**Method:** POST

Fetch a player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|id|string|The player ID|no|
|name|string|Player name|no|

___

### /players/add

**Method:** POST

Register a new player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|name|string|Player name|yes|

**Example**

URL:

    /players/add

JSON:

    { 
    	"name": "test_user"
    }

___

### /players/remove

**Method:** DELETE

Remove a new player.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|name|string|Player name|yes|

**Example**

URL:

    /players/remove

JSON:

    { 
    	"name": "test_user"
    }

___

### /players/update_player
**Method:** PUT

Update a player's details within a game, such as the player's position.

Any updates to the player trigger a change to the player's `lastUpdated` timestamp.

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

___

### /players/set_game
**Method:** PUT

Assign a player to a game.

#### Parameters
|param|type|description|mandatory|
|--|--|--|--|
|game_name|string|The name of the game to add the player to|yes|
|name|string|Player name|yes|

**Example:**

URL:

    /players/set_game
 
 JSON:
    
    { 
      "name": "player_name",
      "game_name": "test_game"
    }
