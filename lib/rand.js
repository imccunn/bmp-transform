
module.exports = {
  rByteDec: function() {
    return Math.floor(Math.random() * 255);
  },

  randRange: function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
};
