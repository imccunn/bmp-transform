#! /usr/bin/env node

const fh = require('./lib/fileHandler');
const Bitmap = require('./lib/Bitmap');
const args = process.argv;

if (args.length > 4) {
  throw new Error('Unrecognized command line argument. Optional read and write file locations permitted.');
}
const bmpFile = args[2] || 'img/testing1.bmp';
const writeFile = args[3] || 'img/altered.bmp';

fh.readFile(bmpFile)
  .then(buffer => {
    var bmpObj = new Bitmap(buffer);
    console.log(JSON.stringify(bmpObj.header, null, 2));

    bmpObj.applyPixelData();
    bmpObj.sortPixels();
    bmpObj.applyFromPixelGrid();
    return fh.writeFile(writeFile, bmpObj.bmpBuf);
  });
