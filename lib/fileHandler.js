'use srict';

const fs = require('fs');

module.exports = {
  readFile: function(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },
  
  writeFile: function(fileDirName, buf) {
    fs.writeFile(fileDirName, buf, function(err, data) {
      if (err) {throw err;}
      return data;
    });
  }
};
