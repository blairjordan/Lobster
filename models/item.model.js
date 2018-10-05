import {db} from '../db/connect';

let Item = {};

Item.getAll = async () => {
  return db.any(`SELECT i.item_id, i.name, i.description, i.created, i.modified, t.item_type_id, t.name AS item_type_name, t.description AS item_type_description FROM item i, item_type t WHERE i.item_type_id = t.item_type_id`)
  .then(items => {
    return items;
  })
  .catch(error => {
    throw error;
  });
};

Item.getTypes = async () => {
  return db.any(`SELECT * FROM item_type`)
  .then(items => {
    return items;
  })
  .catch(error => {
    throw error;
  });
};

Item.addItem = async (options) => {
  const { type, name, description } = options;
  return db.one('INSERT INTO item(item_type_id, name, description) SELECT t.item_type_id, $2, $3 FROM item_type t WHERE t.name = $1 RETURNING item_id', [type, name, description])
  .then(id => {
    return id;
  })
  .catch(error => {
    throw error;
  });
};

Item.updateItem = async (options) => {
  const {item_id,name,description} = options;
  return db.result('UPDATE item SET name = $1, description = $2 WHERE item_id = $3', [name, description, item_id])
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

Item.getPlayerItems = async (options) => {
    const { player_name } = options;
    return db.any(`
    SELECT pi.player_item_id, p.player_id, i.item_id, i.name, i.description, pi.item_count, pi.created, pi.modified
    FROM player_item pi, item i, player p
    WHERE pi.item_id = i.item_id
    AND pi.player_id = p.player_id
    AND p.username = $1`, [player_name])
    .then(items => {
      return items;
    })
    .catch(error => {
      throw error;
    });
};

Item.getRandomItem = async (options) => {
    const { type } = options;
    return db.one(`SELECT i.item_id, it.item_type_id, it.name item_type, i.name item_name, i.created, i.modified
    FROM item i, item_type it
    WHERE i.item_type_id = it.item_type_id
      AND it.name = $1
    ORDER BY random()
    LIMIT 1`, [type])
    .then(item => {
      return item;
    })
    .catch(error => {
      throw error;
    });
};

Item.addPlayerItem = async (options) => {
  const {player_name, item_id, item_count} = options;
  return db.one('SELECT add_player_item($1, $2, $3)', [player_name, item_id, item_count])
  .then(status => {
    return status.add_player_item;
  })
  .catch(error => {
    throw error;
  });
};

Item.removePlayerItem = async (options) => {
  const {player_name, item_id} = options;
  return db.result(`DELETE FROM player_item WHERE player_item_id IN 
  (SELECT pi.player_item_id FROM player_item pi, player p 
    WHERE pi.player_id = p.player_id
    AND p.username = $1 AND item_id = $2)`, [player_name, item_id])
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

Item.removeItem = async (options) => {
  const {item_id} = options;
  return db.result('DELETE FROM item WHERE item_id = $1', item_id)
  .then(result => {
    return result.rowCount;
  })
  .catch(error => {
    throw error;
  });
};

export default Item;
