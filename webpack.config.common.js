const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/js/script.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  watch: NODE_ENV === 'development',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.png$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      baseHref: '/',
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.bundle.css'
    })
    /* new CopyPlugin({
      patterns: [
        {
          from: './src/style/style.min.css',
          to: './src/style'
        },
        {
          from: './src/assets',
          to: './src/assets'
        }
      ]
    }) */
  ]
};
