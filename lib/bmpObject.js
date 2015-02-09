'use strict';

var app = exports = module.exports = {}; // jshint ignore: line
var rand = require('./rand');
// *********** CONSTANTS **********

// Bitmap Header Offsets
var SIZE = 2,
    PX_START = 10,
    HEADER_SIZE = 14, 
    WIDTH = 18,
    HEIGHT = 22,
    BITS_PER_PX = 28,
    COMPRESSION = 30,
    IMG_SIZE = 34,
    HOR_RES = 38,
    VER_RES = 42,
    PAL_SIZE = 46,
    PALETTE_OFFS = 54;


/**
 * Bitmap object reads a bitmap file and reads through the header information and color palette information.
 * 
 * @param {Buffer} bitmap The buffer read from a bitmap file.
 */
app.Bitmap = function(bitmap) {

	this.bmpBuf = bitmap;
	
	this.type = bitmap.toString('utf-8', 0, 2);
	if (this.type !== 'BM') {
		throw 'Type of file loaded is not a Bitmap file. Header type read does not match \'BM\'';
	}

	this.size = bitmap.readUInt32LE( SIZE );
	this.startOfPx = bitmap.readUInt32LE( PX_START );
	this.sizeOfHeader = bitmap.readUInt32LE( HEADER_SIZE );
	this.width = bitmap.readUInt32LE( WIDTH );
	this.height = bitmap.readUInt32LE( HEIGHT );
	this.bitsPerPx = bitmap.readUInt16LE( BITS_PER_PX );
	this.compression = bitmap.readUInt32LE( COMPRESSION );
	this.imgSize = bitmap.readUInt32LE( IMG_SIZE );
	this.horRes = bitmap.readUInt32LE( HOR_RES );
	this.verRes = bitmap.readUInt32LE( VER_RES );
	this.paletteSize = bitmap.readUInt32LE( PAL_SIZE );
	this.paletteOffset = PALETTE_OFFS;
	this.paletteLength = (this.startOfPx - this.paletteOffset) / 4;
	this.palette = [];

	// Immediately load the palette information on object instantiation
	this.loadPalette();
};

/**
 *     Once the buffer is attained from the file, we can load the palette information to an object. Each palette location can be 
 *     represented by an object {b: 0-255, g: 0-255, b: 0-255, a: 0-255} each key is one byte read linearly.
 * @return {[type]} [description]
 */

app.Bitmap.prototype.loadPalette = function() {

	for (var i = 0; i < this.paletteLength; i++) {
	  var iOffset = this.paletteOffset + i;
	  this.palette[i] = {
	    b : this.bmpBuf.readUInt8(iOffset),
	    g : this.bmpBuf.readUInt8(iOffset+1),
	    r : this.bmpBuf.readUInt8(iOffset+2),
	    a : this.bmpBuf.readUInt8(iOffset+3)
	  };
	}
};

/**
 *     Once the palette information is loaded into the palette property, we can modify the individual palatte objects' values in any way 
 *     before we send it out to a new buffer and write it to disk.
 */

app.Bitmap.prototype.transformPalette = function() { // To add: add passable transform function

	for (var i = 0; i < this.paletteLength; i++) {
		this.palette[i] = {
			b: rand.rByteDec(),
			g: rand.rByteDec(),
			r: rand.rByteDec(),
			a: rand.rByteDec()
		};
	}
};

/**
 *     Takes a buffer in and writes rgba values to the buffer in the order as specified by the bitmap file spec and returns the buffer.
 *     
 * @param  {Buffer} bmpBuf The buffer to be modified.
 * @return {Buffer}        The modified buffer.
 */
app.Bitmap.prototype.applyPaletteToBuffer = function(bmpBuf) {

	for (var i = 0; i < this.paletteLength; i++) {
		var iOffset = this.paletteOffset + i;
		bmpBuf.writeUInt8(this.palette[i].b, iOffset);
		bmpBuf.writeUInt8(this.palette[i].g, iOffset + 1);
		bmpBuf.writeUInt8(this.palette[i].r, iOffset + 2);
		bmpBuf.writeUInt8(this.palette[i].a, iOffset + 3);
	}
	return bmpBuf;
};

