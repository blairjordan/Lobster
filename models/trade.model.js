import {db} from '../db/connect';

let Trade = {};

Trade.getOffers = async () => {
  return db.any(`select * from v_offers`);
};

export default Trade;
