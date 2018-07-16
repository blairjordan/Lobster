const assert = require('assert');
import mongoose from 'mongoose';
import Game from '../models/games.model';

describe('Game model tests', () => {
    
    let testGame = new Game({ name: `game ${Math.floor(Math.random() * 10000)}` });

    it('Retrieves all games', (done) => {
        Game.getAll().then(games => {
            assert(typeof games !== 'undefined');
            done();
        });
    });

    it('Creates a game', (done) => {
        Game.addGame(testGame).then(game => {
            assert(!game.isNew);
            done();
        });
    });

    it('Retrieves a game', (done) => {
        Game.find(testGame).then(game => {
            assert(typeof game !== 'undefined');
            done();
        });
    });

    it('Removes a game', (done) => {
        Game.findOneAndRemove({ _id : mongoose.mongo.ObjectID(testGame._id) })
        .then(() => Game.findOne({ _id : mongoose.mongo.ObjectID(testGame._id) }))
        .then((game) => {
            assert(game === null);
            done();
        });
    });
});