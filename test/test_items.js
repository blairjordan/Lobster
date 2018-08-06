const assert = require('assert');
import Item from '../models/item.model';

describe('Item model tests', () => {
    
    let item = null;
    it('Creates an item', (done) => {
        Item.addItem({name: 'blowfish', type: 1, description: 'Poisonous puffer fish.'})
        .then(function (itemAdded) {
            item = itemAdded;
            assert(typeof itemAdded !== 'undefined');
            done();
        })
        .catch(function (e) {
            done(e);
        });
    });

    it('Retrieves all items', (done) => {
        Item.getAll()
        .then(function (data) {
            assert(data.length > 0);
            done();
        })
        .catch(function (e) {
            done(e);
        });
    });

    it('Deletes an item', (done) => {
        const {item_id} = item;
        Item.removeItem({item_id})
        .then(function (deletedCount) {
            assert(deletedCount > 0);
            done();
        })
        .catch(function (e) {
            done(e);
        });
    });

    // TODO: Remove item

});