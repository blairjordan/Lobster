import {db} from '../db/connect';

let Player = {};

Player.getAll = async () => {
  return db.any(`SELECT * FROM player`);
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