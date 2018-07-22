// Code I wrote in a different project to merge and split images.
// Will use this as the backend for the tile merger and importer.

var gm = require('gm');

// Next to each other
/*gm('grid.png')
.montage('grid.png')
.geometry('9024+4096+0+0')
.background('#000000')
.write('montage.png', function(err) {
    if(err)
      console.log(err);
    if(!err) 
      console.log("Written montage image.");
});*/

// Next to each other
gm('grid.png')
.montage('grid.png')
.tile('1x2') // one tile per column
.geometry('4024+9024+0+0')
.background('#000000')
.write('montage.png', function(err) {
    if(err)
      console.log(err);
    if(!err) 
      console.log("Written montage image.");
});


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