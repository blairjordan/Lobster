const assert = require('assert');
import mongoose from 'mongoose';
import Game from '../models/games.model';
import Player from '../models/players.model';

describe('Player model tests', () => {
    
    let testPlayer = new Player({ name: `test ${Math.floor(Math.random() * 10000)}` });
    let game_id = mongoose.Types.ObjectId('5b4c805c562146abed9e748b'); // testgame

    it('Retrieves all players', (done) => {
        Player.getAll().then(player => {
            assert(typeof player !== 'undefined');
            done();
        });
    });

    it('Creates a player', (done) => {
        Player.addPlayer(testPlayer).then(player => {
            assert(!player.isNew);
            done();
        });
    });

    it('Retrieves a player', (done) => {
        Player.find(testPlayer).then(player => {
            assert(typeof player !== 'undefined');
            done();
        });
    });

    it('Updates a player', (done) => {
        let x = 10, y = 20, z = 30;
        Player.findOneAndUpdate({ name: testPlayer.name }, 
        { $set: { x, y, z } },
        {  new: true },
        (err, updatedPlayer) => {
            if (err) throw err;
            assert(typeof updatedPlayer !== 'undefined');
            done();
        });
    });

    it('Adds player to a game: testgame ', (done) => {
        Game.findOne({ name: 'testgame' }, function(err,game) {
            if (err) throw err;
            Player.findOneAndUpdate({ name: testPlayer.name }, 
                { $set: { game: game._id } },
                { new: true },
                (err, player) => {
                    if (err) throw err;
                    assert(typeof player !== 'undefined');
                    done();
                });
        });
    });
    
    it('Find all players in game: testgame', (done) => {
        Player.find({ "game" : game_id })
        .then(playersFound => {
            try {
                assert.notEqual(playersFound.length, 0);
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });

    it('Removes a player', (done) => {
        Player.findOneAndRemove({ _id : mongoose.mongo.ObjectID(testPlayer._id) })
        .then(() => Player.findOne({ _id : mongoose.mongo.ObjectID(testPlayer._id) }))
        .then((player) => {
          assert(player === null);
          done();
        });
    });
});