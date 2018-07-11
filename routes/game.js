var express = require('express');
var router = express.Router();
var MongoPool = require("../mongo-pool");

/* GET users listing. */
router.get('/', function(req, res, next) {
    MongoPool.getInstance(function (db){
        db.collection('games').find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

module.exports = router;
