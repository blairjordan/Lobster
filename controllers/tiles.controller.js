import Tile from '../models/tiles.model';
import logger from '../core/logger/app-logger';
import config from '../core/config/config.dev';
import { stitch } from '../core/lib/pincer';

const controller = {};

controller.getAll = async (req, res) => {
};

controller.make = async (req, res) => {
  const { size, tiles } = req.body;
  stitch({ conf: config.pincer, size, tiles });
  res.json(req.body);
};

export default controller;