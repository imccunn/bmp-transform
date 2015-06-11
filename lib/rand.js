'use strict';

module.exports = {

  // Random Byte
  rByteDec: function() {
    return Math.floor(Math.random() * 255);
  },

  // Return a random number
  randRange: function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

};
