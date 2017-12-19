
const rand = require('./rand');
const fs = require('fs');
const fileHandler = require('./fileHandler');

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


function Bitmap(buffer) {
  this.bmpBuf = buffer;
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

  this.pixelGrid = [];

  // Immediately load the palette information on object instantiation
  this.loadPalette();
  this.loadPixelData();
  this.to2DArray();
}

Bitmap.prototype.loadPixelData = function() {
  console.log('Loading pixel data.');
  let offset = this.header.startOfPx;
  for (let p = 0; p < this.header.pixelArraySize / 4; p++) {
    let b = this.bmpBuf.readUInt8(offset);
    let g = this.bmpBuf.readUInt8(offset + 1);
    let r = this.bmpBuf.readUInt8(offset + 2);
    let a = this.bmpBuf.readUInt8(offset + 3);
    this.pixelData.push(b);
    this.pixelData.push(g);
    this.pixelData.push(r);
    this.pixelData.push(a);
    offset += 4;
  }
};

Bitmap.prototype.to2DArray = function() {
  console.log('Converting to array.')
  let offset = this.header.startOfPx;
  let xPos = 0;
  let yPos = 0;

  for (let p = 0; p < this.header.pixelArraySize; p += 4) {
    if (this.pixelGrid[yPos] === undefined) this.pixelGrid[yPos] = [];
    let b = this.pixelData[p];
    let g = this.pixelData[p + 1];
    let r = this.pixelData[p + 2];
    this.pixelGrid[yPos].push([b, g, r, 0]);
    xPos++;
    if (xPos % (this.header.pixelDataRowSize / 4) === 0) {
      xPos = 0;
      yPos++;
    }
  }
};

Bitmap.prototype.applyPixelData = function() {
  console.log('Applying pixel data.');
  let offset = this.header.startOfPx;
  let xPos = 0;
  let yPos = 0;

  let shift = 300, shiftAmt = 1;
  
  for (let p = 0; p < this.header.pixelArraySize; p += 4) {
    let b, g, r;
    b = this.pixelGrid[yPos][xPos][0];
    g = this.pixelGrid[yPos][xPos][1];
    r = this.pixelGrid[yPos][xPos][2];

    // if (yPos > 6 && yPos < 100) {
    //   let shift = 30;
    //   let offShift = 4 * shift;
    //   b = this.pixelData[p + (4 * shift)];
    //   g = this.pixelData[p + (4 * shift) + 1];
    //   r = this.pixelData[p + (4 * shift) + 2];
    // }

    // if (yPos > 142 && yPos < 400) {
    //   // let offShift = 4 * shift;
    //   b = this.pixelData[p + (4 * shift)];
    //   g = this.pixelData[p + (4 * shift) + 1];
    //   r = this.pixelData[p + (4 * shift) + 2];
    // }

    // if (xPos > 100 && xPos < 160 && yPos > 100 && yPos < 199) {
    //   let shift = 2;
    //   b = 30;
    //   g = 60;
    //   r = this.pixelGrid[yPos][xPos][2];
    // }

    // if (yPos > 100 && yPos < 700 && xPos > 500 && xPos < this.header.width-100) {
    //   let shift = 50;
    //   let ra = Math.random();
    //   if (ra > 0.8) {
    //     b = 0;
    //     g = Math.floor(this.pixelData[p + 1] * 0.7);
    //     r = this.pixelData[p + 2];
    //   }
    //   // if (yPos > 150) {
    //   //   if (shifted.includes(yPos)) {
    //   //     b = this.pixelData[p + (4 * shift)];
    //   //     g = this.pixelData[p + (4 * shift) + 1];
    //   //     r = this.pixelData[p + (4 * shift) + 2];
    //   //   }
    //   // }
    // }
    
    this.rects.forEach(rect => {
      let mod = 1.4;
      if ((xPos >= rect.x && xPos <= rect.x + rect.w) && (yPos >= rect.y && yPos <= rect.y + rect.h)) {
        b = Math.floor(this.pixelGrid[yPos][xPos][0] + rand.randRange(0, (255 - this.pixelGrid[yPos][xPos][0])));
        g = rect.clr.g;
        r = this.pixelGrid[yPos][xPos][2];
      }
    });

    this.pixelGrid[yPos][xPos] = [b, g, r, 0];

    offset += 4;
    xPos++;
    if (xPos % (this.header.pixelDataRowSize / 4) === 0) {
      xPos = 0;
      yPos++;
    }
  }
  return this;
};

Bitmap.prototype.createRects = function() {
  let n = 5;
  this.rects = [];
  let clr = rand.rRGB();
  for (let i = 0; i < n; i++) {
    let clr = rand.rRGB();
    let x = rand.randRange(0, this.header.width);
    let y = rand.randRange(0, this.header.height);
    let w = rand.randRange(x, this.header.width);
    let h = 50
    this.rects.push(rect(x, y, w, h, clr));
  }
  return this;
}

function rect(x, y, w, h, clr) {
  return { x, y, w, h, clr};
}

Bitmap.prototype.sortPixels = function() {
  console.log('Sorting pixels.');
  for (let y = 0; y < this.header.height; y++) {
    if (y > 0 && y < this.header.height / 2) {
      this.pixelGrid[y] = this.pixelGrid[y].sort(function(a, b) {
        // let v1 = a.reduce((p, c) => p + c, 0);
        // let v2 = b.reduce((p, c) => p + c, 0);
        let v1 = a[2];
        let v2 = b[2];
        // console.log(v1, v2)
        return v1 < v2;
      });
    }
  }
  return this;
};

Bitmap.prototype.writePixelGridToFile = function(filePath) {
  let data = '';
  for (var y = 0; y < this.pixelGrid.length; y++) {
    for (var x = 0; x < this.pixelGrid[y].length; x++) {
      let p = this.pixelGrid[y][x];
      data += `[${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}] `;
    }
    data += '\n';
  }
  fileHandler.writeFile(filePath, data)
};

Bitmap.prototype.applyFromPixelGrid = function() {
  console.log('Apply pixel data to buffer.');
  let xPos = 0;
  let yPos = 0;
  let offset = this.header.startOfPx;
  for (let i = 0; i < this.header.pixelArraySize; i += 4) {
    this.bmpBuf.writeUInt8(this.pixelGrid[yPos][xPos][0], offset);
    this.bmpBuf.writeUInt8(this.pixelGrid[yPos][xPos][1], offset + 1);
    this.bmpBuf.writeUInt8(this.pixelGrid[yPos][xPos][2], offset + 2);
    offset += 4;
    xPos++;
    if ((xPos % (this.header.pixelDataRowSize / 4)) === 0) {
      xPos = 0;
      yPos++;
    }
  }
};

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
      r: rand.rByteDec()
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

module.exports = Bitmap;
