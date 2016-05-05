'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJsxLoader = exports.getStyleLoaders = undefined;
exports.getLoaders = getLoaders;
exports.getPostLoaders = getPostLoaders;

var _config = require('../config.js');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//import { extractText } from './plugins'

var getImageLoader = function getImageLoader() {
  return 'url-loader?limit=8192';
};

function getLoaders(name) {
  return [getJsxLoader(name)].concat(_toConsumableArray(getStyleLoaders(name)), [{ test: /\.png$/,
    loader: 'url?mimetype=image/png&limit=100000&name=[name].[ext]'
  }, { test: /\.(gif|png|jpe?g|svg)$/i,
    loader: getImageLoader()
  }, { test: /\.(otf|eot|woff|woff2|ttf|svg)(\?\S*)?$/i,
    loader: 'url?limit=100000&name=[name].[ext]'
  }]);
}

function getPostLoaders(name) {
  return [];
}

var inlineStyleLoader = function inlineStyleLoader(preLoaders) {
  return 'style!' + preLoaders;
};

var getStyleLoaders = exports.getStyleLoaders = function getStyleLoaders(name) {
  var useExtract = process.env.NODE_ENV !== 'hot';
  var cssLoader = 'css' + (useExtract ? '?sourceMap' : '') + '!postcss';
  var lessLoader = cssLoader + '!less' + (useExtract ? '?sourceMap' : '');
  return [{ test: /\.css$/, loader: /* useExtract ? extractText(cssLoader) : */inlineStyleLoader(cssLoader) }, { test: /\.less$/, loader: /* useExtract ? extractText(lessLoader) : */inlineStyleLoader(lessLoader) }];
};

var getJsxLoader = exports.getJsxLoader = function getJsxLoader(name) {
  return { test: /\.jsx?$/,
    loaders: ['babel'],
    exclude: [/node_modules/]
  };
};