import {db} from '../db/connect';

let Trade = {};

Trade.getOffers = async () => {
  // Join tables by WBS and account_id columns
  return db.any(`select * from v_offers`);
};

export default Trade;
