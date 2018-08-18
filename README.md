
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
