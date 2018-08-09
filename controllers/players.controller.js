import Player from '../models/player.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const players = await Player.getAll();
    logger.info('sending all players');
    res.json(players);
  }
  catch (err) {
    logger.error('Error in getting players- ' + err);
    res.json(err);
  }
};

export default controller;