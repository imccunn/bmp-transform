'use strict';

// Testing for bmpObject methods

var expect = require('chai').expect;
var bmp = require('../lib/bmpObject');
var fs = require('fs');



describe('bmp module contructor should read a bitmap buffer and set its header properties', function() {
  
  var bmpBuf = fs.readFileSync('./test/test.bmp');

  var testBmpObj = new bmp.Bitmap(bmpBuf);
  var testBmpObj2 = new bmp.Bitmap(bmpBuf);

  var initialPalette = testBmpObj.palette,
      modifiedPalette = testBmpObj2.palette;

  testBmpObj2.transformPalette();

  it('should have a passed parameter of type Buffer', function() {
    expect(Buffer.isBuffer(bmpBuf)).to.eql(true); 
  });

  it('should have a type of BM', function() {
    expect(testBmpObj.type).to.eql('BM');
  });

  it('should have a palette offset of 54', function() {
    expect(testBmpObj.paletteOffset).to.eql(54);
  });

  it('should modify the palette information', function() {
    expect(initialPalette).to.not.eql(modifiedPalette);
  });

});
