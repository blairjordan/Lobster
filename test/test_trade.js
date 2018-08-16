const assert = require('assert');
import Trade from '../models/trade.model';

describe('Trade model tests', () => {
    

	it('Creates an offer', (done) => {
		Trade.addOffer({ source_player_name: 'blair', target_player_name: 'matt' })
			.then(function (addedOffer) {
				assert(addedOffer.offer_id > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});
    
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

    // TODO: Update offer

    // TODO: Remove offer

    // TODO: Finalize offer, i.e., transfer both player's trade items and log 

});