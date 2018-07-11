var MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');

var option = {
  numberOfRetries : 5,
  auto_reconnect: true,
  poolSize : 40,
  connectTimeoutMS: 30000,
  useNewUrlParser: true
};

function MongoPool(){}

var p_db;

function initPool(cb){
  MongoClient.connect(`mongodb://${config.db.server}:${config.db.port}`, option, function(err, db) {
    if (err) throw err;

    p_db = db;
    if(cb && typeof(cb) == 'function')
        cb(p_db.db(config.db.database));
  });
  return MongoPool;
}
MongoPool.initPool = initPool;

function getInstance(cb){
  if(!p_db){
    initPool(cb)
  }
  else{
    if(cb && typeof(cb) == 'function') {
      cb(p_db.db(config.db.database));
    }
  }
}
MongoPool.getInstance = getInstance;

module.exports = MongoPool;