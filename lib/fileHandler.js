
const fs = require('fs');

module.exports = {

  readFile: function(filePath) {
    console.log(`Reading from file ${filePath}.`);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  writeFile: function(filePath, buf) {
    console.log(`Writing to file ${filePath}.`);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buf, function(err, data) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }
};
