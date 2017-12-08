#! /usr/bin/env node

const fh = require('./lib/fileHandler');
const Bitmap = require('./lib/Bitmap');
const args = process.argv;

/**
 *  Reads in a bitmap file, applies random byte decimal values to its palette and writes back to a bmp file.
 */

var app = function() {
  if (args.length > 4) {
    throw new Error('Unrecognized command line argument. Optional read and write file locations permitted.');
  }
  // Optionally take in a read-file location and write-file location from the command line
  var bmpFile = args[2] || 'img/testing1.bmp';
  var writeFile = args[3] || 'img/altered.bmp';

  // var bmpBuf = fh.readBmp(bmpFile);
  fh.readFile(bmpFile)
    .then(buffer => {
      var bmpObj = new Bitmap(buffer);
      console.log(JSON.stringify(bmpObj.header, null, 2));
      // bmpObj.transformPalette();

      // bmpBuf = bmpObj.applyPaletteToBuffer(bmpBuf);
      bmpObj.applyPixelData();
      fh.writeFile(writeFile, bmpObj.bmpBuf);
    });

  
};

app();

module.exports = app;
