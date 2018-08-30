import {db} from '../db/connect';

let Trade = {};

Trade.getOffers = async () => {
  return db.any(`SELECT * FROM v_offer`);
};

Trade.getOffersByPlayer = async (options) => {
  const { player_name } = options;
  return db.any(`SELECT * FROM v_offer WHERE target = $1 OR source = $1`, [player_name]);
};

Trade.setOfferStatus = async (options) => {
  const { source_player_name, target_player_name, status } = options;
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
  return db.one(`SELECT add_offer($1,$2,$3)`, [source_player_name, target_player_name, 'O'])
  .then(status => {
    return status.add_offer;
  })
  .catch(error => {
    throw error;
  });
};

Trade.removeOffer = async (options) => {
  const { source_player_name, target_player_name } = options;
  return db.one(`SELECT remove_offer($1,$2)`, [source_player_name, target_player_name])
  .then(result => {
    return result;
  })
  .catch(error => {
    throw error;
  });
};

export default Trade;
