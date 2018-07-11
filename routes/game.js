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

// http://localhost:3000/game/add_player?id=5b45606c7ea09d340462c3c2&player_id=5b45878f7ea09d340462c3cd
router.get('/add_player', function(req, res, next) {

    const { id, player_id } = req.query;
    
    let selectorQuery = new Query();
    selectorQuery.addParam('_id', id);

    let updateQuery = new Query();
    updateQuery.addParam('player_id', player_id, true);
    
    MongoPool.getInstance(function (db) {
        db.collection('games')
        .update(
            selectorQuery.obj, 
            {$push: { "players" : updateQuery.obj} },
            function(err, result) {
                console.log(err);
                res.json(result);
        });
    });
});

module.exports = router;
