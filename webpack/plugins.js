'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlugins = exports.extractText = undefined;

var _webpack = require('webpack');

var _config = require('../config.js');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommonsChunkPlugin = _webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = _webpack.optimize.UglifyJsPlugin;
var OccurenceOrderPlugin = _webpack.optimize.OccurenceOrderPlugin;


var NODE_ENV = process.env.NODE_ENV || 'production';
console.warn('WEBPACK USING NODE_ENV => ' + NODE_ENV);
var getDefinePlugin = function getDefinePlugin(name) {
  return new _webpack.DefinePlugin({ __HOT__: process.env.NODE_ENV === 'hot',
    __BASEURL__: _config.baseUrl,
    'process.env.NODE_ENV': '"' + (NODE_ENV || 'development') + '"'
  });
};

var extractText = exports.extractText = function extractText(loaders, options) {
  return _extractTextWebpackPlugin2.default.extract('style-loader', loaders, options);
};

var getPlugins = exports.getPlugins = function getPlugins(name) {
  var plugins = [getDefinePlugin(name), new OccurenceOrderPlugin()];
  //plugins.push(new ExtractTextPlugin('[name].css', { allChunks: true, disable: false }))
  if (/^win/.test(process.platform)) plugins.push(new _webpack.IgnorePlugin(/dtrace-provider/i));

  if (!_config.IS_DEV) {
    plugins.push(new _webpack.optimize.DedupePlugin());
    var uglifyOptions = { compress: { warnings: false } };
    plugins.push(new UglifyJsPlugin(uglifyOptions));
  }
  return plugins;
};