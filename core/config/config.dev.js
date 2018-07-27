import path from "path";

const config = {
  serverPort: process.env.serverPort || 3000,
  log: {
    logFileDir: path.join(__dirname, '../../log'),
    logFileName: 'app.log',
  },
  db: {
    dbHost: process.env.dbHost || 'localhost',
    dbPort: process.env.dbPort || '27017',
    dbName: process.env.dbName || 'lobster',
  },
  pincer: {
    temp: './temp',
    tile: {
      width: 4096,
      height: 4096,
      path: './assets/tiles',
      tilePrefix : 'Tile_',
      ext: '.png',
      notile: 'default',
      separator: 'x'
    }
  }
};

export default config;