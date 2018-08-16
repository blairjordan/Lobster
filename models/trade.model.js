import {db} from '../db/connect';

let Trade = {};

Trade.getOffers = async () => {
  return db.any(`SELECT * FROM v_offers`);
};

Trade.findOffers = async (options) => {
  const { player_name } = options;
  return db.any(`SELECT * FROM v_offers WHERE target = $1 OR source = $1`, [player_name]);
};

Trade.setOfferStatus = async (options) => {
  const { source_player_name, target_player_name, status } = options;

  return db.result(`UPDATE offer o SET target_status = $3 FROM player p1, player p2 
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

  // TODO: Set the offer to OPEN for both parties, i.e., reset the state of the trade since the trade has changed

  // TODO: Precheck user has item

  // TODO: If item exists in the trade, replace it 

  const { source_player_name, target_player_name, item_id, quantity } = options;
  return db.one(`INSERT INTO offer_item(offer_id, item_id, item_count)
  SELECT o.offer_id, $3, $4 FROM offer o, player p1, player p2
  WHERE o.source_id = p1.player_id AND o.target_id = p2.player_id AND p1.username = $1 AND p2.username = $2`, [source_player_name, target_player_name, item_id, quantity])
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

export default Trade;
