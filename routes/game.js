var express = require('express');
var router = express.Router();
var MongoPool = require("../mongo-pool");
const Params = require("../params");

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
    
    let selectorParams = new Params();
    selectorParams.addParam('_id', game_id, true);
    selectorParams.addParam('players.player_id', player_id, true);

    MongoPool.getInstance(function (db) {
        db.collection('games').findOne(selectorParams.obj, function(err, game) {
            if (err) throw err;
            res.json(game.players.find( obj => obj.player_id.toString() === `${player_id}`));
        });
    });
});

// http://localhost:3000/game/add_player?game_id=GAMEID&player_id=PLAYERID
router.get('/add_player', function(req, res, next) {
    const { game_id, player_id } = req.query;
    
    let selectorParams = new Params();
    selectorParams.addParam('_id', game_id, true);

    let updateParams = new Params();
    updateParams.addParam('player_id', player_id, true);
    updateParams.addParam('last_active', new Date());
    
    MongoPool.getInstance(function (db) {
        db.collection('games')
        .update(
            selectorParams.obj, 
            {$push: { 'players' : updateParams.obj} },
            function(err, result) {
                if (err) throw err;
                res.json(result);
        });
    });
});

// http://localhost:3000/game/update_player?game_id=GAMEID&player_id=PLAYERID&x=X&y=Y&z=Z
router.get('/update_player', function(req, res, next) {
    const { game_id, player_id, x, y, z } = req.query;
    
    let selectorParams = new Params();
    selectorParams.addParam('_id', game_id, true);
    selectorParams.addParam('players.player_id', player_id, true);

    let updateParams = new Params();
    updateParams.addParam('player_id', player_id, true);
    updateParams.addParam('x', x);
    updateParams.addParam('y', y);
    updateParams.addParam('z', z);
    updateParams.addParam('timestamp', new Date());
    
    MongoPool.getInstance(function (db) {
        db.collection('games')
        .update(
            selectorParams.obj, 
            {$set: { 'players.$' : updateParams.obj} },
            function(err, result) {
                if (err) throw err;
                res.json(result);
        });
    });
});

module.exports = router;
