import {db} from '../db/connect';

let Player = {};

Player.getAll = async () => {
  return db.any(`SELECT * FROM player`);
};

Player.addPlayer = async (options) => {
  const {username,email} = options;
  return db.one('INSERT INTO player(username, email) VALUES ($1,$2) RETURNING player_id', [username, email])
  .then(id => {
    return id;
  })
  .catch(error => {
    throw error;
  });
};

Player.removePlayer = async (options) => {
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
  const {player_id,username,email} = options;
  return db.result('UPDATE player SET username = $1, email = $2 WHERE player_id = $3', [username, email, player_id])
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

export default Player;