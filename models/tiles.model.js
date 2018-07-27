import mongoose from 'mongoose';

const TileSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true},
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

// Seeds the local database with tiles located in the filesystem
Tile.seed = conf => {
};

export default Tile;