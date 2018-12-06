# Lobster

https://lobster.herokuapp.com

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
    
Run the docker container for PostgreSQL:

    docker network create pegleg
    docker run --name lobster --rm -e POSTGRES_PASSWORD=lobster -p 5432:5432 -itd --network=pegleg -d postgres:latest
    docker run -p 80:80 -itd --network=pegleg -e "PGADMIN_DEFAULT_EMAIL=user@domain.com" -e "PGADMIN_DEFAULT_PASSWORD=postgres" -d dpage/pgadmin4
    
You can fetch your Postgres IP using the following command:

    docker network inspect pegleg

# API

### /items

#### **/all**
**Request type:** GET
Get a list of all available items.

#### /find
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|player_name|string|yes|

Get a player's inventory.

#### /add
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|type|string|yes|
|name|string|yes|
|description|string|yes|

Add an item to the system.

#### /add_player_item
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|player_name|string|yes|
|item_id|int|yes|
|item_count|int|yes|

Add an item to player's inventory.

#### /delete_player_item
**Request type:** DELETE

|Name|Type|Mandatory|
|--|--|--|
|player_name|string|yes|
|item_id|int|yes|

Removes an item from player's inventory.

#### /update
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|item_id|int|yes|
|name|string|yes|
|description|string|yes|

Updates an item name and description.

### /remove
**Request type:** DELETE

|Name|Type|Mandatory|
|--|--|--|
|item_id|int|yes|

Deletes an item from the system.

## /trade

### /find
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|player_name|string|yes|

Get all offers for this player.

### /add_offer
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|source_player_name|string|yes|
|target_player_name|string|yes|

Opens a new offer between source and target players.

### /update POST
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|source_player_name|string|yes|
|target_player_name|string|yes|
|status |string|yes|

Set the status of an individual offer.

**Status types:**

|ID|Description |
|--|--|
|O| Open |
|A| Accepted |

 
### /add_item
**Request type:** POST

|Name|Type|Mandatory|
|--|--|--|
|source_player_name|string|yes|
|target_player_name|string|yes|
|item_id|int|yes|
|quantity |int|yes|

Add item to a an active offer.

### /offers
**Request type:** GET
Return a list of all offers in the system.

## /tiles

### /all
**Request type:** GET

### /seed
**Request type:** GET

Reads all tiles in the assets directory and inserts them into the tile table.

### /stitch
**Request type:** POST

Stitches selected tiles together into one image.

The final image is currently written to temp/[random ID]/final.png

### /split
**Request type:** POST

## /players

### /all
**Request type:** GET

### /add
**Request type:** POST

### /remove
**Request type:** POST

### /update_player
**Request type:** POST
