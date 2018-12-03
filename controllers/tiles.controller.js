import Tile from '../models/tiles.model';
import logger from '../core/logger/app-logger';
import fs from 'fs';
import path from 'path';
import { stitch, split } from '../core/lib/pincer';
import config from '../core/config/config.dev';

const controller = {};

controller.getAll = async (req, res) => {
  const { ext, tilePrefix, separator } = config.pincer.tile;
  try {
    const tiles = await Tile.getAll();
    let tiles2 = tiles.map((tile) => {
      tile.url = `${tilePrefix}${tile.x}${separator}${tile.y}${ext}`;

      tile.selected = false;
      return tile;
    });

    logger.info('sending all tiles');
    res.json(tiles2);
  }
  catch (err) {
    logger.error('Error in getting tiles- ' + err);
    res.status(500).json(err);
  }
};

controller.stitch = (req, res) => {
  const { size, tiles } = req.body;
  stitch({ conf: config.pincer, size, tiles });
  res.json(req.body);
};

controller.split = (req, res) => {
  console.log('hit2');
  // const { filename } = req.body;
  split({ conf: config.pincer, filename: 'temp/ga8j3lf8wl40/final.png', segmentCount: 2 });
  res.json(req.body);
};

// TODO: Convert to Postgres. Easy, but I'm lazy.
// This reads everything in the assets dir and inserts it into the DB.
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