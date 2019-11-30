const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: ['./cli/index.js'],
  output: {
    filename: 'cli.bundle.js',
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-flow-strip-types',
            ],
          }
        }
      }
    ]
  },
};
