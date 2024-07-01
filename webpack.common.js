const path = require('path');

module.exports = {
  entry: {
    app: './js/products.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/products.js',
  },
};
