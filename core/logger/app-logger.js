import * as winston from 'winston';
import * as rotate from 'winston-daily-rotate-file';
import config from '../config/config.dev';
import * as fs from 'fs';

const dir = config.log.logFileDir;

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

let logger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.Console)({
            colorize: true,
        }),
        new winston.transports.DailyRotateFile({
            filename: config.log.logFileName,
            dirname: config.log.logFileDir,
            maxsize: 20971520, //20MB
            maxFiles: 25,
            datePattern: '.dd-MM-yyyy'
        })
    ]
});

export default logger;