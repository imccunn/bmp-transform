#! /usr/bin/env node

const fh = require('./lib/fileHandler');
const Bitmap = require('./lib/Bitmap');
const args = process.argv;

if (args.length > 4) {
  throw new Error('Unrecognized command line argument. Optional read and write file locations permitted.');
}
const bmpFile = args[2] || 'img/source/mirror-lake.bmp';
const writeFile = args[3] || 'img/altered.bmp';

fh.readFile(bmpFile)
  .then(buffer => {
    var bmpObj = new Bitmap(buffer);
    console.log(JSON.stringify(bmpObj.header, null, 2));

    bmpObj
      .createRects()
      .applyPixelData()
      .sortPixels();

    bmpObj.writePixelGridToFile('./data/pixelGridData.txt');
    bmpObj.applyFromPixelGrid();
    return fh.writeFile(writeFile, bmpObj.bmpBuf);
  })
  .then(data => console.log('Done.'))
  .catch(err => {
    console.log(err);
  });
