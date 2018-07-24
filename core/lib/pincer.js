var gm = require('gm');
var fs = require('fs');

// TODO:
// Disambiguate width and height from pixels .. change to (hcount,vcount)?
// Consolidate "stitch" and "generate" .. use options and pass global conf
// .. Will get a better idea of this once endpoint implemented

//const {xMax,xMin,yMax,yMin} = input.size; 

const conf = {
  temp: './temp',
  tile: {
    width: 4096,
    height: 4096,
    path: 'tiles',
    tilePrefix : 'Tile_',
    ext: '.png',
    notile: 'default'
  }
};

const tileExists = (input,x,y) => input.tiles.find(t => (t.x === x) && (t.y === y) );

const tempDir = () => {
  let tmp = `${conf.temp}/${Math.round((Math.random() * 36 ** 12)).toString(36)}`;
  if (!fs.existsSync(tmp)){
    fs.mkdirSync(tmp);
    return tmp;
  } else {
    return null;
  }
};

// panel([ 'NULL:', 'NULL:', 'NULL:' ],12288,4096,'./temp/TESTING','0', (err) => {console.log(err);});
const panel = async (input,width,height,temp,label,cb) => {
  let gen = null;
  if (input.length > 0) {
    gen = gm()
    .geometry(`${width}+${height}+0+0`)
    .tile(`${input.length}x1`)
    .background('#000000');

    for (let i = 0; i < input.length; i++) {
      gen.montage(input[i]);
    }

    let fullpath = `${temp}/${label}${conf.tile.ext}`;
    await gen
      .resize(width, height)
      .write(fullpath, cb);
  }
};

const combine = async (temp,width,height) => {
  let found = [];
  fs.readdirSync(temp).forEach(file => {
    found.push({path:`${temp}/${file}`, idx: parseInt(file.replace(conf.tile.ext,''))});
  });
  
  let sorted = found.sort((a,b) => (a.idx < b.idx) ? 1 : ((b.idx > a.idx) ? -1 : 0));

  if (sorted.length > 1) {
    gen = gm()
    .tile(`1x${sorted.length}`)
    .geometry(`${width}+${height}+0+0`);
    
    for (let i = 0; i < sorted.length; i++) {
      gen = gen.montage(sorted[i].path);
    }
    
    gen.write(`${temp}/final.png`, function(err) {
      if(err)
        console.log(err);
      if(!err) 
        console.log("Written montage image.");
      });
    ;
  }
};

const stitch = async options => {
  const {path,tilePrefix,ext,notile} = conf.tile;
  const [totalWidth,totalHeight] = [options.size.width * conf.tile.width, options.size.height * conf.tile.height];

  const {xMin,xMax,yMin,yMax} = options.tiles;

  let temp = tempDir();

  let promises = [];
    for (let y = yMax; y >= yMin; y--) {
      let ptiles = [];
      for (let x = xMin; x <= xMax; x++) {
        let tile = tileExists(x,y);
        if (tile) {
          let fpath = `${path}/${tilePrefix||'Tile_'}${x}x${y}${ext||'.png'}`;
          let dpath = `${path}/${tilePrefix||'Tile_'}${notile}${ext||'.png'}`;
          
          if (fs.existsSync(fpath)) {
            ptiles.push(fpath);
          } else {
            ptiles.push(dpath);
          }
          
        } else {
          ptiles.push('NULL:');
        }
      }

      promises.push(
        new Promise(resolve => panel(ptiles,totalWidth,conf.tile.height,temp,y,
          (err) => {
            if (err) { console.log(err); }
            resolve();
          }))
      );
    }
  
  return Promise.all(promises).then(() => {
    combine(temp,totalHeight,totalWidth,conf.tile.width);
  });
};

module.exports = {stitch};

//stitch(input);

/*
const generateTiles = (options) => {

  const {input, width, height, prefix, segmentCount, ext, output, seperator} = options;
  let tileNames = [];

  const [segmentSizeW,segmentSizeH] = [width/segmentCount,height/segmentCount];
  const mid = Math.floor(segmentCount/2);
  let offsetW = 0;
  let offsetH = 0;
  let promises = [];

  for (let i = 0; i < segmentCount; i++) {
    if (offsetW == width) { offsetW = 0; }
    for (let j = 0; j < segmentCount; j++) {
        if (offsetH == height) { offsetH = 0; }
        let fname = `${prefix||'Tile'}${j%segmentCount-mid}${seperator||'_'}${(i%segmentCount-mid)*-1}.${ext||'png'}`;

        promises.push(
          new Promise(resolve =>
            gm(input).crop(segmentSizeW, segmentSizeH, offsetW, offsetH)
            .write(`${output}/${fname}`, function (err) {
              if (err) { console.log(err); return; }
              tileNames.push(fname);
              resolve();
            })
          ));
        
        offsetH += segmentSizeH;
    }
    offsetW += segmentSizeW;
  }

  return Promise.all(promises).then(() => {
    return tileNames;
  });
};

let input = 'grid.png';
gm(input).size(function(err, meta){
  const {width, height} = meta;
  if (err) { console.log(err); return; }

  let tiles = generateTiles({
    input,
    segmentCount: 16,
    prefix: 'Tile_',
    ext: 'png',
    output: "./output",
    width,
    height,
    seperator: '_'
  }).then(tiles => {
    console.log(tiles);
  });
});
*/