import Game from '../models/games.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
    const players = Game.getAll((err, players) => {
        if (err) {
            logger.error('Error getting all games - ' + err);
            res.status(500).json(err);
            return;
        }
        logger.info('Sending all games');
        res.json(players);
    });
};

controller.addGame = async (req, res) => {
    const { name } = req.body;
    let gameToAdd = new Game( { name } );
    Game.addGame(gameToAdd, (err, gameAdded) => {
        if (err) {
            logger.error('Error adding game - ' + err);
            res.status(500).json(err);
            return;
        }
        logger.info('New game added');
        res.json(gameAdded);
    });
};

controller.removeGame = async (req, res) => {
    const { name } = req.body;
    Game.removeGame({ name }, (err, gameRemoved) => {
        if (err || gameRemoved == null) {
            logger.error(`Error removing game ${name}: ${err}`);
            res.status(500).json(err || {message: 'Game not found', name: 'GameNotFound'});
            return;
        }
        logger.info('Game removed');
        res.json(gameRemoved);
    });
};

export default controller;