'use strict';

var rand = require('./rand');
const fs = require('fs');

// Bitmap Header Offsets
const SIZE = 2;
const RESERVED_1 = 6;
const RESERVED_2 = 8;
const PX_START = 10;
const HEADER_SIZE = 14;
const WIDTH = 18;
const HEIGHT = 22;
const BITS_PER_PX = 28;
const COMPRESSION = 30;
const IMG_SIZE = 34;
const HOR_RES = 38;
const VER_RES = 42;
const PAL_SIZE = 46;
const PALETTE_OFFS = 54;

/**
 * Bitmap object reads a bitmap file and reads through the header information and color palette information.
 *
 * @param {Buffer} bitmap The buffer read from a bitmap file.
 */
function Bitmap(bitmap) {

  this.bmpBuf = bitmap;
  console.log('bitmap: ',bitmap);

  this.header = {};

  this.header.type = bitmap.toString('utf-8', 0, 2);
  if (this.header.type !== 'BM') {
    throw new Error('Type of file loaded is not a Bitmap file. Header type read does not match \'BM\'');
  }
  this.header.size = bitmap.readUInt32LE(SIZE);
  this.header.startOfPx = bitmap.readUInt32LE(PX_START);
  this.header.reserved1 = bitmap.readUInt32LE(RESERVED_1);
  this.header.reserved2 = bitmap.readUInt32LE(RESERVED_2);
  this.header.sizeOfHeader = bitmap.readUInt32LE(HEADER_SIZE);
  this.header.width = bitmap.readUInt32LE(WIDTH);
  this.header.height = bitmap.readUInt32LE(HEIGHT);
  this.header.bitsPerPx = bitmap.readUInt16LE(BITS_PER_PX);
  this.header.compression = bitmap.readUInt32LE(COMPRESSION);
  this.header.imgSize = bitmap.readUInt32LE(IMG_SIZE);
  this.header.horRes = bitmap.readUInt32LE(HOR_RES);
  this.header.verRes = bitmap.readUInt32LE(VER_RES);
  this.header.paletteSize = bitmap.readUInt32LE(PAL_SIZE);
  this.header.paletteOffset = PALETTE_OFFS;
  this.header.paletteLength = (this.header.startOfPx - this.header.paletteOffset) / 4;
  this.header.pixelDataRowSize = (this.header.bitsPerPx / 8) * this.header.width;
  this.header.pixelArraySize = this.header.pixelDataRowSize * this.header.height;
  this.palette = [];
  this.pixelData = [];

  // Immediately load the palette information on object instantiation
  this.loadPalette();
  this.loadPixelData();
}

Bitmap.prototype.loadPixelData = function() {
  let offset = this.header.startOfPx;
  let pixelFileData = '';
  for (var p = 0; p < this.header.pixelArraySize / 4; p++) {
      this.pixelData.push(this.bmpBuf.readUInt8(offset));
      this.pixelData.push(this.bmpBuf.readUInt8(offset + 1));
      this.pixelData.push(this.bmpBuf.readUInt8(offset + 2));
      this.pixelData.push(this.bmpBuf.readUInt8(offset + 3));
    offset += 4;
  }
};

Bitmap.prototype.applyPixelData = function() {
  let dPos = 50;
  let dyPos = 50;
  let shifted = [160, 161, 162, 170, 180, 181, 182, 183, 191, 192];

  let offset = this.header.startOfPx;
  let xPos = 0;
  let yPos = 0;
  for (let p = 0; p < this.header.pixelArraySize; p += 4) {

    if (xPos % (this.header.pixelDataRowSize / 4) === 0) {
      xPos = 0;
      yPos++;
    }

    let b, g, r;

    if (xPos === dPos || yPos === dyPos) {
      b = 0;
      g = rand.randRange(0, 140);
      r = rand.rByteDec();
    } else {
      b = this.pixelData[p];
      g = this.pixelData[p + 1];
      r = this.pixelData[p + 2];
    }

    if (xPos > 40 && xPos < 60 && yPos > 6 && yPos < 50) {
      let shift = 2;
      b = this.pixelData[p + (4 * shift)];
      g = 20;
      r = this.pixelData[p + (4 * shift) + 2];
    }

    if (xPos > 100 && xPos < 160 && yPos > 100 && yPos < 199) {
      let shift = 2;
      b = 30;
      g = 20;
      r = this.pixelData[p + (4 * shift) + 2];
    }

    if (xPos > 100 && xPos < 160 && yPos > 100 && yPos < 199) {
      let shift = 5;
      b = this.pixelData[p + (4 * shift)];
      g = this.pixelData[p + (4 * shift) + 1];
      r = this.pixelData[p + (4 * shift) + 2];
    }

    if (yPos > 100 && yPos < 199) {
      let shift = 50;
      let ra = Math.random();
      if (ra > 0.6) {
        b = 0;
        g = 0;
        r = 0;
      }
      if (yPos > 150) {
        if (shifted.includes(yPos)) {
          b = this.pixelData[p + (4 * shift)];
          g = this.pixelData[p + (4 * shift) + 1];
          r = this.pixelData[p + (4 * shift) + 2];
        }
      }
    }

    if (xPos === 1) {
      b = 255;
      g = 0;
      r = 0;
    }

    if (xPos === 1 && yPos === 2) {
      b = 255;
      g = 0;
      r = 0;
    }
    // console.log(`p=${p}, pos=${xPos} ${yPos}, bgr=${b} ${g} ${r}`);
    this.bmpBuf.writeUInt8(b, offset);
    this.bmpBuf.writeUInt8(g, offset + 1);
    this.bmpBuf.writeUInt8(r, offset + 2);
    offset += 4;
    xPos++;
  }
}

/**
 *     Once the buffer is attained from the file, we can load the palette information to an object.
 *     Each palette location can be represented by an object {b: 0-255, g: 0-255, b: 0-255, a: 0-255}
 *     each key is one byte read linearly.
 *
 * @return {Object} An object that abstracts the bitmap file binary data.
 */

Bitmap.prototype.loadPalette = function() {

  for (var i = 0; i < this.header.paletteLength; i++) {
    var iOffset = this.header.paletteOffset + i;
    this.palette[i] = {
      b: this.bmpBuf.readUInt8(iOffset),
      g: this.bmpBuf.readUInt8(iOffset + 1),
      r: this.bmpBuf.readUInt8(iOffset + 2),
      a: this.bmpBuf.readUInt8(iOffset + 3)
    };
  }
};

/**
 *     Once the palette information is loaded into the palette property, we can modify the
 *     individual palatte object values in any waybefore we send it out to a new buffer and write it to disk.
 */

Bitmap.prototype.transformPalette = function() { // To add: add passable transform function
  for (var i = 0; i < this.header.paletteLength; i++) {
    this.palette[i] = {
      b: rand.rByteDec(),
      g: rand.rByteDec(),
      r: rand.rByteDec(),
      // a: rand.rByteDec()
    };
  }


};

/**
 * Takes a buffer in and writes rgba values to the buffer in the order as specified by the
 * bitmap file spec and returns the buffer.
 *
 * @param  {Buffer} bmpBuf The buffer to be modified.
 * @return {Buffer}        The modified buffer.
 */
Bitmap.prototype.applyPaletteToBuffer = function(bmpBuf) {

  for (var i = 0; i < this.paletteLength; i++) {
    var iOffset = this.paletteOffset + i;
    bmpBuf.writeUInt8(this.palette[i].b, iOffset);
    bmpBuf.writeUInt8(this.palette[i].g, iOffset + 1);
    bmpBuf.writeUInt8(this.palette[i].r, iOffset + 2);
    bmpBuf.writeUInt8(this.palette[i].a, iOffset + 3);
  }
  return bmpBuf;
};

module.exports = Bitmap; // jshint ignore: line
