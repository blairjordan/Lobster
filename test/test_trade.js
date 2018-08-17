const assert = require('assert');
import Trade from '../models/trade.model';

describe('Trade model tests', () => {
    
    let testPlayerName = 'blair',
        testItemId = 1;


	it('Creates an offer', (done) => {
		Trade.addOffer({ source_player_name: testPlayerName, target_player_name: 'matt' })
			.then(function (addedOffer) {
				assert(addedOffer.offer_id > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});
    
	it('Adds a trade offer item', (done) => {
		Trade.addItem({ source_player_name: testPlayerName, target_player_name: 'matt', item_id: testItemId, quantity: 10 })
			.then(function (addedOfferItem) {
				assert(addedOfferItem.offer_item_id > 0);
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

    it('Deletes an offer', (done) => {
        Trade.removeOffer({ player_name: testPlayerName })
            .then(function (deletedCount) {
            assert(deletedCount > 0);
            done();
        })
        .catch(function (e) {
            done(e);
        });
    });
    
    // TODO: Update offer

    // TODO: Finalize offer, i.e., transfer both player's trade items and log 

});