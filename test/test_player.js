const assert = require('assert');
import mongoose from 'mongoose';
import Game from '../models/games.model';
import Player from '../models/players.model';

describe('Player model tests', () => {
    
    let testPlayer = new Player({ name: `test ${Math.floor(Math.random() * 10000)}` });
    let game_id = mongoose.Types.ObjectId('5b4d4e98507e3e33f46f5e68'); // test

    it('Retrieves all players', (done) => {
        Player.getAll(player => {
            assert(typeof player !== 'undefined');
            done();
        });
    });

    it('Creates a player', (done) => {
        Player.addPlayer(testPlayer, (err, player) => {
            assert(!player.isNew);
            done();
        });
    });

    it('Retrieves a player', (done) => {
        Player.find(testPlayer, (err, player) => {
            assert(typeof player !== 'undefined');
            done();
        });
    });

    it('Updates a player', (done) => {
        let player = { name: testPlayer.name, x: 99, y: 33, z: 55 };
        Player.updatePlayer(player, 
        (err, updatedPlayer) => {
            if (err) throw err;
            assert(typeof updatedPlayer !== 'undefined');
            done();
        });
    });

    it('Set player\'s game: test', (done) => {
        Game.findOne({ name: 'test' }, (err,game) => {
            if (err) throw err;
            Player.setGame(testPlayer.name, game._id, 
                (err, player) => {
                    if (err) throw err;
                    assert(typeof player !== 'undefined');
                    done();
                });
        });
    });
    
    it('Find all players in game: test ', (done) => {
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
        Player.removePlayer(testPlayer.name, () => {
            Player.findOne({ name: testPlayer.name },
                (err, player) => {
                    assert(player === null);
                    done();
                });
        });
    });
});