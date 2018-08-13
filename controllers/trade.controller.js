import Trade from '../models/trade.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getOffers = async (req, res) => {
  try {
    const offers = await Trade.getOffers();
    logger.info('sending all offers');
    res.json(offers);
  }
  catch (err) {
    logger.error('Error in getting offers - ' + err);
    res.status(500).json(err);
  }
};

controller.findOffers = async (req, res) => {
  try {
    const { target_player_name } = req.body;
    const offers = await Trade.findOffers({ target_player_name });
    logger.info('sending offers found');
    res.json(offers);
  }
  catch (err) {
    logger.error('Error finding offers- ' + err);
    res.status(500).json(err);
  }
};

export default controller;