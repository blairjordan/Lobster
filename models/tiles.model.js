import {db} from '../db/connect';

let Tile = {};

Tile.getAll = async () => {
  return db.any(`SELECT * FROM tile`)
  .then(tiles => {
    return tiles;
  })
  .catch(error => {
    throw error;
  });
};

Tile.addTile = async (options) => {
  const {x,y} = options;
  return db.one('INSERT INTO tile(x, y) VALUES ($1,$2) RETURNING tile_id', [x, y])
  .then(id => {
    return id;
  })
  .catch(error => {
    throw error;
  });
};

Tile.updateTile = async (options) => {
  const {tile_id,x,y} = options;
  return db.result('UPDATE tile SET x = $2, y = $3 WHERE tile_id = $1', [tile_id, x, y])
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

Tile.removeTile = async (options) => {
  const {tile_id} = options;
  return db.result('DELETE FROM tile WHERE tile_id = $1', tile_id)
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

Tile.clear = async () => {
  return db.result(`DELETE FROM tile`)
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

export default Tile;
