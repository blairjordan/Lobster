const express = require('express');
const router = express.Router();
const MongoPool = require("../mongo-pool");
const Query = require("../query");

router.get('/', function(req, res, next) {
    const { id } = req.query;

    let q = new Query();
    q.addParam('_id', id);

    MongoPool.getInstance(function (db){
        db.collection('players').find(q.obj).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

module.exports = router;
