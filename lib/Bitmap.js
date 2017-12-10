
const rand = require('./rand');
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


function clamp(n, min, max) {
  if (n > max) return max;
  else if (n < min) return min;
  else return n;
}
/**
 * Bitmap object reads a bitmap file and reads through the header information and color palette information.
 *
 * @param {Buffer} bitmap The buffer read from a bitmap file.
 */
function Bitmap(bitmap) {
  // console.log('Bitmap: ', bitmap);
  this.bmpBuf = bitmap;
  this.header = {};
  this.header.type = bitmap.toString('utf-8', 0, 2);
  if (this.header.type !== 'BM') {
    console.log('Type of file loaded is not a Bitmap file. Header type read does not match \'BM\'');

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
  // console.log('Loading pixel data.');
  let offset = this.header.startOfPx;
  let pixelFileData = '';
  for (let p = 0; p < this.header.pixelArraySize / 4; p++) {
    let b = this.bmpBuf.readUInt8(offset);
    let g = this.bmpBuf.readUInt8(offset + 1);
    let r = this.bmpBuf.readUInt8(offset + 2);
    let a = this.bmpBuf.readUInt8(offset + 3);
    // console.log(b, g, r, a);
    this.pixelData.push(b);
    this.pixelData.push(g);
    this.pixelData.push(r);
    this.pixelData.push(a);
    offset += 4;
  }
};

Bitmap.prototype.applyPixelData = function() {
  console.log('Applying pixel data.');
  let offset = this.header.startOfPx;
  let xPos = 0;
  let yPos = 0;

  let shift = 300, shiftAmt = 1;

  this.pixelGrid = [];
  this.pixelGrid[yPos] = [];
  for (let p = 0; p < this.header.pixelArraySize; p += 4) {
    // console.log('p: ', p)
    let b, g, r;

    b = this.pixelData[p];
    g = this.pixelData[p + 1];
    r = this.pixelData[p + 2];

    // if (yPos > 6 && yPos < 100) {
    //   let shift = 30;
    //   let offShift = 4 * shift;
    //   b = this.pixelData[p + (4 * shift)];
    //   g = this.pixelData[p + (4 * shift) + 1];
    //   r = this.pixelData[p + (4 * shift) + 2];
    // }

    if (yPos > 142 && yPos < 400) {
      // let offShift = 4 * shift;
      b = this.pixelData[p + (4 * shift)];
      g = this.pixelData[p + (4 * shift) + 1];
      r = this.pixelData[p + (4 * shift) + 2];
    }

    // if (xPos > 100 && xPos < 160 && yPos > 100 && yPos < 199) {
    //   let shift = 2;
    //   b = 30;
    //   g = 20;
    //   r = this.pixelData[p + (4 * shift) + 2];
    // }

    // if (xPos > 100 && xPos < 600 && yPos > 100 && yPos < 700) {
    //   b = 255;
    //   g = this.pixelData[p + 1];
    //   r = this.pixelData[p + 2];
    // }

    // if (xPos > 740 && xPos < 934 && yPos > 100 && yPos < 700) {
    //   b = this.pixelData[p];
    //   g = 78;
    //   r = this.pixelData[p + 2];
    // }

    // if (xPos > 488 && xPos < 980 && yPos > 200 && yPos < 321) {
    //   b = 169;
    //   g = this.pixelData[p + 1];
    //   r = this.pixelData[p + 2];
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

    // if (xPos > 22 && xPos < 55) {
    //   b = rand.rByteDec();
    //   g = rand.rByteDec();
    //   r = rand.rByteDec();
    // }

    // if (xPos > 680 && xPos < 703) {
    //   b = rand.rByteDec();
    //   g = rand.rByteDec();
    //   r = rand.rByteDec();
    // }

    // if (xPos > 740 && xPos < 760) {
    //   b = rand.rByteDec();
    //   g = rand.rByteDec();
    //   r = rand.rByteDec();
    // }

    // if (xPos > 780 && xPos < 790) {
    //   b = 255;
    //   g = 255;
    //   r = 255;
    // }



    // if (xPos > 100 && xPos < 600 && yPos > 100 && yPos < 700) {
    //   b = 255;
    //   g = this.pixelData[p + 1];
    //   r = this.pixelData[p + 2];
    // } else if (xPos > 740 && xPos < 934 && yPos > 100 && yPos < 700) {
    //   b = this.pixelData[p];
    //   g = 78;
    //   r = this.pixelData[p + 2];
    // } else if (xPos > 488 && xPos < 980 && yPos > 200 && yPos < 321) {
    //   b = 169;
    //   g = this.pixelData[p + 1];
    //   r = this.pixelData[p + 2];
    // } else if (xPos > 22 && xPos < 55) {
    //   b = rand.rByteDec();
    //   g = rand.rByteDec();
    //   r = rand.rByteDec();
    // } else if (xPos > 680 && xPos < 703) {
    //   b = rand.rByteDec();
    //   g = rand.rByteDec();
    //   r = rand.rByteDec();
    // } else if (xPos > 740 && xPos < 760) {
    //   b = rand.rByteDec();
    //   g = rand.rByteDec();
    //   r = rand.rByteDec();
    // } else if (xPos > 780 && xPos < 790) {
    //   b = 255;
    //   g = 255;
    //   r = 255;
    // }

    this.pixelGrid[yPos].push([b, g, r, 0]);
    // console.log('row length: ', this.pixelGrid[yPos].length)
    // console.log('x, y: ', xPos, yPos, this.pixelGrid[yPos][xPos]);
    this.pixelData[p] = b;
    this.pixelData[p + 1] = g;
    this.pixelData[p + 2] = r;
    // console.log(`p=${p}, pos=${xPos} ${yPos}, bgr=${b} ${g} ${r}`);
    // this.bmpBuf.writeUInt8(this.pixelData[p], offset);
    // this.bmpBuf.writeUInt8(this.pixelData[p + 1], offset + 1);
    // this.bmpBuf.writeUInt8(this.pixelData[p + 2], offset + 2);

    offset += 4;
    xPos++;
    if (xPos % (this.header.pixelDataRowSize / 4) === 0) {
      xPos = 0;
      yPos++;
      
      // Shift logic
      if (yPos > 142 && yPos < 400) {
        // let rr = rand.randRange(-5, 5);
        // shift -= Math.floor(shiftAmt * rr);
        shift--;
        shift = clamp(shift, 0, 300)
        // console.log('y shift ', shift, yPos);
      }
      
      if (yPos !== this.header.height) {
        this.pixelGrid[yPos] = [];  
      }
    }
  }
  console.log('pixelGrid: ', this.pixelGrid.length, this.pixelGrid[0].length);
};

Bitmap.prototype.sortPixels = function() {
  console.log('Sorting pixels.');
  for (let y = 0; y < this.header.height; y++) {

    if (y > 0 && y < this.header.height) {
      this.pixelGrid[y].sort(function(a, b) {
        // console.log(a, b)
        // let v1 = a.reduce((p, c) => p + c, 0);
        // let v2 = b.reduce((p, c) => p + c, 0);
        let v1 = a[0];
        let v2 = b[0];
        // console.log(v1, v2)
        return v1 < v2;
      });
    }
  }
};

Bitmap.prototype.sort2 = function() {
  for (var x = 0; x < this.header.width; x++) {
      
  }
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
