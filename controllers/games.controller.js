import Player from '../models/players.model';
import Game from '../models/games.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const games = await Game.getAll();
        logger.info('sending all games...');
        res.status(200).json(games);
    }
    catch(err) {
        res.status(500).json(err);
    }
};

controller.addGame = async (req, res) => {
    let gameToAdd = Game({
        name: req.body.name
    });
    try {
        const savedGame = await Game.addGame(gameToAdd);
        logger.info('Adding game');
        res.status(200).json(savedGame);
    }
    catch(err) {
        res.status(500).json(err);
    }
};

controller.deleteGame = async (req, res) => {
    let gameName = req.body.name;
    try{
        const removedGame = await Game.removeGame(gameName);
        logger.info('Deleted game ' + removedGame);
        res.status(200).json(removedGame);
    }
    catch(err) {
        res.status(500).json(err);
    }
};

controller.addPlayer = async (req, res) => {
    const { game_name, player_name } = req.body;

    try{
        const addedPlayer = await Game.addPlayer(game_name,player_name);
        logger.info('Added player ' + addedPlayer);
        res.status(200).json(addedPlayer);
    }
    catch(err) {
        res.status(500).json(err);
    }
};

controller.updatePlayer = async (req, res) => {
    const { game_name, player_name, x, y, z } = req.body;

    try{
        const updatedGame = await Game.updatePlayer(game_name,player_name,x,y,z);
        res.status(200).json(updatedGame);
    }
    catch(err) {
        res.status(500).json(err);
    }
};

export default controller;