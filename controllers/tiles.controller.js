import Tile from '../models/tiles.model';
import logger from '../core/logger/app-logger';

// Pincer config
const conf = {
  temp: './temp',
  tile: {
    width: 4096,
    height: 4096,
    path: './assets/tiles',
    tilePrefix : 'Tile_',
    ext: '.png',
    notile: 'default'
  }
};