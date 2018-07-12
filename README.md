
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

**Database**

The easiest way to create the database is to run MongoDB within a Docker container:

    docker run -p 27017:27017 --name lobsterdb -d mongo

