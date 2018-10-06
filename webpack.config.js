const path = require('path');

module.exports = {
  entry: './maze.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './')
  }
};
