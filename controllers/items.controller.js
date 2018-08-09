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