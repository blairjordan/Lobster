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
    const { player_name } = req.body;
    const offers = await Trade.getOffersByPlayer({ player_name });

    let retoffers = offers.reduce((previous, curr) => {
      if (curr.source === player_name) { previous.source.push(curr); }
      if (curr.target === player_name) { previous.target.push(curr); }
      return previous;
    }, {source: [], target: []});

    logger.info('sending offers found');
    res.json(retoffers);
  }
  catch (err) {
    logger.error('Error finding offers- ' + err);
    res.status(500).json(err);
  }
};

controller.addOffer = async (req, res) => {
  try {
    const { source_player_name, target_player_name } = req.body;
    const addOfferStatus = await Trade.addOffer({ source_player_name, target_player_name, status: 'O' });
    logger.info('Sending add offer status');
    res.json(addOfferStatus);

  } catch (err) {
    logger.error('Error adding offer- ' + err);
    res.status(500).json(err);
  }
};

controller.removeOffer = async (req, res) => {
  try {
    const { source_player_name, target_player_name } = req.body;
    const removeOfferStatus = await Trade.removeOffer({ source_player_name, target_player_name });
    logger.info('Sending remove offer status');
    res.json(removeOfferStatus);

  } catch (err) {
    logger.error('Error removing offer- ' + err);
    res.status(500).json(err);
  }
};

controller.setOfferStatus = async (req, res) => {
  try {
    const { source_player_name, target_player_name, status } = req.body;
    const updateOfferStatus = await Trade.setOfferStatus({ source_player_name, target_player_name, status });
    logger.info('Sending set offer status');
    res.json(updateOfferStatus);

  } catch (err) {
    logger.error('Error setting offer status - ' + err);
    res.status(500).json(err);
  }
};

controller.addItem = async (req, res) => {
  try {
    const { source_player_name, target_player_name, item_id, quantity } = req.body;
    const offer_item_id = await Trade.addItem({ source_player_name, target_player_name, item_id, quantity });
    logger.info('adding offer item');
    res.json(offer_item_id);

  } catch (err) {
    logger.error('Error adding offer item- ' + err);
    res.status(500).json(err);
  }
};

export default controller;