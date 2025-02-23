const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust this to match your entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv(), // Inject environment variables
  ],
  resolve: {
    fallback: {
      fs: false, // Exclude 'fs'
      path: false, // Exclude 'path'
      crypto: false, // Exclude 'crypto'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};