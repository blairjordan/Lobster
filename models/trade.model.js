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

  return db.result(`UPDATE offer o 
    SET target_status = $3 
    FROM player p1, player p2 
    WHERE o.source_id = p1.player_id AND o.target_id = p2.player_id
    AND p1.username = $1
    AND p2.username = $2`, [source_player_name, target_player_name, status])
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

Trade.addItem = async (options) => {

  const { source_player_name, target_player_name, item_id, quantity } = options;
  return db.one(`INSERT INTO offer_item(offer_id, item_id, item_count)
  SELECT o.offer_id, $3, $4 FROM offer o, player p1, player p2
  WHERE o.source_id = p1.player_id AND o.target_id = p2.player_id AND p1.username = $1 AND p2.username = $2
  RETURNING offer_item_id`, [source_player_name, target_player_name, item_id, quantity])
  .then(id => {
    return id;
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
