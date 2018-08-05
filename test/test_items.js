const assert = require('assert');
import Item from '../models/item.model';

describe('Item model tests', () => {
    it('Creates an item', (done) => {
        Item.addItem({name: 'nutella', type: 'fish', description: 'It is nutty and chocolatty.'})
        .then(function (id) {
            assert(typeof id !== 'undefined');
            done();
        })
        .catch(function (e) {
            done(e);
        });
    });

    // TODO: Update item

    // TODO: Delete

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

    // TODO: Remove item

});