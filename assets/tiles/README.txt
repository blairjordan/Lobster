Place tiles in this directory.

Make sure naming convention conforms to your pincer config.

Example:

For the following config:

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

Valid tiles are:
- Tile_2x-1.png
- Tile_0x0.png
- Tile_3x-2.png
- Tile_-1x-3.png
- Tile_default.png
- etc.