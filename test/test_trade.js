const assert = require('assert');
import Trade from '../models/trade.model';

describe('Trade model tests', () => {

    let testSourcePlayerName = 'blair',
        testTargetPlayerName = 'matt',
        testItemId = 1;


    it('Creates an offer', (done) => {
        Trade.addOffer({ source_player_name: testSourcePlayerName, target_player_name: testTargetPlayerName })
            .then(function (addedOffer) {
                assert(addedOffer.offer_id > 0);
                done();
            })
            .catch(function (e) {
                done(e);
            });
    });

    it('Adds a trade offer item', (done) => {
        Trade.addItem({ source_player_name: testSourcePlayerName, target_player_name: testTargetPlayerName, item_id: testItemId, quantity: 10 })
            .then(function (status) {
                assert(status === 'ADDED');
                done();
            })
            .catch(function (e) {
                done(e);
            });
    });

    it('Retrieves a player\'s offers', (done) => {
        Trade.getOffersByPlayer({ player_name: testSourcePlayerName })
            .then(function (data) {
                assert(data.length > 0);
                done();
            })
            .catch(function (e) {
                done(e);
            });
    });

    it('Updates a player', (done) => {
        Trade.setOfferStatus({ source_player_name: testSourcePlayerName, target_player_name: testTargetPlayerName, status: 'O' })
            .then(function (status) {
                assert(status === 'STATUS_UPDATED');
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
        Trade.removeOffer({ player_name: testSourcePlayerName })
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