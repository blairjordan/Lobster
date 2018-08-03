const assert = require('assert');
import Trade from '../models/trade.model';

describe('Trade model tests', () => {
    
    // TODO: Add offer

    // TODO: Update offer
    
    it('Retrieves all offers', (done) => {
        Trade.getOffers()
        .then(function (data) {
            assert(data.length > 0);
            done();
        })
        .catch(function (e) {
            done(e);
        });
    });

    // TODO: Remove offer

});