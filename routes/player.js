const express = require('express');
const router = express.Router();
const MongoPool = require("../mongo-pool");
const Query = require("../query");

router.get('/', function(req, res, next) {
    const { id } = req.query;
    let selectorQuery = new Query();
    selectorQuery.addParam('_id', id);

    MongoPool.getInstance(function (db){
        db.collection('players').find(selectorQuery.obj).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

module.exports = router;
