const assert = require('assert');
import Tile from '../models/tiles.model';

describe('Tile model tests', () => {

  let testTile = { x: 10, y: 20 };

  it('Retrieves all tiles', (done) => {
    Tile.getAll()
      .then(function (data) {
        assert(data.length > 0);
        done();
      })
      .catch(function (e) {
        done(e);
      });
  });

  /*it('Creates a tile', (done) => {
    Tile.addTile(testTile, (err, tile) => {
      assert(!tile.isNew);
      done();
    });
  });

  it('Retrieves a tile', (done) => {
    Tile.find(testTile).then(tile => {
      assert(typeof tile !== 'undefined');
      done();
    });
  });

  it('Updates a tile', (done) => {
    let tile = { name: testTile.name, x: 25, y: 87 };
    Tile.updateTile(tile,
      (err, updatedTile) => {
        if (err) throw err;
        assert(typeof updatedTile !== 'undefined');
        done();
      });
  });

  it('Removes a tile', (done) => {
    let tileToRemove = { _id: mongoose.mongo.ObjectID(testTile._id) };
    Tile.removeTile(tileToRemove, () => {
      Tile.findOne(tileToRemove,
        (err, tile) => {
          assert(tile === null);
          done();
        });
    });
  });
  */
});