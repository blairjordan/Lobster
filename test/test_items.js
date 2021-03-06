const assert = require('assert');
import Item from '../models/item.model';

describe('Item model tests', () => {

    let item = null,
        testPlayerName = 'blair';

	it('Creates an item', (done) => {
		Item.addItem({ name: 'blowfish', type: 'fish', description: 'Poisonous puffer fish.' })
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
    
	it('Retrieves all item types', (done) => {
		Item.getTypes()
			.then(function (data) {
				assert(data.length > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});
		
	it('Retrieves a player\'s items', (done) => {
		Item.getPlayerItems({ player_name: testPlayerName })
			.then(function (data) {
				assert(data.length > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});

	it('Retrieves a random item', (done) => {
		Item.getRandomItem({ type: 'fish' })
			.then(function (item) {
				assert(typeof item !== 'undefined');
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});

	it('Updates an item', (done) => {
		const { item_id } = item;
		Item.updateItem({ item_id, name: 'blowey', description: 'If you eat this fish, you WILL die.' })
			.then(function (updatedCount) {
				assert(updatedCount > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});
	
	it('Creates a player item', (done) => {
		const { item_id } = item;
		Item.addPlayerItem({ player_name: testPlayerName, item_id, item_count: 3 })
			.then(function (result) {
				assert(result === 'ITEM_CREATED');
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});
		
	it('Removes a player item', (done) => {
		const { item_id } = item;
		Item.removePlayerItem({ 'player_name': testPlayerName, item_id })
			.then(function (addedPlayer) {
				assert(addedPlayer > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});

	it('Deletes an item', (done) => {
		const { item_id } = item;
		Item.removeItem({ item_id })
			.then(function (deletedCount) {
				assert(deletedCount > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});

});