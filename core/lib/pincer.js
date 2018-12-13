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
  
  fs.readdirSync(temp).forEach(file => {
    found.push({path:`${temp}/${file}`, idx: parseInt(file.replace(conf.tile.ext,''))});
  });
  found.sort((a,b) => (b.idx - a.idx));

  if (found.length > 1) {
    let gen = gm()
    .tile(`1x${found.length}`)
    .geometry(`${width}+${height}+0+0`);
    
    for (let i = 0; i < found.length; i++) {
      gen = gen.montage(found[i].path);
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

const size = options => {
  return new Promise(resolve => {
    gm(options.filepath).size(function(err, m){
      if (err) { throw err; }
      resolve(m);
    });
  });
};

const split = async options => {
  const {conf,filepath,size} = options;
  const {xMin, xMax, yMin, yMax} = size;
  const {width,height,tilePrefix,ext,separator} = conf.tile;

  let [wTileSpan, hTileSpan] = [xMax - (xMin-1), yMax - (yMin-1)];
  let tileNames = [];
  let temp = tempDir(conf);

  const [segmentSizeW,segmentSizeH] = [width,height];
  let offsetW = 0;
  let offsetH = 0;
  let promises = [];

  for (let y = yMax; y >= yMin; y--) {
    if (offsetH === height * hTileSpan) { offsetH = 0; }
    for (let x = xMin; x <= xMax; x++) {
      if (offsetW === width * wTileSpan) { offsetW = 0; }
      let fname = `${tilePrefix||'Tile'}${x}${separator||'_'}${(y)}${ext||'png'}`;
      let output = `${temp}/${fname}`;
      promises.push(
        new Promise(resolve =>
          gm(`${filepath}`).crop(segmentSizeW, segmentSizeH, offsetW, offsetH)
          .write(`${temp}/${fname}`, function (err) {
            if (err) { console.log(err); return; }
            tileNames.push({ filename: fname, path: output, segmentSizeW, segmentSizeH, offsetW, offsetH });
            resolve();
          })
        ));
      
      offsetW += segmentSizeW;
    }
    offsetH += segmentSizeH;
  }

  return Promise.all(promises).then(() => {
    return tileNames;
  });
};

const replace = async options => {
  const {conf,filepath,tiles} = options;
  const {tilePrefix,ext,separator} = conf.tile;

  let s = await size({filepath});
  let [expectedW, expectedH] =
    [
      options.size.width * conf.tile.width,
      options.size.height * conf.tile.height
    ];
  let errors = [];
  if (s.width !== expectedW) {
    errors.push(`Image width: ${s.width} != expected ${expectedW} (${options.size.width} selected * ${conf.tile.width} tile config)`);
  }
  if (s.height !== expectedH) {
    errors.push(`Image height: ${s.height} != expected ${expectedH} (${options.size.height} selected * ${conf.tile.height} tile config)`);
  }
  
  return new Promise(async (resolve, reject) => {
    if (errors.length) {
      reject(errors);
    } else {
      const images = await split({ conf, filepath, size: options.size });
      let selected = images.reduce((prev, curr) => {
        if (tiles.filter(t => (`${tilePrefix||'Tile_'}${t.x}${separator||'x'}${t.y}${ext||'.png'}` === curr.filename)).length) {
          prev.push(curr);
        }
        return prev;
      }, []);

      selected.forEach(f => {
        fs.copyFile(f.path, `${conf.tile.path}/${f.filename}`, (err) => {
          if (err) reject(err);
          console.log(`${f.path} was copied to ${f.filename}`);
        });
      });
      resolve(images);
    }
  });
};

module.exports = {stitch, split, size, replace};