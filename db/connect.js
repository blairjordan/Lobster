import Mongoose from 'mongoose';
import logger from '../core/logger/app-logger';
import config from '../core/config/config.dev';

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
    const { dbHost, dbPort, dbName } = config;
    
    try {
        await Mongoose.connect(process.env.MONGODB_URI || `mongodb://${dbHost}:${dbPort}/${dbName}`, { useMongoClient: true });
        logger.info('Connected to mongo.');
    }
    catch (err) {
        logger.error('Could not connect to MongoDB');
    }
};

export default connectToDb;