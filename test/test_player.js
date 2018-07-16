const assert = require('assert');
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
});