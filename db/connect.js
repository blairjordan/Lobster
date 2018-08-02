import Mongoose from 'mongoose';
import logger from '../core/logger/app-logger';
import config from '../core/config/config.dev';
const pgp = require('pg-promise')();

Mongoose.Promise = global.Promise;

const connectToMongo = async () => {
    const { host, port, name } = config.db.mongo;
    
    try {
        await Mongoose.connect(process.env.MONGODB_URI || `mongodb://${host}:${port}/${name}`, { useMongoClient: true });
        logger.info('Connected to Mongo.');
    }
    catch (err) {
        logger.error('Could not connect to MongoDB');
    }
};

let db;
const connectToPostgres = async () => {
    const { host, port, database, user, pass } = config.db.postgres;
    
    try {
        db = await pgp(`postgres://${user}:${pass}@${host}:${port}/${database}`);
        
        db.connect()
        .then(function (obj) {
            logger.info('Connected to Postgres.');
            obj.done();
        })
        .catch(function (error) {
            console.log("ERROR:", error.message);
        });
    }
    catch (err) {
        logger.error('Could not connect to Postgres');
    }
};

module.exports = {connectToMongo, connectToPostgres, db};