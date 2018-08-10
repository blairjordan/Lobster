import logger from '../core/logger/app-logger';
import config from '../core/config/config.dev';
const pgp = require('pg-promise')({});

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

module.exports = {connectToPostgres, db};