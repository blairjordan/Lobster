import Player from '../models/player.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const players = await Player.getAll();
    logger.info('sending all players');
    res.json(players);
  } catch (err) {
    logger.error('Error in getting players- ' + err);
    res.json(err);
  }
};

controller.getPlayersByPosition = async (req, res) => {
  try {
    const { x_min, x_max, y_min, y_max, z_min, z_max } = req.body;
    const players = await Player.getPlayersByPosition({ x_min, x_max, y_min, y_max, z_min, z_max });
    logger.info('sending players found');
    res.json(players);
  } catch (err) {
    logger.error('Error finding players- ' + err);
    res.status(500).json(err);
  }
};

controller.addPlayer = async (req, res) => {
  try {
    const {player_name, email} = req.body;
    const player_id = await Player.addPlayer({player_name, email});
    logger.info('adding player');
    res.json(player_id);
  } catch (err) {
    logger.error('Error adding player- ' + err);
    res.status(500).json(err);
  }
};

controller.deletePlayer = async (req, res) => {
  try {
    const { player_id } = req.body;
    const deletedCount = await Player.deletePlayer({ player_id });
    logger.info('Sending remove player count');
    res.json(deletedCount);

  } catch (err) {
    logger.error('Error removing player- ' + err);
    res.status(500).json(err);
  }
};

controller.updatePlayer = async (req, res) => {
  try {
    const {player_name, x, y, z, rotation_y} = req.body;
    const updatedCount = await Player.updatePlayer({player_name, x, y, z, rotation_y});
    logger.info('updating player');
    res.json(updatedCount);
  } catch (err) {
    logger.error('Error updating player- ' + err);
    res.status(500).json(err);
  }
};

export default controller;