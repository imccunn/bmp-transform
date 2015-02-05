'use strict';

var fs = require('fs');
var bitmap = fs.readFileSync('img/test.bmp');

function rRGBA() {
  return Math.floor(Math.random() * 254 + 1);
}

var bitmapObject = {};

bitmapObject.type = bitmap.toString('utf-8', 0, 2);
bitmapObject.size = bitmap.readUInt32LE(2);
bitmapObject.startOfPx = bitmap.readUInt32LE(10);
bitmapObject.sizeOfHeader = bitmap.readUInt32LE(14);
bitmapObject.width = bitmap.readUInt32LE(18);
bitmapObject.height = bitmap.readUInt32LE(22);
bitmapObject.bitsPerPx = bitmap.readUInt16LE(28);
bitmapObject.compression = bitmap.readUInt32LE(30);
bitmapObject.imgSize = bitmap.readUInt32LE(34);
bitmapObject.horRes = bitmap.readUInt32LE(38);
bitmapObject.verRes = bitmap.readUInt32LE(42);
bitmapObject.paletteSize = bitmap.readUInt32LE(46);
bitmapObject.palette = [];

var pxStart = bitmapObject.startOfPx,
    offset = 54;

for (var i = 0; i < (pxStart-offset)/4; i++) {
  var iOffset = offset + i;
  bitmapObject.palette[i] = {
    b : bitmap.readUInt8(iOffset),
    g : bitmap.readUInt8(iOffset+1),
    r : bitmap.readUInt8(iOffset+2),
    a : bitmap.readUInt8(iOffset+3)
  };
  
  bitmap.writeUInt8(rRGBA(), iOffset);
  bitmap.writeUInt8(rRGBA(), iOffset+1);
  bitmap.writeUInt8(rRGBA(), iOffset+2);
  bitmap.writeUInt8(1, iOffset+3);  
}

fs.writeFileSync('img/altered.bmp', bitmap);


// console.log(bitmapObject.palette);
console.log(bitmapObject.palette.length);
/*
var rows = [];
var cols = [];

console.log(bitmapObject);

//console.log('arr size: ' + rows.length);
// console.log(rows);
/*
var strArr = rows.toString();
fs.writeFile('arrData.txt', strArr, function(err){
  if (err) throw err;
  console.log('File written.');
});
*/
