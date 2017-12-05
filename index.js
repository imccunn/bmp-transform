#! /usr/bin/env node

// BMP Transform
// Author: Ian McCunn <ianmccunn@gmail.com>
// License: MIT

'use strict';

var fh = require('./lib/fileHandler'),
    Bitmap = require('./lib/Bitmap'),
    args = process.argv;

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

  var bmpBuf = fh.readBmp(bmpFile);

  var bmpObj = new Bitmap(bmpBuf);
  console.log(JSON.stringify(bmpObj.header, null, 2));
  // bmpObj.transformPalette();

  // bmpBuf = bmpObj.applyPaletteToBuffer(bmpBuf);
  bmpObj.applyPixelData();
  fh.writeFile(writeFile, bmpObj.bmpBuf);
};

app();

module.exports = app;
