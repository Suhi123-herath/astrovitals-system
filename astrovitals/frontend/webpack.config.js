// Pure-JavaScript toolchain (webpack + Babel): no native binaries, so it also runs on locked-down Windows PCs.
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config({ path: '.env.local' });

module.exports = (env, argv) => ({
  entry: './src/main.jsx',
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].[contenthash].js', clean: true, publicPath: '/' },
  resolve: { extensions: ['.js', '.jsx'] },
  module: { rules: [
    { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
    { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  ] },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new webpack.DefinePlugin({ 'process.env.API_URL': JSON.stringify(process.env.API_URL || '') }),
  ],
  devServer: { port: 5173, historyApiFallback: true },
  devtool: argv.mode === 'production' ? false : 'eval-source-map',
  performance: { hints: false },
});
