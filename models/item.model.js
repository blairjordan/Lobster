import {db} from '../db/connect';

let Item = {};

Item.getAll = async () => {
  return db.any(`select * from item`);
};

export default Item;