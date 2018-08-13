import path from "path";

const config = {
  serverPort: process.env.serverPort || 3000,
  log: {
    logFileDir: path.join(__dirname, '../../log'),
    logFileName: 'app.log',
  },
  db: {
    postgres: {
      host: process.env.pghost || 'localhost',
      port: process.env.pgport || '5432',
      database: process.env.pgdb || 'lobster',
      user: process.env.pguser || 'lobster',
      pass: process.env.pgpass || 'lobster',
    }
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