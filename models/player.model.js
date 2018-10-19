import {db} from '../db/connect';

let Player = {};

Player.getAll = async () => {
  return db.any(`SELECT * FROM player`);
};

Player.getPlayersByPosition = async (options) => {
  const { x_min, x_max, y_min, y_max, z_min, z_max } = options;
  return db.any(`SELECT * FROM player WHERE x > $1 AND x < $2 AND y > $3 AND y < $4 AND z > $5 AND z < $6`, [x_min, x_max, y_min, y_max, z_min, z_max]);
};

Player.addPlayer = async (options) => {
  const {player_name,email} = options;
  return db.one('INSERT INTO player(username, email) VALUES ($1,$2) RETURNING player_id', [player_name, email])
  .then(id => {
    return id;
  })
  .catch(error => {
    throw error;
  });
};

Player.deletePlayer = async (options) => {
  const {player_id} = options;
  return db.result('DELETE FROM player WHERE player_id = $1', player_id)
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

Player.updatePlayer = async (options) => {
  const {player_name,x,y,z,rotation_y} = options;
  return db.result('UPDATE player SET x = $2, y = $3, z = $4, rotation_y = $5 WHERE username = $1', [player_name, x, y, z, rotation_y])
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

export default Player;