import Player from '../models/players.model';
import Game from '../models/games.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
    Game.getAll().then(games => {
        logger.info('sending all games...');
        res.status(200).json(games);
    }).catch(err => {
        res.status(500).json(err);
    });
};

controller.addGame = async (req, res) => {
    let gameToAdd = Game({
        name: req.body.name
    });
    Game.addGame(gameToAdd).then(savedGame => {
        logger.info('Adding game');
        res.status(200).json(savedGame);
    }).catch(err => {
        res.status(500).json(err);
    });
};

controller.deleteGame = async (req, res) => {
    let gameName = req.body.name;
    Game.removeGame(gameName).then(removedGame => {
        logger.info('Deleted game ' + removedGame);
        res.status(200).json(removedGame);
    }).
    catch(err => {
        res.status(500).json(err);
    });
};

controller.addPlayer = async (req, res) => {
    const { game_name, player_name } = req.body;
    Game.addPlayer(game_name,player_name).then(addedPlayer => {
        logger.info('Added player ' + addedPlayer);
        res.status(200).json(addedPlayer);
    }).catch(err => {
        res.status(500).json(err);
    });
};

/*
controller.deletePlayer = async (req, res) => {
    const { game_name, player_name } = req.body;
    Game.deletePlayer(game_name,player_name,x,y,z).then((err, updatedGame) => {
        res.status(500).json(err);
        res.status(200).json(updatedGame);
    }).catch(err => {
        res.status(500).json(err);
    });
};*/

controller.updatePlayer = async (req, res) => {
    const { game_name, player_name, x, y, z } = req.body;
    Game.getPlayerDetails(player_name, function(err, player) {
        if (!player) err = "Player not found";
        if (!game_name || !player_name || !x || !y || !z) err = "Validation error";
        if (err) {
            res.status(500).json(err);
            return;
        } 

        player = { x,y,z, _id: player._id};
        Game.updateGame(game_name, player, function (err, updatedData) {
            if (err) {
                    res.status(500).json(err);
            } else {
                res.status(200).json(updatedData);
            }
        });
    });
};

export default controller;