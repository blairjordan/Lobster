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

  const images = await split({ conf: config.pincer, filepath: './temp/final.png', size: {xMin, xMax, yMin, yMax }});
  res.json(images);
};

controller.upload = async (req, res) => {
    let form = new formidable.IncomingForm();
    let fields = [];
    form.parse(req);
    form.on('fileBegin', function (name, file){
      file.path = `${config.pincer.temp}/${path.basename(file.path)}${path.extname(file.name)}`;
    });
    form.on('field', (name, field) => {
      console.log('Field', name, field);
      fields.push(field);
    });
    form.on('file', (name, file) => {
      console.log(`Uploaded ${file.name} (${file.type}) to ${file.path} - ${Math.round((file.size/1024)*100)/100}MB`);
      size({filepath: file.path}).then(async s => {
        let size = JSON.parse(fields[0]).size;
        let tiles = JSON.parse(fields[0]).tiles;
        let [expectedW, expectedH] =
        [
          size.width * config.pincer.tile.width,
          size.height * config.pincer.tile.height
        ];
        let errors = [];
        if (s.width !== expectedW) {
          errors.push(`Image width: ${s.width} != expected ${expectedW} (${size.width} selected * ${config.pincer.tile.width} tile config)`);
        }
        if (s.height !== expectedH) {
          errors.push(`Image height: ${s.height} != expected ${expectedH} (${size.height} selected * ${config.pincer.tile.height} tile config)`);
        }
        if (errors.length) {
          res.status(400).json({errors});
        } else {
          const images = await split({ conf: config.pincer, filepath: file.path, size });
          images.forEach(f => {
            // TODO: Filter out blank selection!
            fs.copyFile(f.path, `${config.pincer.tile.path}/${f.filename}`, (err) => {
              if (err) throw err;
              console.log(`${f.path} was copied to ${f.filename}`);
            });
          })
          res.json(images);
        }
      });
    });
    form.on('aborted', () => {
      console.error('Request aborted by user');
    });
    form.on('error', (err) => {
      console.error('Error', err);
      throw err;
    });
    form.on('end', () => {} );    
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