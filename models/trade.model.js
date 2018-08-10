import {db} from '../db/connect';

let Trade = {};

Trade.getOffers = async () => {
  return await db.any(`SELECT * FROM v_offers`);
};

Trade.findOffer = async () => {
  return await db.any(`SELECT * FROM v_offers WHERE target = $1`);
};

Trade.addOffer = async (options) => {
  const {source_player_name, target_player_name} = options;
  return db.one(`INSERT INTO offer(source_id, target_id, target_status) SELECT p1.player_id, p2.player_id, 'O' FROM player p1, player p2 
  WHERE p1.username = $1 AND p2.username = $2 RETURNING offer_id`, [source_player_name, target_player_name])
  .then(id => {
    return id;
  })
  .catch(error => {
    throw error;
  });
};

export default Trade;
