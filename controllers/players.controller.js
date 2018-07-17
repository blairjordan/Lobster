import Game from '../models/games.model';
import Player from '../models/players.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
    const players = Player.getAll((err, players) => {
        if (err) {
            logger.error('Error getting all players - ' + err);
            res.status(500).json(err);
            return;
        }

        logger.info('Sending all players');
        res.json(players);
    });
};

controller.findPlayers = async (req, res) => {
    const { game_name } = req.body;
    Game.findOne({name: game_name}, (err, gameFound) => {
        Player.find({ "game" : gameFound._id }, (err, playersFound) => {
            if (err) {
                logger.error('Error finding player(s) - ' + err);
                res.status(500).json(err);
                return;
            }
            logger.info('Searched for players.');
            res.json(playersFound);
        });
    });
};

controller.addPlayer = async (req, res) => {
    const { name } = req.body;
    let playerToAdd = new Player( { name } );
    Player.addPlayer(playerToAdd, (err, playerAdded) => {
        if (err) {
            logger.error('Error adding player - ' + err);
            res.status(500).json(err);
            return;
        }
        logger.info('New player added');
        res.json(playerAdded);
    });
};

controller.removePlayer = async (req, res) => {
    const { name } = req.body;
    Player.removePlayer(name, (err, playerRemoved) => {
        if (err || playerRemoved == null) {
            logger.error(`Error removing player ${name}: ${err}`);
            res.status(500).json(err || {message: 'Player name not found', name: 'PlayerNotFound'});
            return;
        }
        logger.info('Player removed');
        res.json(playerRemoved);
    });
};

controller.updatePlayer = async (req, res) => {
    const { name, x, y, z } = req.body;
    Player.updatePlayer({ name, x, y, z },
    (err, playerUpdated) => {
        if (err || playerUpdated == null) {
            logger.error(`Error updating player ${name}: ${err}`);
            res.status(500).json(err || {message: 'Player name not found', name: 'PlayerNotFound'});
            return;
        }
        logger.info('Player updated');
        res.json(playerUpdated);
    });
};

controller.setGame = async (req, res) => {
    const { name, game_name } = req.body;
    Game.findOne({ name: game_name }, (err,game) => {
        if (err) throw err;
        Player.setGame(name, game._id, 
            (err, playerUpdated) => {
                if (err || playerUpdated  == null) {
                    logger.error(`Error updating player ${name}: ${err}`);
                    res.status(500).json(err || {message: 'Player name not found', name: 'PlayerNotFound'});
                    return;
                }
                logger.info('Player updated');
                res.json(playerUpdated);
            });
    });
};

export default controller;