import Player from '../models/players.model';
import Game from '../models/games.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const games = await Game.getAll();
        logger.info('sending all games...');
        res.send(games);
    }
    catch(err) {
        logger.error('Error in getting games- ' + err);
        res.send('Got error in getAll');
    }
};

controller.addGame = async (req, res) => {
    let gameToAdd = Game({
        name: req.body.name
    });
    try {
        const savedGame = await Game.addGame(gameToAdd);
        logger.info('Adding game...');
        res.send('added: ' + savedGame);
    }
    catch(err) {
        logger.error('Error in getting games- ' + err);
        res.send('Got error in getAll');
    }
};

controller.deleteGame = async (req, res) => {
    let gameName = req.body.name;
    try{
        const removedGame = await Game.removeGame(gameName);
        logger.info('Deleted Game- ' + removedGame);
        res.send('Game successfully deleted');
    }
    catch(err) {
        logger.error('Failed to delete game- ' + err);
        res.send('Delete failed..!');
    }
};

controller.addPlayer = async (req, res) => {
    const { game_name, player_name } = req.body;

    try{
        const addedPlayer = await Game.addPlayer(game_name,player_name);
        logger.info('Added player - ' + addedPlayer);
        res.send('Player successfully added');
    }
    catch(err) {
        logger.error('Failed to add player - ' + err);
        res.send('Add failed..!');
    }
};

controller.updatePlayer = async (req, res) => {
    const { game_name, player_name, x, y, z } = req.body;

    try{
        const removedGame = await Game.updatePlayer(game_name,player_name,x,y,z);
        logger.info('Update player - ' + removedGame);
        res.send('Player successfully updated');
    }
    catch(err) {
        logger.error('Failed to update player - ' + err);
        res.send('Update failed..!');
    }
};

export default controller;