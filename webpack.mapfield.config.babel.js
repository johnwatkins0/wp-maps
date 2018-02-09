const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, 'vendor/htmlburger/carbon-fields');

if (!fs.existsSync(root)) {
  console.error('Could not find Carbon Fields folder.');
  process.exit(1);
}

module.exports = {
  entry: {
    mapsextended: ['./src/js/Fields/mapfield/bootstrap.js'],
    mapposition: ['./src/js/Fields/mapposition/bootstrap.js'],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: { loader: 'file-loader', options: { publicPath: '' } },
      },
    ],
  },

  resolve: {
    modules: [path.resolve(root, 'assets/js'), 'node_modules'],
  },

  plugins: [
    new webpack.DllReferencePlugin({
      sourceType: 'this',
      manifest: require(path.resolve(root, 'assets/dist/carbon.vendor.json')),
    }),

    new webpack.DllReferencePlugin({
      context: root,
      sourceType: 'this',
      manifest: require(path.resolve(root, 'assets/dist/carbon.core.json')),
    }),
  ],
};
