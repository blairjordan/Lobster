import Trade from '../models/trade.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getOffers = async (req, res) => {
  res.json(Trade.getOffers());
};


export default controller;