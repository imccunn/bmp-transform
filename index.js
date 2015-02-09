#! /usr/bin/env node

'use strict';

var fh = require('./lib/fileHandler'),
    bmp = require('./lib/bmpObject'),
    args = process.argv;

var app = function() {

  if (args.length > 4) {
    throw 'Unrecognized command line argument. Optional read and write file locations permitted.';
  }
  // Optionally take in a read-file location and write-file location from the command line
  var bmpFile = args[2] || 'img/test.bmp';
  var writeFile = args[3] || 'img/altered.bmp';

  var bmpBuf = fh.readBmp(bmpFile);
  
  var bmpObj = new bmp.Bitmap(bmpBuf);

  bmpObj.transformPalette();

  bmpBuf = bmpObj.applyPaletteToBuffer(bmpBuf);

  fh.writeFile(writeFile, bmpBuf);

};

app();

module.exports = app;
