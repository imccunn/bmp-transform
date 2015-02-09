'use strict';

var app = exports = module.exports = {}; // jshint ignore: line

// Random Byte
app.rByteDec = function() {
	return Math.floor(Math.random() * 255);
};

// Return a random number 

app.randRange = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
};
