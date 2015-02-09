'use strict';

var expect = require('chai').expect;
var fh = require('../lib/fileHandler.js');

var file = fh.readBmp('./test/test.bmp');


describe('file handler tests', function() {
  it('readBmp() should return a buffer', function(){
    expect(Buffer.isBuffer(file)).to.eql(true);
  });
});
