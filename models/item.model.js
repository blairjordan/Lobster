import {db} from '../db/connect';

let Item = {};

Item.getAll = async () => {
  return await db.any(`SELECT * FROM item`);
};

Item.addItem = async (options) => {
  const {type, name, description} = options;
  return db.one('INSERT INTO item(item_type_id, name, description) VALUES($1, $2, $3) RETURNING item_id', [type, name, description])
    .then(id => {
        return id;
    })
    .catch(error => {
        throw error;
    });
};

export default Item;