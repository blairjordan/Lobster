const assert = require('assert');
import Player from '../models/player.model';

describe('Player model tests', () => {

  let player = null;
  it('Creates an item', (done) => {
    Player.addPlayer({ username: 'test_player', email: 'test@lobster.com' })
      .then(function (playerAdded) {
        player = playerAdded;
        assert(typeof playerAdded !== 'undefined');
        done();
      })
      .catch(function (e) {
        done(e);
      });
  });

  it('Retrieves all players', (done) => {
    Player.getAll()
      .then(function (data) {
        assert(data.length > 0);
        done();
      })
      .catch(function (e) {
        done(e);
      });
  });

  it('Updates a player', (done) => {
    const { player_id } = player;
    Player.updatePlayer({ player_id, username: 'updated_test_player', email: 'test_updated@lobster.com', x: 10, y: 20, z:30 })
      .then(function (updatedCount) {
        assert(updatedCount > 0);
        done();
      })
      .catch(function (e) {
        done(e);
      });
  });

  it('Deletes a player', (done) => {
    const { player_id } = player;
    Player.removePlayer({ player_id })
      .then(function (deletedCount) {
        assert(deletedCount > 0);
        done();
      })
      .catch(function (e) {
        done(e);
      });
  });
});