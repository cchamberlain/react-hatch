'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.libFolder = exports.configPath = undefined;
exports.getAlias = getAlias;

var _config = require('../config.js');

var _path = require('path');

var configPath = exports.configPath = (0, _config.resolveRoot)('./config.js');
var libFolder = exports.libFolder = (0, _config.resolveRoot)('./src/lib');

var resolveVendor = function resolveVendor(path) {
  return (0, _path.resolve)(vendorFolder, path);
};

function getAlias(name) {
  return { 'config': configPath
  };
}