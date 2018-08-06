import {db} from '../db/connect';

let Item = {};

Item.getAll = async () => {
  return await db.any(`SELECT * FROM item`);
};

Item.addItem = async (options) => {
  const {type, name, description} = options;
  return db.one('INSERT INTO item(item_type_id, name, description) SELECT t.item_type_id, $2, $3 FROM item_type t WHERE t.name = $1 RETURNING item_id', [type, name, description])
    .then(id => {
        return id;
    })
    .catch(error => {
        throw error;
    });
};

Item.removeItem = async (options) => {
    const {item_id} = options;
    return await db.result('DELETE FROM item WHERE item_id = $1', item_id)
      .then(result => {
          return result.rowCount;
      })
      .catch(error => {
          throw error;
      });
  };

export default Item;
