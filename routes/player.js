const express = require('express');
const router = express.Router();
const MongoPool = require("../mongo-pool");
const Params = require("../params");

router.get('/', function(req, res, next) {
    const { id } = req.query;
    let selectorParams = new Params();
    selectorParams.addParam('_id', id);

    MongoPool.getInstance(function (db){
        db.collection('players').find(selectorParams.obj).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

// http://localhost:3000/player/create?name=PLAYERNAME
router.get('/create', function(req, res, next) {
    const { name } = req.query;

    let insertParams = new Params();
    insertParams.generateID();
    insertParams.addParam('name', name);

    MongoPool.getInstance(function (db) {
        db.collection('players')
        .insertOne(
            insertParams.obj,
            function(err, result) {
                if (err) throw err;
                res.json(result);
        });
    });
});

module.exports = router;
