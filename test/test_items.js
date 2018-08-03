const assert = require('assert');
import Item from '../models/item.model';

describe('Item model tests', () => {
    
    // TODO: Create item

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