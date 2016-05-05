'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOutput = getOutput;

var _config = require('../config.js');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPath = function getPath(name) {
  return (0, _config.resolveRoot)('.');
};

var getLibrary = function getLibrary(name) {
  return 'style';
};

var getLibraryTarget = function getLibraryTarget(name) {
  return 'commonjs';
};

var getFilename = function getFilename(name) {
  return '[name].js';
};
var getChunkFilename = function getChunkFilename(name) {
  return '[name].js';
};
var getSourceMapFilename = function getSourceMapFilename(name) {
  return '[file].map';
};
var getDevtoolModuleFilenameTemplate = function getDevtoolModuleFilenameTemplate(name) {
  return 'file:///[absolute-resource-path]';
};
var getHotUpdateChunkFilename = function getHotUpdateChunkFilename(name) {
  return '[id].[hash].hot-update.js';
};
var getHotUpdateMainFilename = function getHotUpdateMainFilename(name) {
  return '[hash].hot-update.json';
};
var getCrossOriginLoading = function getCrossOriginLoading(name) {
  return 'anonymous';
};

var getPublicPath = function getPublicPath(name) {
  return '/';
};

function getOutput(name) {
  var output = { path: getPath(name),
    library: getLibrary(name),
    libraryTarget: getLibraryTarget(name),
    pathinfo: process.env.NODE_ENV === 'hot',
    publicPath: getPublicPath(name),
    filename: getFilename(name),
    chunkFilename: getChunkFilename(name),
    crossOriginLoading: getCrossOriginLoading(name)
    //, devtoolModuleFilenameTemplate: getDevtoolModuleFilenameTemplate(name)
    //, sourceMapFilename: getSourceMapFilename(name)
    //, hotUpdateChunkFilename: getHotUpdateChunkFilename(name)
    //, hotUpdateMainFilename: getHotUpdateMainFilename(name)
  };
  console.warn('OUTPUT', JSON.stringify(output, null, 2));
  return output;
}