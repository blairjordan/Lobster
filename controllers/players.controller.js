import Player from '../models/players.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const players = await Player.getAll();
        logger.info('Sending all games');
        res.send(players);
    }
    catch(err) {
        logger.error('Error getting all players - ' + err);
        res.status(500).json(err);
    }
};

controller.addPlayer = async (req, res) => {
    const { name } = req.body;
    let playerToAdd = Player({ name });
    try {
        const savedPlayer = await Player.addPlayer(playerToAdd);
        logger.info('Adding player');
        res.json(savedPlayer);
    }
    catch(err) {
        logger.error('Error in getting players - ' + err);
        res.status(500).json(err);
    }
};

controller.deletePlayer = async (req, res) => {
    const { name } = req.body;
    try{
        const removedPlayer = await Player.removePlayer(name);
        logger.info('Deleted player- ' + removedPlayer);
        res.send('Player successfully deleted');
    }
    catch(err) {
        logger.error('Failed to delete player - ' + err);
        res.status(500).json(err);
    }
};

/*
controller.updatePlayer = async (req, res) => {
    const { name } = req.body;

    try{
        const updatedPlayer = await Game.updatePlayer(name);
        logger.info('Update player - ' + updatedPlayer);
        res.send('Player successfully updated');
    }
    catch(err) {
        logger.error('Failed to update player - ' + err);
        res.send('Update failed..!');
    }
};
*/

export default controller;