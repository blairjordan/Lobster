import Item from '../models/item.model';
import logger from '../core/logger/app-logger';

const controller = {};

controller.getAll = async (req, res) => {
  Item.getAll()
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