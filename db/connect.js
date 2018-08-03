import Mongoose from 'mongoose';
import logger from '../core/logger/app-logger';
import config from '../core/config/config.dev';
const pgp = require('pg-promise')({});

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

const { host, port, database, user, pass } = config.db.postgres;
let db = pgp(`postgres://${user}:${pass}@${host}:${port}/${database}`);
const connectToPostgres = async () => {
    try {
        db.connect()
        .then(function (obj) {
            logger.info('Connected to Postgres.');
            //obj.done();
        })
        .catch(function (error) {
            logger.error("ERROR:", error.message);
        });
    }
    catch (err) {
        logger.error('Could not connect to Postgres');
    }
};

module.exports = {connectToMongo, connectToPostgres, db};