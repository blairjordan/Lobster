var gm = require('gm');
var fs = require('fs');

// TODO:
// Disambiguate width and height from pixels .. change to (hcount,vcount)?

const tileExists = (tiles,x,y) => tiles.find(t => (t.x === x) && (t.y === y) );

const tempDir = conf => {
  let tmp = `${conf.temp}/${Math.round((Math.random() * 36 ** 12)).toString(36)}`;
  if (!fs.existsSync(tmp)){
    fs.mkdirSync(tmp);
    return tmp;
  } else {
    return null;
  }
};

// panel([ 'NULL:', 'NULL:', 'NULL:' ],12288,4096,'./temp/TESTING','0', (err) => {console.log(err);});
const panel = async (conf,input,width,height,temp,label,cb) => {
  if (input.length > 0) {
    let gen = gm()
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

const combine = async (conf,temp,width,height) => {
  let found = [];
  
  console.log(temp);
  console.log(fs.readdirSync(temp));
  fs.readdirSync(temp).forEach(file => {
    found.push({path:`${temp}/${file}`, idx: parseInt(file.replace(conf.tile.ext,''))});
  });
  
  console.log(found);
  let sorted = found.sort((a,b) => (a.idx < b.idx) ? 1 : ((b.idx > a.idx) ? -1 : 0));

  if (sorted.length > 1) {
    let gen = gm()
    .tile(`1x${sorted.length}`)
    .geometry(`${width}+${height}+0+0`);
    
    for (let i = 0; i < sorted.length; i++) {
      gen = gen.montage(sorted[i].path);
    }
    
    gen.write(`${temp}/final.png`, function(err) {
      if (err) { console.log(err); }
      else { console.log("Written montage image."); }
    });
    
  } else { console.log('Nothing to combine'); }
};

const stitch = async options => {
  const {tiles, conf, size} = options;
  const {xMin,xMax,yMin,yMax} = size;
  const {path,tilePrefix,ext,notile,separator} = conf.tile;
  
  const [totalWidth,totalHeight] = [size.width * conf.tile.width, size.height * conf.tile.height];

  let temp = tempDir(conf);
  let promises = [];

  for (let y = yMax; y >= yMin; y--) {
    let ptiles = [];
    for (let x = xMin; x <= xMax; x++) {
      let tile = tileExists(tiles,x,y);
      if (tile) {
        let fpath = `${path}/${tilePrefix||'Tile_'}${x}${separator||'x'}${y}${ext||'.png'}`;
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
      new Promise(resolve => panel(conf,ptiles,totalWidth,conf.tile.height,temp,y,
        (err) => {
          if (err) { console.log(err); }
          resolve();
        }))
    );
  }
  
  return Promise.all(promises).then(() => {
    combine(conf,temp,totalHeight,totalWidth,conf.tile.width);
  });
};

//stitch(input);

// tweak and expose this stuff when needed (chops up tiles again)

const split = async options => {

  const {conf,filename,vSegmentCount,hSegmentCount,output} = options;
  const {width, height, path, tilePrefix, ext, separator} = conf.tile;
  
  let tileNames = [];

  console.log(options);

  const [segmentSizeW,segmentSizeH] = [width,height];
  const hMid = Math.floor(hSegmentCount/2);
  const vMid = Math.floor(vSegmentCount/2);
  let offsetW = 0;
  let offsetH = 0;
  let promises = [];

  for (let i = 0; i < hSegmentCount; i++) {
    if (offsetW === width) { offsetW = 0; }
    for (let j = 0; j < vSegmentCount; j++) {
        if (offsetH === height) { offsetH = 0; }
        let fname = `${tilePrefix||'Tile'}${j%hSegmentCount-hMid}${separator||'_'}${(i%vSegmentCount-vMid)*-1}${ext||'png'}`;

        console.log(`\nfname:${fname}\nsegmentSizeW:${segmentSizeW}\nsegmentSizeH:${segmentSizeH}\noffsetW:${offsetW}\noffsetH:${offsetH}`);

        console.log(output);

        promises.push(
          new Promise(resolve =>
            gm(`${filename}`).crop(segmentSizeW, segmentSizeH, offsetW, offsetH)
            .write(`${output}${fname}`, function (err) {
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

module.exports = {stitch, split};

/*
let input = 'grid.png';
gm(input).size(function(err, meta){
  const {width, height} = meta;
  if (err) { console.log(err); return; }

  let tiles = split({
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