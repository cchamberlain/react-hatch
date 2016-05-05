'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevTool = getDevTool;

var _config = require('../config.js');

function getDevTool(name) {
  if (process.env.NODE_ENV === 'hot') return '#eval';
}