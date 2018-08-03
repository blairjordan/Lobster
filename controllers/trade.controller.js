import Trade from '../models/trade.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getOffers = async (req, res) => {
  Trade.getOffers()
  .then(function (data) {
    res.json(data);
  })
  .catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
    return;
  });
};

export default controller;