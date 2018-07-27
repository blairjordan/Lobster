import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { stitch } from '../core/lib/pincer';
import config from '../core/config/config.dev';

const TileSchema = mongoose.Schema({
    name: {type: String},
    x: { type: Number }, 
    y: { type: Number }
}, {
    timestamps: true,
    collection : 'tile'
});

let Tile = mongoose.model('tile', TileSchema);

Tile.getAll = cb => {
  Tile.find({}, cb);
};

Tile.addTile = (tileToAdd, cb) => {
  tileToAdd.save(cb);
};

Tile.updateTile = (tile, cb) => {
  const { name, x, y } = tile;
  Tile.findOneAndUpdate({ name }, 
  { $set: { x, y } },
  cb);
};

Tile.removeTile = (tileToRemove, cb) => {
  Tile.findOneAndRemove(tileToRemove, cb);
};

Tile.make = options => {
  const {size, tiles} = options;
  stitch({ conf: config.pincer, size, tiles });
};


//router.get('/all', (req, res) => {
  //tileController.getAll(req, res);
  // This will return the array below.
  // Go to db: if tile is there, add it to the array
  // Check in the filesystem, if it exists, updata the array
  // If it doesn't exist, use the default from the config. Controller will do this.
//});

// Seeds the local database with tiles located in the filesystem
Tile.seed = () => {
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
              console.log(tileAdded,' added');
            });
          }
        });

      }
      
    }

  });
};

export default Tile;
