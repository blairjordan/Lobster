const assert = require('assert');
import Item from '../models/item.model';

describe('Item model tests', () => {

	let item = null;
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
		Item.addPlayerItem({ player_name: 'blair', item_id, item_count: 3 })
			.then(function (addedPlayerItem) {
				assert(addedPlayerItem.player_item_id > 0);
				done();
			})
			.catch(function (e) {
				done(e);
			});
	});
		
	it('Removes a player item', (done) => {
		const { item_id } = item;
		Item.removePlayerItem({ 'player_name': 'blair', item_id })
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