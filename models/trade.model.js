import {db} from '../db/connect';

let Trade = {};

Trade.getOffers = async () => {
  return db.any(`SELECT * FROM v_offers`);
};

Trade.getOffersByPlayer = async (options) => {
  const { player_name } = options;
  return db.any(`SELECT * FROM v_offers WHERE target = $1 OR source = $1`, [player_name]);
};

Trade.setOfferStatus = async (options) => {
  const { source_player_name, target_player_name, status } = options;
  console.log(status);
    return db.one(`SELECT set_offer($1,$2,$3)`, [source_player_name, target_player_name, status])
    .then(status => {
      return status.set_offer;
    })
    .catch(error => {
      throw error;
    });
};

Trade.addItem = async (options) => {

  const { source_player_name, target_player_name, item_id, quantity } = options;
  console.log(options);
  return db.one(`SELECT add_offer_item($1,$2,$3,$4)`, [source_player_name, target_player_name, item_id, quantity])
  .then(status => {
    return status.add_offer_item;
  })
  .catch(error => {
    throw error;
  });
};

Trade.addOffer = async (options) => {
  const { source_player_name, target_player_name } = options;
  return db.one(`INSERT INTO offer(source_id, target_id, target_status) SELECT p1.player_id, p2.player_id, 'O' FROM player p1, player p2 
  WHERE p1.username = $1 AND p2.username = $2 RETURNING offer_id`, [source_player_name, target_player_name])
  .then(id => {
    return id;
  })
  .catch(error => {
    throw error;
  });
};

Trade.removeOffer = async (options) => {
  const { player_name } = options;
  return db.result(`DELETE FROM offer_item WHERE offer_id IN (SELECT offer_id FROM offer o, player p WHERE p.username = $1 AND (source_id = p.player_id OR target_id = p.player_id))`, [player_name])
  .then(result => {
    if (result.rowCount === 0)
      return result;

    return db.result(`DELETE FROM offer WHERE offer_id IN (SELECT offer_id FROM offer o, player p WHERE p.username = $1 AND (source_id = p.player_id OR target_id = p.player_id))`, [player_name])
  })
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

export default Trade;
