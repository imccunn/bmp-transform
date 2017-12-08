
const expect = require('chai').expect;
const fh = require('../lib/fileHandler.js');

describe('file handler tests', function() {
  it('readBmp() should return a buffer', function() {
  	fh.readFile('./test/test.bmp')
  		.then(buffer => {
  			expect(Buffer.isBuffer(buffer)).to.eql(true);
  		});
  });
});
