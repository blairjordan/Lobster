import Tile from '../models/tiles.model';
import logger from '../core/logger/app-logger';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { stitch, split, size } from '../core/lib/pincer';
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

controller.split = async (req, res) => {
  const { tiles } = req.body;

  const [xMin, xMax, yMin, yMax] = 
  [
    Math.min.apply(null, tiles.map(t => t.x)),
    Math.max.apply(null, tiles.map(t => t.x)),
    Math.min.apply(null, tiles.map(t => t.y)),
    Math.max.apply(null, tiles.map(t => t.y))
  ];

  const images = await split({ conf: config.pincer, filepath: './temp/8nfb7u96dcg0/final.png', output: './output/', xMin, xMax, yMin, yMax });
  res.json(images);
};

controller.upload = async (req, res) => {
    var form = new formidable.IncomingForm();
    var fields = [];
    form.parse(req);
    form.on('fileBegin', function (name, file){
      file.path = './temp/' + file.name;
    });
    form.on('field', (name, field) => {
      console.log('Field', name, field);
      fields.push(field);
    });
    form.on('file', function (name, file){
      console.log(`Uploaded ${file.name} (${file.type}) to ${file.path} - ${Math.round((file.size/1024)*100)/100}MB`);
      size({filepath: file.path}).then((s) => {
        let field = JSON.parse(fields[0]).size;
        let [expectedW, expectedH]= 
        [
          field.width * config.pincer.tile.width,
          field.height * config.pincer.tile.height
        ];
        if (field.width !== expectedW) {
          //res.status(500).json(`Width error: ${s.width} !== ${expectedW}`);
        }
        if (field.height !== expectedH) {
          //res.status(500).json(`Height error: ${s.height} !== ${expectedH}`);
        }
      });
    });
    form.on('aborted', (err) => {
      console.error('Request aborted by user', err);
      throw err;
    });
    form.on('error', (err) => {
      console.error('Error', err);
      throw err;
    });
    form.on('end', () => {
      res.json({
        result: 'Upload Success'
      });
    });    
};

controller.seed = async (req, res) => {
  const { ext, tilePrefix, separator } = config.pincer.tile;
  let cleared = await Tile.clear();
  fs.readdirSync(config.pincer.tile.path).forEach(f => {
    if (path.extname(f) === ext) {
      let coords = f.replace(tilePrefix,'').replace(ext,'').split(separator);
      if (coords.length > 1) {
        let [x,y] = coords;
        Tile.addTile({x,y});
      }
    }
  });
  res.json(req.body);
};

controller.fill = async (req, res) => {
  const { ext, tilePrefix, separator, path, notile } = config.pincer.tile;
  let tiles = await Tile.getAll();
  let created = [];
  let d = `${path}/${tilePrefix}${notile}${ext}`;
  if (fs.existsSync(d)) {
    tiles.forEach(t => {
      let p = `${path}/${tilePrefix}${t.x}${separator}${t.y}${ext}`;
      if (!fs.existsSync(p)) {
        fs.copyFileSync(d, p);
        created.push(p);
      }
    });
  } else {
      res.status(500).json("Unable to locate default tile.");
  }
  res.json(created);
}

export default controller;