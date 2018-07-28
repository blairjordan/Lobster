import Tile from '../models/tiles.model';
import logger from '../core/logger/app-logger';
import fs from 'fs';
import path from 'path';
import { stitch } from '../core/lib/pincer';
import config from '../core/config/config.dev';

const controller = {};

controller.getAll = async (req, res) => {
  const { ext, tilePrefix, separator } = config.pincer.tile;

  Tile.getAll((err, tiles) => {
      if (err) {
          logger.error('Error getting all tiles - ' + err);
          res.status(500).json(err);
          return;
      }
      logger.info('Sending all tiles');

      let tiles2 = tiles.map((obj) => {
        let tile = obj.toObject(); // mongoose object to regular object
        tile.url = `${tilePrefix}${obj.x}${separator}${obj.y}${ext}`;

        tile.selected = false;
        return tile;
      })
      
      res.json(tiles2);
  });
};

Tile.make = options => {
  const { size, tiles } = req.body;
  Tile.make({size,tiles});
  stitch({ conf: config.pincer, size, tiles });
  res.json(req.body);
};

controller.seed = async (req, res) => {
  const { ext, tilePrefix, separator } = config.pincer.tile;
  fs.readdirSync(config.pincer.tile.path).forEach(f => {
    
    if (path.extname(f) === ext) {
      let coords = f.replace(tilePrefix,'').replace(ext,'').split(separator);
      if (coords.length > 1) {
        let [x,y] = coords;
        Tile.findOne({x, y}, (err, tile) => {
          if (err) { throw err; }
          if (tile === null) {
            let newTile = new Tile({x,y});
            newTile.save((err,tileAdded) => {
              if (err) { throw err; }
              console.log(tileAdded);
            });
          }
        });
      }
    }
  });
  res.json(req.body);
};

export default controller;