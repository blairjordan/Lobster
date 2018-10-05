import Item from '../models/item.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
  try {
    const items = await Item.getAll();
    logger.info('sending all items');
    res.json(items);
  }
  catch (err) {
    logger.error('Error in getting players- ' + err);
    res.status(500).json(err);
  }
};

controller.getTypes = async (req, res) => {
  try {
    const types = await Item.getTypes();
    logger.info('sending all item types');
    res.json(types);
  }
  catch (err) {
    logger.error('Error in getting item types- ' + err);
    res.status(500).json(err);
  }
};

controller.getPlayerItems = async (req, res) => {
  try {
    const {player_name} = req.body;
    const items = await Item.getPlayerItems({player_name});
    logger.info('sending player items');
    res.json(items);
  }
  catch (err) {
    logger.error('Error fetching player items - ' + err);
    res.status(500).json(err);
  }
};

controller.getRandomItem = async (req, res) => {
  try {
    const {type} = req.body;
    const item = await Item.getRandomItem({type});
    logger.info('sending item');
    res.json(item);
  }
  catch (err) {
    logger.error('Error fetching random item - ' + err);
    res.status(500).json(err);
  }
};

controller.addPlayerItem = async (req, res) => {
  try {
    const {player_name, item_id, item_count} = req.body;
    const player_item_id = await Item.addPlayerItem({player_name, item_id, item_count});
    logger.info('adding player item');
    res.json(player_item_id);
  }
  catch (err) {
    logger.error('Error adding item- ' + err);
    res.status(500).json(err);
  }
};

controller.deletePlayerItem = async (req, res) => {
  try {
    const {player_name, item_id} = req.body;
    const deletedCount = await Item.removePlayerItem({player_name, item_id});
    logger.info('deleting player item');
    res.json(deletedCount);
  }
  catch (err) {
    logger.error('Error deleting player item- ' + err);
    res.status(500).json(err);
  }
};

controller.addItem = async (req, res) => {
  try {
    const {type, name, description} = req.body;
    const item_id = await Item.addItem({type, name, description});
    logger.info('adding item');
    res.json(item_id);
  }
  catch (err) {
    logger.error('Error adding item- ' + err);
    res.status(500).json(err);
  }
};

controller.updateItem = async (req, res) => {
  try {
    const {item_id, name, description} = req.body;
    const updatedCount = await Item.updateItem({item_id, name, description});
    logger.info('updating item');
    res.json(updatedCount);
  }
  catch (err) {
    logger.error('Error updating item- ' + err);
    res.status(500).json(err);
  }
};

controller.deleteItem = async (req, res) => {
  try {
    const {item_id} = req.body;
    const deletedCount = await Item.removeItem({item_id});
    logger.info('deleting item');
    res.json(deletedCount);
  }
  catch (err) {
    logger.error('Error deleting item- ' + err);
    res.status(500).json(err);
  }
};

export default controller;