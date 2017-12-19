
module.exports = {
  rByteDec: function() {
    return Math.floor(Math.random() * 255);
  },

  randRange: function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },

  rRGB: function() {
    return {
      b: this.rByteDec(),
      g: this.rByteDec(),
      r: this.rByteDec()
    }
  },

  clamp: function clamp(n, min, max) {
    if (n > max) return max;
    else if (n < min) return min;
    else return n;
  }
};
