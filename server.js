import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import logger from './core/logger/app-logger';
import morgan from 'morgan';
import config from './core/config/config.dev';
import players from './routes/players.route';
import tiles from './routes/tiles.route';
import trade from './routes/trade.route';
import items from './routes/items.route';
import {connectToPostgres} from './db/connect';

const port = config.serverPort;
logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

connectToPostgres();

if (!fs.existsSync('./temp'))
    fs.mkdirSync('./temp');

const app = express();
// app.use(compression());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev", { "stream": logger.stream }));
app.use(express.static(__dirname + '/public' ));
app.use(express.static(__dirname + '/assets' ));

app.use('/players', players);
app.use('/tiles', tiles);
app.use('/trade', trade);
app.use('/items', items);

//Index route
app.get('/', function (req, res) {
    res.render('index', { title: 'Lobster', message: 'Welcome to Lobster!' });
});

let server = http.createServer(
/*{
    key: fs.readFileSync('/etc/letsencrypt/live/dev.pegleg.com.au/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dev.pegleg.com.au/cert.pem')
},*/
    app).setTimeout(10*60*1000).listen(port, () => {
    logger.info('server started - ', port);
});

module.exports = app;
