const path = require('path');

module.exports = {
  entry: ['./frontend/src/index.js'],
  output: {
    path: path.join(__dirname, 'frontend/static/frontend'),
    publicPath: '/frontend/static/frontend/',
    filename: 'main.js',
  },
  resolve: {
    enforceModuleExtension: false,
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        // include: __dirname + '/src',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};