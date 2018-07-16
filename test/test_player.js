const assert = require('assert');
import mongoose from 'mongoose';
import Game from '../models/games.model';
import Player from '../models/players.model';

describe('Retrieves all players', () => {
    
    it('Retrieves all players', (done) => {
        Player.getAll().then(player => {
            console.log(player);
            
            assert(typeof player !== 'undefined');
            
            done();
        });
    });

    let testPlayer = new Player({name: `test ${Math.floor(Math.random() * 1000)}`});

    it('Creates a player', (done) => {
        Player.addPlayer(testPlayer).then(player => {
            console.log(player);
            assert(!player.isNew);
            done();
        });
    });

    it('Retrieves a player', (done) => {
        Player.find(testPlayer).then(player => {
            console.log(player);
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

    let game = {};
    it('Add player to a game: testgame ', (done) => {
        Game.findOne({ name: 'testgame' }, function(err,game) {
            if (err) throw err;
            Player.findOneAndUpdate({ name: testPlayer.name }, 
                { $set: { game: { '_id' : game._id } } },
                {  new: true },
                (err, player) => {
                    if (err) throw err;
                    assert(typeof player !== 'undefined');
                    done();
                });
        });
    });
    
    /// No working?? Returns all
    it('Find all players in game: testgame', (done) => {
        Player.find({ 'game._id' : mongoose.Schema.ObjectId(game._id) })
        .then(playersFound => {
            console.log(playersFound);
            assert(typeof playersFound !== 'undefined');
            done();
        });
    });

});