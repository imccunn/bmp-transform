'use strict';

// Testing for bmpObject methods

var expect = require('chai').expect;
var bmp = require('../lib/bmpObject');
var fs = require('fs');



describe('bmp module contructor should read a bitmap buffer and set its header properties', function() {
  
  before(function(){
    this.bmpBuf = fs.readFileSync('./test/test.bmp');
    this.testBmpObj = new bmp.Bitmap(this.bmpBuf);
    this.testBmpObj2 = new bmp.Bitmap(this.bmpBuf);
    this.initialPalette = this.testBmpObj.palette;
    this.modifiedPalette = this.testBmpObj2.palette;

    this.testBmpObj2.transformPalette();
  });

  it('should have a passed parameter of type Buffer', function() {
    expect(Buffer.isBuffer(this.bmpBuf)).to.eql(true); 
  });

  it('should have a type of BM', function() {
    expect(this.testBmpObj.type).to.eql('BM');
  });

  it('should have a palette offset of 54', function() {
    expect(this.testBmpObj.paletteOffset).to.eql(54);
  });

  it('should modify the palette information', function() {
    expect(this.initialPalette).to.not.eql(this.modifiedPalette);
  });

});
