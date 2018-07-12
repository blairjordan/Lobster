var express = require('express');
var router = express.Router();
var MongoPool = require("../mongo-pool");
const Query = require("../query");

router.get('/', function(req, res, next) {
    MongoPool.getInstance(function (db) {
        db.collection('games').find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

// http://localhost:3000/game/update_player?game_id=GAMEID&player_id=PLAYERID
router.get('/player', function(req, res, next) {
    const { game_id, player_id } = req.query;
    
    let selectorQuery = new Query();
    selectorQuery.addParam('_id', game_id, true);
    selectorQuery.addParam('players.player_id', player_id, true);

    MongoPool.getInstance(function (db) {
        db.collection('games').findOne(selectorQuery.obj, function(err, game) {
            if (err) throw err;
            res.json(game.players.find( obj => { return obj.player_id = player_id }));
        });
    });
});

// http://localhost:3000/game/add_player?game_id=GAMEID&player_id=PLAYERID
router.get('/add_player', function(req, res, next) {
    const { game_id, player_id } = req.query;
    
    let selectorQuery = new Query();
    selectorQuery.addParam('_id', game_id, true);

    let updateQuery = new Query();
    updateQuery.addParam('player_id', player_id, true);
    updateQuery.addParam('last_active', new Date());
    
    MongoPool.getInstance(function (db) {
        db.collection('games')
        .update(
            selectorQuery.obj, 
            {$push: { 'players' : updateQuery.obj} },
            function(err, result) {
                if (err) throw err;
                res.json(result);
        });
    });
});

// http://localhost:3000/game/update_player?game_id=GAMEID&player_id=PLAYERID&x=X&y=Y&z=Z
router.get('/update_player', function(req, res, next) {
    const { game_id, player_id, x, y, z } = req.query;
    
    let selectorQuery = new Query();
    selectorQuery.addParam('_id', game_id, true);
    selectorQuery.addParam('players.player_id', player_id, true);

    let updateQuery = new Query();
    updateQuery.addParam('player_id', player_id, true);
    updateQuery.addParam('x', x);
    updateQuery.addParam('y', y);
    updateQuery.addParam('z', z);
    updateQuery.addParam('timestamp', new Date());
    
    MongoPool.getInstance(function (db) {
        db.collection('games')
        .update(
            selectorQuery.obj, 
            {$set: { 'players.$' : updateQuery.obj} },
            function(err, result) {
                if (err) throw err;
                res.json(result);
        });
    });
});

module.exports = router;
