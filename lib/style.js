exports["style"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(10);

	__webpack_require__(7);

	__webpack_require__(9);

	__webpack_require__(8);

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(1)();
	// imports


	// module
	exports.push([module.id, "#HatchToggle {\n  position: fixed;\n  z-index: 9999999;\n  width: 60px;\n  height: 60px;\n  margin-left: -30px;\n  border-radius: 50%;\n  bottom: 0;\n  font-size: 0.9em;\n  opacity: 0.5;\n  border: 1px solid '#00f';\n}\n.flex-center {\n  -webkit-flex-flow: row;\n      -ms-flex-flow: row;\n          flex-flow: row;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n              -ms-grid-row-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.flex-right {\n  margin-left: auto;\n}\n#Hatch {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  margin: 0;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n#Hatch.animating .hatch-upper,\n#Hatch.animating .hatch-lower {\n  display: block !important;\n}\n#Hatch.open .hatch-upper,\n#Hatch.open .hatch-lower {\n  display: none;\n}\n.hatch-upper {\n  position: fixed;\n  z-index: 9999999;\n  top: -13px;\n  margin-top: 2px;\n  height: 100%;\n}\n.hatch-upper .hatch-animate {\n  -webkit-transform: translateY(0%);\n          transform: translateY(0%);\n}\n.hatch-lower {\n  position: fixed;\n  z-index: 999999;\n  bottom: -13px;\n  margin-bottom: 2px;\n  height: 166px;\n}\n.hatch-lower .hatch-animate {\n  -webkit-transform: translateY(0);\n          transform: translateY(0);\n}\n.hatch-animate {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 auto;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n.hatch-upper,\n.hatch-lower {\n  width: 100%;\n}\n.hatch-upper > span,\n.hatch-lower > span {\n  height: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 auto;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.hatch-upper .hatch-inside,\n.hatch-lower .hatch-empty {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 auto;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n.hatch-upper .hatch-empty,\n.hatch-lower .hatch-inside {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 1 130px;\n      -ms-flex: 0 1 130px;\n          flex: 0 1 130px;\n}\n.hatch-upper .hatch-edge {\n  overflow: visible;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 36px;\n      -ms-flex: 0 0 36px;\n          flex: 0 0 36px;\n  border-bottom: 0 solid transparent;\n  background-repeat: repeat-x;\n  background-clip: content-box;\n  background-origin: content-box;\n  background-size: auto;\n}\n.hatch-lower .hatch-edge {\n  overflow: visible;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 36px;\n      -ms-flex: 0 0 36px;\n          flex: 0 0 36px;\n  border-top: 2px solid transparent;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  background-repeat: repeat-x;\n  background-clip: content-box;\n  background-origin: content-box;\n  background-size: auto;\n}\n.hatch-upper .hatch-latch {\n  bottom: 130px;\n  background-position: center bottom;\n}\n.hatch-upper .hatch-edge {\n  background-position: center bottom;\n}\n.hatch-upper .hatch-inside {\n  background-position: center bottom;\n}\n.hatch-latch {\n  position: fixed;\n  margin-left: 1px;\n  background-repeat: no-repeat;\n  width: 100%;\n}\n.hatch-lower .hatch-latch {\n  top: 0;\n  background-position: center top;\n  margin-top: 2px;\n}\n.hatch-lower .hatch-edge {\n  background-position: center top;\n}\n.hatch-lower .hatch-inside {\n  background-position: center top;\n}\n.hatch-inside > div {\n  min-width: 330px;\n  margin: auto;\n}\n.hatch-inside .hatch-form {\n  padding: 0 0 15px;\n}\n.hatch-inside .hatch-form form {\n  width: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n.hatch-input {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 0 40px;\n      -ms-flex: 1 0 40px;\n          flex: 1 0 40px;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n}\n.hatch-input.right {\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n              -ms-grid-row-align: center;\n          align-items: center;\n}\n.hatch-input input {\n  width: 100%;\n  font-size: 1.3em;\n  margin: auto;\n  border: 2px solid rgba(80, 80, 80, 0.7);\n  border-radius: 4px;\n  background-color: rgba(240, 240, 240, 0.9);\n  padding: 2px 4px;\n}\n.hatch-btn {\n  background-color: '#f00';\n  color: #fff;\n  font-size: 1.3em;\n  padding: 4px 8px;\n  border: 2px solid rgba(80, 80, 80, 0.9);\n  border-radius: 4px;\n}\n.hatch-btn:hover {\n  background-color: '#f00';\n}\n.hatch-upper .hatch-inside {\n  background-repeat: repeat;\n  background-size: auto;\n}\n.hatch-upper .hatch-inside .hatch-content {\n  margin: 5% auto;\n  padding: 20px;\n  text-shadow: 1px 1px 1px #888;\n  box-shadow: inset 1px 1px 10px #000;\n  border: 1px solid rgba(80, 80, 80, 0.9);\n  border-radius: 6px;\n  background-image: -webkit-linear-gradient(right, rgba(90, 90, 90, 0.92), rgba(190, 190, 190, 0.92));\n  background-image: linear-gradient(to left, rgba(90, 90, 90, 0.92), rgba(190, 190, 190, 0.92));\n  background-clip: padding-box;\n}\n.hatch-error {\n  background-color: '#f00';\n  border: 2px solid '#f00';\n  color: #fff;\n  margin: 5px;\n  padding: 5px 15px;\n  border-radius: 5px;\n  z-index: 999999999;\n}\n.hatch-upper-enter {\n  -webkit-transform: translateY(-100%) !important;\n          transform: translateY(-100%) !important;\n}\n.hatch-upper-enter.hatch-upper-enter-active {\n  -webkit-transform: translateY(0%) !important;\n          transform: translateY(0%) !important;\n  -webkit-transition: -webkit-transform 2000ms;\n  transition: -webkit-transform 2000ms;\n  transition: transform 2000ms;\n  transition: transform 2000ms, -webkit-transform 2000ms;\n}\n.hatch-upper-leave {\n  -webkit-transform: translateY(0%) !important;\n          transform: translateY(0%) !important;\n}\n.hatch-upper-leave.hatch-upper-leave-active {\n  -webkit-transform: translateY(-100%) !important;\n          transform: translateY(-100%) !important;\n  -webkit-transition: -webkit-transform 2000ms;\n  transition: -webkit-transform 2000ms;\n  transition: transform 2000ms;\n  transition: transform 2000ms, -webkit-transform 2000ms;\n}\n.hatch-lower-enter {\n  -webkit-transform: translateY(166px) !important;\n          transform: translateY(166px) !important;\n}\n.hatch-lower-enter.hatch-lower-enter-active {\n  -webkit-transform: translateY(0) !important;\n          transform: translateY(0) !important;\n  -webkit-transition: -webkit-transform 2000ms;\n  transition: -webkit-transform 2000ms;\n  transition: transform 2000ms;\n  transition: transform 2000ms, -webkit-transform 2000ms;\n}\n.hatch-lower-leave {\n  -webkit-transform: translateY(0) !important;\n          transform: translateY(0) !important;\n}\n.hatch-lower-leave.hatch-lower-leave-active {\n  -webkit-transform: translateY(166px) !important;\n          transform: translateY(166px) !important;\n  -webkit-transition: -webkit-transform 2000ms;\n  transition: -webkit-transform 2000ms;\n  transition: transform 2000ms;\n  transition: transform 2000ms, -webkit-transform 2000ms;\n}\n", "", {"version":3,"sources":["/./src/lib/style/C:/Users/ColeChamberlain/cchamberlain/react-hatch/src/lib/style/Hatch.less","/./src/lib/style/Hatch.less"],"names":[],"mappings":"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","file":"Hatch.less","sourcesContent":["@blue: '#00f';\n@red: '#f00';\n@animationDuration: 2000ms;\n@meetFromBottom: 130px;\n\n#HatchToggle {\n  position: fixed;\n  z-index: 9999999;\n  width:60px;\n  height:60px;\n  margin-left:-30px;\n  border-radius: 50%;\n  bottom:0;\n  font-size:0.9em;\n  opacity:0.5;\n  border:1px solid @blue;\n}\n\n.flex-center {\n  flex-flow: row;\n  align-items: center;\n  justify-content:center;\n}\n\n.flex-right {\n  margin-left:auto;\n}\n\n#Hatch {\n  display:flex;\n  top: 0;\n  left:0;\n  width:100%;\n  height:100%;\n  text-align:center;\n  justify-content: space-between;\n  margin: 0;\n  flex-direction:column;\n\n  &.animating {\n    .hatch-upper,.hatch-lower {\n      display:block !important;\n    }\n  }\n  &.open {\n    .hatch-upper,.hatch-lower {\n      display:none;\n    }\n  }\n}\n\n.hatch-upper {\n  position: fixed;\n  z-index:9999999;\n  top:-13px;\n  margin-top:2px;\n  height:100%;\n\n  .hatch-animate {\n    transform:translateY(0%);\n  }\n}\n\n.hatch-lower {\n  position: fixed;\n  z-index:999999;\n  bottom:-13px;\n  margin-bottom:2px;\n  height:@meetFromBottom + 36px;\n\n  .hatch-animate {\n    transform:translateY(0);\n  }\n}\n\n.hatch-animate {\n  display:flex;\n  flex-direction:column;\n  flex:1 1 auto;\n}\n\n\n.hatch-upper, .hatch-lower {\n  width:100%;\n  //position:fixed;\n\n  &>span {\n    height:100%;\n    display:flex;\n    flex: 1 1 auto;\n    flex-direction:column;\n  }\n}\n\n.hatch-upper .hatch-inside,.hatch-lower .hatch-empty {\n  display: flex;\n  flex-direction:column;\n  flex: 1 1 auto;\n}\n.hatch-upper .hatch-empty,.hatch-lower .hatch-inside {\n  display: flex;\n  flex-direction: column;\n  flex: 0 1 @meetFromBottom;\n}\n\n.hatch-upper .hatch-edge {\n  overflow:visible;\n  flex: 0 0 36px;\n  border-bottom:0 solid transparent;\n  background-repeat: repeat-x;\n  background-clip:  content-box;\n  background-origin:  content-box;\n  background-size:  auto;\n}\n\n.hatch-lower .hatch-edge {\n  overflow:visible;\n  flex: 0 0 36px;\n  border-top:2px solid transparent;\n  display:flex;\n  flex-direction:row;\n  align-items:center;\n  justify-content:center;\n  background-repeat: repeat-x;\n  background-clip:  content-box;\n  background-origin:  content-box;\n  background-size:  auto;\n}\n\n.hatch-upper {\n  .hatch-latch {\n    bottom:@meetFromBottom;\n    background-position:center bottom;\n  }\n\n  .hatch-edge {\n    background-position: center bottom;\n  }\n\n  .hatch-inside {\n    background-position: center bottom;\n  }\n}\n\n.hatch-latch {\n  position:fixed;\n  margin-left:1px;\n  background-repeat:no-repeat;\n  width:100%;\n}\n\n.hatch-lower {\n  .hatch-latch {\n    top:0;\n    background-position: center top;\n    margin-top:2px;\n  }\n\n  .hatch-edge {\n    background-position: center top;\n  }\n\n  .hatch-inside {\n    background-position: center top;\n  }\n}\n\n.hatch-inside {\n  &>div {\n    min-width:330px;\n    margin:auto;\n  }\n\n  .hatch-form {\n    padding: 0 0 15px;\n    form {\n      width:100%;\n      display:flex;\n      flex-direction:column;\n      justify-content: space-between;\n    }\n  }\n}\n\n.hatch-input {\n  display:flex;\n  flex: 1 0 40px;\n  flex-direction:row;\n  &.right {\n    justify-content:flex-end;\n    align-items:center;\n  }\n  input {\n    width:100%;\n    font-size:1.3em;\n    margin:auto;\n    border: 2px solid rgba(80, 80, 80, 0.7);\n    border-radius:4px;\n    background-color: rgba(240, 240, 240, 0.9);\n    padding: 2px 4px;\n  }\n}\n.hatch-btn {\n  background-color:@red;\n  color:#fff;\n  font-size: 1.3em;\n  padding:4px 8px;\n  border: 2px solid rgba(80, 80, 80, 0.9);\n  border-radius: 4px;\n  //margin-left:auto;\n  &:hover {\n    background-color:@red;\n  }\n}\n\n.hatch-upper {\n  .hatch-inside {\n    background-repeat:repeat;\n    background-size: auto;\n    .hatch-content {\n      margin: 5% auto;\n      padding:20px;\n      text-shadow: 1px 1px 1px #888;\n      box-shadow: inset 1px 1px 10px #000;\n      border:1px solid rgba(80,80,80,0.9);\n      border-radius:6px;\n      background-image: linear-gradient( to left, rgba(90, 90, 90, 0.92), rgba(190,190,190,0.92));\n      background-clip:  padding-box;\n    }\n\n  }\n}\n\n.hatch-error {\n  background-color:@red;\n  border:2px solid @red;\n  color:#fff;\n  margin:5px;\n  padding:5px 15px;\n  border-radius:5px;\n  z-index:999999999;\n}\n\n.hatch-upper-enter {\n  transform: translateY(-100%) !important;\n}\n.hatch-upper-enter.hatch-upper-enter-active {\n  transform: translateY(0%) !important;\n  transition: transform @animationDuration;\n}\n.hatch-upper-leave {\n  transform: translateY(0%) !important;\n}\n.hatch-upper-leave.hatch-upper-leave-active {\n  transform: translateY(-100%) !important;\n  transition: transform @animationDuration;\n}\n\n.hatch-lower-enter {\n  transform: translateY(@meetFromBottom + 36px) !important;\n}\n.hatch-lower-enter.hatch-lower-enter-active {\n  transform: translateY(0) !important;\n  transition: transform @animationDuration;\n}\n.hatch-lower-leave {\n  transform: translateY(0) !important;\n}\n.hatch-lower-leave.hatch-lower-leave-active {\n  transform: translateY(@meetFromBottom + 36px) !important;\n  transition: transform @animationDuration;\n}\n","#HatchToggle {\n  position: fixed;\n  z-index: 9999999;\n  width: 60px;\n  height: 60px;\n  margin-left: -30px;\n  border-radius: 50%;\n  bottom: 0;\n  font-size: 0.9em;\n  opacity: 0.5;\n  border: 1px solid '#00f';\n}\n.flex-center {\n  flex-flow: row;\n  align-items: center;\n  justify-content: center;\n}\n.flex-right {\n  margin-left: auto;\n}\n#Hatch {\n  display: flex;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  justify-content: space-between;\n  margin: 0;\n  flex-direction: column;\n}\n#Hatch.animating .hatch-upper,\n#Hatch.animating .hatch-lower {\n  display: block !important;\n}\n#Hatch.open .hatch-upper,\n#Hatch.open .hatch-lower {\n  display: none;\n}\n.hatch-upper {\n  position: fixed;\n  z-index: 9999999;\n  top: -13px;\n  margin-top: 2px;\n  height: 100%;\n}\n.hatch-upper .hatch-animate {\n  transform: translateY(0%);\n}\n.hatch-lower {\n  position: fixed;\n  z-index: 999999;\n  bottom: -13px;\n  margin-bottom: 2px;\n  height: 166px;\n}\n.hatch-lower .hatch-animate {\n  transform: translateY(0);\n}\n.hatch-animate {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n}\n.hatch-upper,\n.hatch-lower {\n  width: 100%;\n}\n.hatch-upper > span,\n.hatch-lower > span {\n  height: 100%;\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n}\n.hatch-upper .hatch-inside,\n.hatch-lower .hatch-empty {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n}\n.hatch-upper .hatch-empty,\n.hatch-lower .hatch-inside {\n  display: flex;\n  flex-direction: column;\n  flex: 0 1 130px;\n}\n.hatch-upper .hatch-edge {\n  overflow: visible;\n  flex: 0 0 36px;\n  border-bottom: 0 solid transparent;\n  background-repeat: repeat-x;\n  background-clip: content-box;\n  background-origin: content-box;\n  background-size: auto;\n}\n.hatch-lower .hatch-edge {\n  overflow: visible;\n  flex: 0 0 36px;\n  border-top: 2px solid transparent;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  background-repeat: repeat-x;\n  background-clip: content-box;\n  background-origin: content-box;\n  background-size: auto;\n}\n.hatch-upper .hatch-latch {\n  bottom: 130px;\n  background-position: center bottom;\n}\n.hatch-upper .hatch-edge {\n  background-position: center bottom;\n}\n.hatch-upper .hatch-inside {\n  background-position: center bottom;\n}\n.hatch-latch {\n  position: fixed;\n  margin-left: 1px;\n  background-repeat: no-repeat;\n  width: 100%;\n}\n.hatch-lower .hatch-latch {\n  top: 0;\n  background-position: center top;\n  margin-top: 2px;\n}\n.hatch-lower .hatch-edge {\n  background-position: center top;\n}\n.hatch-lower .hatch-inside {\n  background-position: center top;\n}\n.hatch-inside > div {\n  min-width: 330px;\n  margin: auto;\n}\n.hatch-inside .hatch-form {\n  padding: 0 0 15px;\n}\n.hatch-inside .hatch-form form {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.hatch-input {\n  display: flex;\n  flex: 1 0 40px;\n  flex-direction: row;\n}\n.hatch-input.right {\n  justify-content: flex-end;\n  align-items: center;\n}\n.hatch-input input {\n  width: 100%;\n  font-size: 1.3em;\n  margin: auto;\n  border: 2px solid rgba(80, 80, 80, 0.7);\n  border-radius: 4px;\n  background-color: rgba(240, 240, 240, 0.9);\n  padding: 2px 4px;\n}\n.hatch-btn {\n  background-color: '#f00';\n  color: #fff;\n  font-size: 1.3em;\n  padding: 4px 8px;\n  border: 2px solid rgba(80, 80, 80, 0.9);\n  border-radius: 4px;\n}\n.hatch-btn:hover {\n  background-color: '#f00';\n}\n.hatch-upper .hatch-inside {\n  background-repeat: repeat;\n  background-size: auto;\n}\n.hatch-upper .hatch-inside .hatch-content {\n  margin: 5% auto;\n  padding: 20px;\n  text-shadow: 1px 1px 1px #888;\n  box-shadow: inset 1px 1px 10px #000;\n  border: 1px solid rgba(80, 80, 80, 0.9);\n  border-radius: 6px;\n  background-image: linear-gradient(to left, rgba(90, 90, 90, 0.92), rgba(190, 190, 190, 0.92));\n  background-clip: padding-box;\n}\n.hatch-error {\n  background-color: '#f00';\n  border: 2px solid '#f00';\n  color: #fff;\n  margin: 5px;\n  padding: 5px 15px;\n  border-radius: 5px;\n  z-index: 999999999;\n}\n.hatch-upper-enter {\n  transform: translateY(-100%) !important;\n}\n.hatch-upper-enter.hatch-upper-enter-active {\n  transform: translateY(0%) !important;\n  transition: transform 2000ms;\n}\n.hatch-upper-leave {\n  transform: translateY(0%) !important;\n}\n.hatch-upper-leave.hatch-upper-leave-active {\n  transform: translateY(-100%) !important;\n  transition: transform 2000ms;\n}\n.hatch-lower-enter {\n  transform: translateY(166px) !important;\n}\n.hatch-lower-enter.hatch-lower-enter-active {\n  transform: translateY(0) !important;\n  transition: transform 2000ms;\n}\n.hatch-lower-leave {\n  transform: translateY(0) !important;\n}\n.hatch-lower-leave.hatch-lower-leave-active {\n  transform: translateY(166px) !important;\n  transition: transform 2000ms;\n}\n"],"sourceRoot":"webpack://"}]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(1)();
	// imports


	// module
	exports.push([module.id, "\r\n/*==========  Mobile First Method  ==========*/\r\n\r\n/* Custom, iPhone Retina */\r\n\r\n@media only screen and (min-width : 320px) {\r\n\r\n}\r\n\r\n/* Extra Small Devices, Phones */\r\n\r\n@media only screen and (min-width : 480px) {\r\n\r\n}\r\n\r\n/* Small Devices, Tablets */\r\n\r\n@media only screen and (min-width : 768px) {\r\n  .hatch-inside {\r\n  }\r\n  .hatch-inside>div {\r\n\r\n    min-width: 600px;\r\n\r\n    margin: auto\r\n  }\r\n}\r\n\r\n/* Medium Devices, Desktops */\r\n\r\n@media only screen and (min-width : 992px) {\r\n\r\n}\r\n\r\n/* Large Devices, Wide Screens */\r\n\r\n@media only screen and (min-width : 1200px) {\r\n\r\n}\r\n", "", {"version":3,"sources":["/./src/lib/style/Hatch-sr.css"],"names":[],"mappings":";AACA,+CAA+C;;AAE/C,2BAA2B;;AAC3B;;CAEC;;AAED,iCAAiC;;AACjC;;CAEC;;AAED,4BAA4B;;AAC5B;EACE;GAKC;EAJC;;IACE,iBAAgB;;IAChB,YAAY;GACb;CAEJ;;AAED,8BAA8B;;AAC9B;;CAEC;;AAED,iCAAiC;;AACjC;;CAEC","file":"Hatch-sr.css","sourcesContent":["\r\n/*==========  Mobile First Method  ==========*/\r\n\r\n/* Custom, iPhone Retina */\r\n@media only screen and (min-width : 320px) {\r\n\r\n}\r\n\r\n/* Extra Small Devices, Phones */\r\n@media only screen and (min-width : 480px) {\r\n\r\n}\r\n\r\n/* Small Devices, Tablets */\r\n@media only screen and (min-width : 768px) {\r\n  .hatch-inside {\r\n    &>div {\r\n      min-width:600px;\r\n      margin:auto;\r\n    }\r\n  }\r\n}\r\n\r\n/* Medium Devices, Desktops */\r\n@media only screen and (min-width : 992px) {\r\n\r\n}\r\n\r\n/* Large Devices, Wide Screens */\r\n@media only screen and (min-width : 1200px) {\r\n\r\n}\r\n"],"sourceRoot":"webpack://"}]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(1)();
	// imports


	// module
	exports.push([module.id, ".carbon-bg {\r\n  background-image: -webkit-linear-gradient( left, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1));\r\n  background-image: linear-gradient( to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1));\r\n}\r\n.carbon-bg-top {\r\n  background-image: -webkit-linear-gradient(bottom, rgba(136, 136, 136, 1), rgba(80,80,80,0.6)),\r\n                    -webkit-linear-gradient(left, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),;\r\n  background-image: linear-gradient(to top, rgba(136, 136, 136, 1), rgba(80,80,80,0.6)),\r\n                    linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),\r\n}\r\n.carbon-bg-bottom {\r\n  background-image: -webkit-linear-gradient(top, rgba(136, 136, 136, 1), rgba(80,80,80,1)),\r\n                    -webkit-linear-gradient(left, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),;\r\n  background-image: linear-gradient(to bottom, rgba(136, 136, 136, 1), rgba(80,80,80,1)),\r\n                    linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),\r\n}\r\n@-webkit-keyframes fade-in {\r\n  from { opacity: 0; }\r\n  to { opacity: 1; }\r\n}\r\n@keyframes fade-in {\r\n  from { opacity: 0; }\r\n  to { opacity: 1; }\r\n}\r\n@-webkit-keyframes fade-out {\r\n  from { opacity: 1; }\r\n  to { opacity: 0; }\r\n}\r\n@keyframes fade-out {\r\n  from { opacity: 1; }\r\n  to { opacity: 0; }\r\n}\r\n.common-theme {\r\n  .hatch-latch-glow,.hatch-latch-error,.hatch-latch-success,.hatch-latch-loading {\r\n    opacity: 0;\r\n  }\r\n  .hatch-upper {\r\n    .hatch-latch {\r\n      height:115px;\r\n      background-image:url('/img/hatch/hatch-upper-off.png')\r\n    }\r\n    .hatch-latch.hatch-latch-glow {\r\n      background-image: url('/img/hatch/hatch-upper-on.png');\r\n    }\r\n    .hatch-latch.hatch-latch-error {\r\n      background-image: url('/img/hatch/hatch-upper-error.png');\r\n    }\r\n    .hatch-latch.hatch-latch-success {\r\n      background-image: url('/img/hatch/hatch-upper-success.png');\r\n    }\r\n    .hatch-latch.hatch-latch-loading {\r\n      background-image: url('/img/hatch/hatch-upper-loading.png');\r\n    }\r\n  }\r\n  .hatch-lower {\r\n    .hatch-latch {\r\n      height:122px;\r\n      background-image:url('/img/hatch/hatch-lower-off.png')\r\n    }\r\n    .hatch-latch.hatch-latch-glow {\r\n      background-image: url('/img/hatch/hatch-lower-on.png');\r\n    }\r\n    .hatch-latch.hatch-latch-error {\r\n      background-image: url('/img/hatch/hatch-lower-error.png');\r\n    }\r\n    .hatch-latch.hatch-latch-success {\r\n      background-image: url('/img/hatch/hatch-lower-success.png');\r\n    }\r\n    .hatch-latch.hatch-latch-loading {\r\n      background-image: url('/img/hatch/hatch-lower-loading.png');\r\n    }\r\n  }\r\n}\r\n.common-theme:not(.animating) {}\r\n.common-theme:not(.animating).closed {\r\n  .hatch-latch-glow {\r\n    opacity: 1;\r\n    -webkit-animation: fade-in 600ms linear;\r\n            animation: fade-in 600ms linear;\r\n  }\r\n}\r\n.common-theme:not(.animating).closed.error .hatch-latch-error {\r\n  opacity: 1;\r\n  -webkit-animation: fade-in 600ms linear;\r\n          animation: fade-in 600ms linear;\r\n}\r\n.common-theme:not(.animating).closed.error-out .hatch-latch-error {\r\n  opacity: 0;\r\n  -webkit-animation: fade-out 500ms linear;\r\n          animation: fade-out 500ms linear;\r\n}\r\n.common-theme:not(.animating).closed.success .hatch-latch-success {\r\n  opacity: 1;\r\n  -webkit-animation: fade-in 600ms linear;\r\n          animation: fade-in 600ms linear;\r\n}\r\n.common-theme:not(.animating).closed.success-out .hatch-latch-success {\r\n  opacity: 0;\r\n  -webkit-animation: fade-out 500ms linear;\r\n          animation: fade-out 500ms linear;\r\n}\r\n.common-theme:not(.animating).closed.loading .hatch-latch-loading {\r\n  opacity: 1;\r\n  -webkit-animation: fade-in 600ms linear;\r\n          animation: fade-in 600ms linear;\r\n}\r\n.common-theme:not(.animating).closed.loading-out .hatch-latch-loading {\r\n  opacity: 0;\r\n  -webkit-animation: fade-out 500ms linear;\r\n          animation: fade-out 500ms linear;\r\n}\r\n.common-theme.animating {}\r\n.common-theme.animating.closed {\r\n  .hatch-latch-glow {\r\n    /*animation: fade-out 500ms linear;*/\r\n    opacity: 1;\r\n  }\r\n  .hatch-latch-success {\r\n    opacity: 1;\r\n    -webkit-animation: fade-in 500ms linear;\r\n            animation: fade-in 500ms linear;\r\n  }\r\n}\r\n#Hatch {\r\n  /** COMMON THEME */\r\n  .hatch-latch-glow,.hatch-latch-error,.hatch-latch-success,.hatch-latch-loading {\r\n    opacity: 0;\r\n  }\r\n  .hatch-upper {\r\n    .hatch-latch {\r\n      height:115px;\r\n      background-image:url('/img/hatch/hatch-upper-off.png')\r\n    }\r\n    .hatch-latch.hatch-latch-glow {\r\n      background-image: url('/img/hatch/hatch-upper-on.png');\r\n    }\r\n    .hatch-latch.hatch-latch-error {\r\n      background-image: url('/img/hatch/hatch-upper-error.png');\r\n    }\r\n    .hatch-latch.hatch-latch-success {\r\n      background-image: url('/img/hatch/hatch-upper-success.png');\r\n    }\r\n    .hatch-latch.hatch-latch-loading {\r\n      background-image: url('/img/hatch/hatch-upper-loading.png');\r\n    }\r\n  }\r\n  .hatch-lower {\r\n    .hatch-latch {\r\n      height:122px;\r\n      background-image:url('/img/hatch/hatch-lower-off.png')\r\n    }\r\n    .hatch-latch.hatch-latch-glow {\r\n      background-image: url('/img/hatch/hatch-lower-on.png');\r\n    }\r\n    .hatch-latch.hatch-latch-error {\r\n      background-image: url('/img/hatch/hatch-lower-error.png');\r\n    }\r\n    .hatch-latch.hatch-latch-success {\r\n      background-image: url('/img/hatch/hatch-lower-success.png');\r\n    }\r\n    .hatch-latch.hatch-latch-loading {\r\n      background-image: url('/img/hatch/hatch-lower-loading.png');\r\n    }\r\n  }\r\n  /** END COMMON THEME */\r\n\r\n}\r\n#Hatch:not(.animating) {}\r\n#Hatch:not(.animating).closed {\r\n  .hatch-latch-glow {\r\n    opacity: 1;\r\n    -webkit-animation: fade-in 600ms linear;\r\n            animation: fade-in 600ms linear;\r\n  }\r\n}\r\n#Hatch:not(.animating).closed.error .hatch-latch-error {\r\n  opacity: 1;\r\n  -webkit-animation: fade-in 600ms linear;\r\n          animation: fade-in 600ms linear;\r\n}\r\n#Hatch:not(.animating).closed.error-out .hatch-latch-error {\r\n  opacity: 0;\r\n  -webkit-animation: fade-out 500ms linear;\r\n          animation: fade-out 500ms linear;\r\n}\r\n#Hatch:not(.animating).closed.success .hatch-latch-success {\r\n  opacity: 1;\r\n  -webkit-animation: fade-in 600ms linear;\r\n          animation: fade-in 600ms linear;\r\n}\r\n#Hatch:not(.animating).closed.success-out .hatch-latch-success {\r\n  opacity: 0;\r\n  -webkit-animation: fade-out 500ms linear;\r\n          animation: fade-out 500ms linear;\r\n}\r\n#Hatch:not(.animating).closed.loading .hatch-latch-loading {\r\n  opacity: 1;\r\n  -webkit-animation: fade-in 600ms linear;\r\n          animation: fade-in 600ms linear;\r\n}\r\n#Hatch:not(.animating).closed.loading-out .hatch-latch-loading {\r\n  opacity: 0;\r\n  -webkit-animation: fade-out 500ms linear;\r\n          animation: fade-out 500ms linear;\r\n}\r\n#Hatch.animating {}\r\n#Hatch.animating.closed {\r\n  .hatch-latch-glow {\r\n    /*animation: fade-out 500ms linear;*/\r\n    opacity: 1;\r\n  }\r\n  .hatch-latch-success {\r\n    opacity: 1;\r\n    -webkit-animation: fade-in 500ms linear;\r\n            animation: fade-in 500ms linear;\r\n  }\r\n}\r\n#Hatch.hatch-carbon {\r\n  .hatch-upper {\r\n    .hatch-edge {\r\n      background-image: url('/img/patterns/carbon-edge.png');\r\n    }\r\n    .hatch-inside {\r\n      background-image: -webkit-linear-gradient(bottom, rgba(136, 136, 136, 1), rgba(80,80,80,0.6)),\r\n                          -webkit-linear-gradient(left, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),;\r\n      background-image: linear-gradient(to top, rgba(136, 136, 136, 1), rgba(80,80,80,0.6)),\r\n                          linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),;\r\n    }\r\n  }\r\n  .hatch-lower {\r\n    .hatch-edge {\r\n      background-image: url('/img/patterns/carbon-edge-offset.png');\r\n    }\r\n    .hatch-inside {\r\n      background-image: -webkit-linear-gradient(top, rgba(136, 136, 136, 1), rgba(80,80,80,1)),\r\n                          -webkit-linear-gradient(left, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),;\r\n      background-image: linear-gradient(to bottom, rgba(136, 136, 136, 1), rgba(80,80,80,1)),\r\n                          linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),;\r\n    }\r\n  }\r\n}\r\n#Hatch.hatch-shield {\r\n  .hatch-upper {\r\n    .hatch-edge {\r\n      background-image: url('/img/patterns/pattern006-muted-bottom-opaque.png');\r\n    }\r\n    .hatch-inside {\r\n      background-image: url('/img/patterns/pattern006-muted-opaque.png');\r\n    }\r\n  }\r\n  .hatch-lower {\r\n    .hatch-edge {\r\n      background-image: url('/img/patterns/pattern006-muted-top-opaque-offset.png');\r\n    }\r\n    .hatch-inside {\r\n      background-image: url('/img/patterns/pattern006-muted-opaque-offset.png');\r\n    }\r\n  }\r\n}\r\n", "", {"version":3,"sources":["/./src/lib/style/Hatch-themes.css"],"names":[],"mappings":"AAAA;EACE,sHAAkH;EAAlH,kHAAkH;CACnH;AACD;EACE;wHACiH;EADjH;mHACiH;CAClH;AACD;EACE;wHACiH;EADjH;mHACiH;CAClH;AAED;EACE,OAAO,WAAW,EAAE;EACpB,KAAK,WAAW,EAAE;CACnB;AAHD;EACE,OAAO,WAAW,EAAE;EACpB,KAAK,WAAW,EAAE;CACnB;AACD;EACE,OAAO,WAAW,EAAE;EACpB,KAAK,WAAW,EAAE;CACnB;AAHD;EACE,OAAO,WAAW,EAAE;EACpB,KAAK,WAAW,EAAE;CACnB;AAED;EACE;IACE,WAAW;GACZ;EACD;IACE;MACE,aAAa;MACb,sDAAuD;KAcxD;IAZC;MACE,uDAAsD;KACvD;IACD;MACE,0DAAyD;KAC1D;IACD;MACE,4DAA2D;KAC5D;IACD;MACE,4DAA2D;KAC5D;GAEJ;EACD;IACE;MACE,aAAa;MACb,sDAAuD;KAcxD;IAZC;MACE,uDAAsD;KACvD;IACD;MACE,0DAAyD;KAC1D;IACD;MACE,4DAA2D;KAC5D;IACD;MACE,4DAA2D;KAC5D;GAEJ;CA6CF;AA5CC,gCA+BC;AA9BC;EACE;IACE,WAAU;IACV,wCAAgC;YAAhC,gCAAgC;GACjC;CAyBF;AAxBC;EACE,WAAU;EACV,wCAAgC;UAAhC,gCAAgC;CACjC;AACD;EACE,WAAU;EACV,yCAAiC;UAAjC,iCAAiC;CAClC;AACD;EACE,WAAU;EACV,wCAAgC;UAAhC,gCAAgC;CACjC;AACD;EACE,WAAU;EACV,yCAAiC;UAAjC,iCAAiC;CAClC;AACD;EACE,WAAU;EACV,wCAAgC;UAAhC,gCAAgC;CACjC;AACD;EACE,WAAU;EACV,yCAAiC;UAAjC,iCAAiC;CAClC;AAGL,0BAWC;AAVC;EACE;IACE,qCAAqC;IACrC,WAAU;GACX;EACD;IACE,WAAU;IACV,wCAAgC;YAAhC,gCAAgC;GACjC;CACF;AAKL;EACE,mBAAmB;EACnB;IACE,WAAW;GACZ;EACD;IACE;MACE,aAAa;MACb,sDAAuD;KAcxD;IAZC;MACE,uDAAsD;KACvD;IACD;MACE,0DAAyD;KAC1D;IACD;MACE,4DAA2D;KAC5D;IACD;MACE,4DAA2D;KAC5D;GAEJ;EACD;IACE;MACE,aAAa;MACb,sDAAuD;KAcxD;IAZC;MACE,uDAAsD;KACvD;IACD;MACE,0DAAyD;KAC1D;IACD;MACE,4DAA2D;KAC5D;IACD;MACE,4DAA2D;KAC5D;GAEJ;EA6CD,uBAAuB;;CAwCxB;AApFC,yBA+BC;AA9BC;EACE;IACE,WAAU;IACV,wCAAgC;YAAhC,gCAAgC;GACjC;CAyBF;AAxBC;EACE,WAAU;EACV,wCAAgC;UAAhC,gCAAgC;CACjC;AACD;EACE,WAAU;EACV,yCAAiC;UAAjC,iCAAiC;CAClC;AACD;EACE,WAAU;EACV,wCAAgC;UAAhC,gCAAgC;CACjC;AACD;EACE,WAAU;EACV,yCAAiC;UAAjC,iCAAiC;CAClC;AACD;EACE,WAAU;EACV,wCAAgC;UAAhC,gCAAgC;CACjC;AACD;EACE,WAAU;EACV,yCAAiC;UAAjC,iCAAiC;CAClC;AAGL,mBAWC;AAVC;EACE;IACE,qCAAqC;IACrC,WAAU;GACX;EACD;IACE,WAAU;IACV,wCAAgC;YAAhC,gCAAgC;GACjC;CACF;AAGH;EACE;IACE;MACE,uDAAsD;KACvD;IACD;MACE;8HACiH;MADjH;0HACiH;KAClH;GACF;EACD;IACE;MACE,8DAA6D;KAC9D;IACD;MACE;8HACiH;MADjH;0HACiH;KAClH;GACF;CACF;AACD;EACE;IACE;MACE,0EAAyE;KAC1E;IACD;MACE,mEAAmE;KACpE;GACF;EACD;IACE;MACE,8EAA6E;KAC9E;IACD;MACE,0EAA0E;KAC3E;GACF;CACF","file":"Hatch-themes.css","sourcesContent":[".carbon-bg {\r\n  background-image: linear-gradient( to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1));\r\n}\r\n.carbon-bg-top {\r\n  background-image: linear-gradient(to top, rgba(136, 136, 136, 1), rgba(80,80,80,0.6)),\r\n                    linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),\r\n}\r\n.carbon-bg-bottom {\r\n  background-image: linear-gradient(to bottom, rgba(136, 136, 136, 1), rgba(80,80,80,1)),\r\n                    linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),\r\n}\r\n\r\n@keyframes fade-in {\r\n  from { opacity: 0; }\r\n  to { opacity: 1; }\r\n}\r\n@keyframes fade-out {\r\n  from { opacity: 1; }\r\n  to { opacity: 0; }\r\n}\r\n\r\n.common-theme {\r\n  .hatch-latch-glow,.hatch-latch-error,.hatch-latch-success,.hatch-latch-loading {\r\n    opacity: 0;\r\n  }\r\n  .hatch-upper {\r\n    .hatch-latch {\r\n      height:115px;\r\n      background-image:url('/img/hatch/hatch-upper-off.png');\r\n\r\n      &.hatch-latch-glow {\r\n        background-image:url('/img/hatch/hatch-upper-on.png');\r\n      }\r\n      &.hatch-latch-error {\r\n        background-image:url('/img/hatch/hatch-upper-error.png');\r\n      }\r\n      &.hatch-latch-success {\r\n        background-image:url('/img/hatch/hatch-upper-success.png');\r\n      }\r\n      &.hatch-latch-loading {\r\n        background-image:url('/img/hatch/hatch-upper-loading.png');\r\n      }\r\n    }\r\n  }\r\n  .hatch-lower {\r\n    .hatch-latch {\r\n      height:122px;\r\n      background-image:url('/img/hatch/hatch-lower-off.png');\r\n\r\n      &.hatch-latch-glow {\r\n        background-image:url('/img/hatch/hatch-lower-on.png');\r\n      }\r\n      &.hatch-latch-error {\r\n        background-image:url('/img/hatch/hatch-lower-error.png');\r\n      }\r\n      &.hatch-latch-success {\r\n        background-image:url('/img/hatch/hatch-lower-success.png');\r\n      }\r\n      &.hatch-latch-loading {\r\n        background-image:url('/img/hatch/hatch-lower-loading.png');\r\n      }\r\n    }\r\n  }\r\n  &:not(.animating) {\r\n    &.closed {\r\n      .hatch-latch-glow {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.error .hatch-latch-error {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.error-out .hatch-latch-error {\r\n        opacity:0;\r\n        animation: fade-out 500ms linear;\r\n      }\r\n      &.success .hatch-latch-success {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.success-out .hatch-latch-success {\r\n        opacity:0;\r\n        animation: fade-out 500ms linear;\r\n      }\r\n      &.loading .hatch-latch-loading {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.loading-out .hatch-latch-loading {\r\n        opacity:0;\r\n        animation: fade-out 500ms linear;\r\n      }\r\n    }\r\n  }\r\n  &.animating {\r\n    &.closed {\r\n      .hatch-latch-glow {\r\n        /*animation: fade-out 500ms linear;*/\r\n        opacity:1;\r\n      }\r\n      .hatch-latch-success {\r\n        opacity:1;\r\n        animation: fade-in 500ms linear;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n\r\n#Hatch {\r\n  /** COMMON THEME */\r\n  .hatch-latch-glow,.hatch-latch-error,.hatch-latch-success,.hatch-latch-loading {\r\n    opacity: 0;\r\n  }\r\n  .hatch-upper {\r\n    .hatch-latch {\r\n      height:115px;\r\n      background-image:url('/img/hatch/hatch-upper-off.png');\r\n\r\n      &.hatch-latch-glow {\r\n        background-image:url('/img/hatch/hatch-upper-on.png');\r\n      }\r\n      &.hatch-latch-error {\r\n        background-image:url('/img/hatch/hatch-upper-error.png');\r\n      }\r\n      &.hatch-latch-success {\r\n        background-image:url('/img/hatch/hatch-upper-success.png');\r\n      }\r\n      &.hatch-latch-loading {\r\n        background-image:url('/img/hatch/hatch-upper-loading.png');\r\n      }\r\n    }\r\n  }\r\n  .hatch-lower {\r\n    .hatch-latch {\r\n      height:122px;\r\n      background-image:url('/img/hatch/hatch-lower-off.png');\r\n\r\n      &.hatch-latch-glow {\r\n        background-image:url('/img/hatch/hatch-lower-on.png');\r\n      }\r\n      &.hatch-latch-error {\r\n        background-image:url('/img/hatch/hatch-lower-error.png');\r\n      }\r\n      &.hatch-latch-success {\r\n        background-image:url('/img/hatch/hatch-lower-success.png');\r\n      }\r\n      &.hatch-latch-loading {\r\n        background-image:url('/img/hatch/hatch-lower-loading.png');\r\n      }\r\n    }\r\n  }\r\n  &:not(.animating) {\r\n    &.closed {\r\n      .hatch-latch-glow {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.error .hatch-latch-error {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.error-out .hatch-latch-error {\r\n        opacity:0;\r\n        animation: fade-out 500ms linear;\r\n      }\r\n      &.success .hatch-latch-success {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.success-out .hatch-latch-success {\r\n        opacity:0;\r\n        animation: fade-out 500ms linear;\r\n      }\r\n      &.loading .hatch-latch-loading {\r\n        opacity:1;\r\n        animation: fade-in 600ms linear;\r\n      }\r\n      &.loading-out .hatch-latch-loading {\r\n        opacity:0;\r\n        animation: fade-out 500ms linear;\r\n      }\r\n    }\r\n  }\r\n  &.animating {\r\n    &.closed {\r\n      .hatch-latch-glow {\r\n        /*animation: fade-out 500ms linear;*/\r\n        opacity:1;\r\n      }\r\n      .hatch-latch-success {\r\n        opacity:1;\r\n        animation: fade-in 500ms linear;\r\n      }\r\n    }\r\n  }\r\n  /** END COMMON THEME */\r\n  &.hatch-carbon {\r\n    .hatch-upper {\r\n      .hatch-edge {\r\n        background-image:url('/img/patterns/carbon-edge.png');\r\n      }\r\n      .hatch-inside {\r\n        background-image: linear-gradient(to top, rgba(136, 136, 136, 1), rgba(80,80,80,0.6)),\r\n                          linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),\r\n      }\r\n    }\r\n    .hatch-lower {\r\n      .hatch-edge {\r\n        background-image:url('/img/patterns/carbon-edge-offset.png');\r\n      }\r\n      .hatch-inside {\r\n        background-image: linear-gradient(to bottom, rgba(136, 136, 136, 1), rgba(80,80,80,1)),\r\n                          linear-gradient(to right, rgba(120, 120, 120, 1), rgba(140,140,140,1), rgba(120, 120, 120, 1)),\r\n      }\r\n    }\r\n  }\r\n  &.hatch-shield {\r\n    .hatch-upper {\r\n      .hatch-edge {\r\n        background-image:url('/img/patterns/pattern006-muted-bottom-opaque.png');\r\n      }\r\n      .hatch-inside {\r\n        background-image: url('/img/patterns/pattern006-muted-opaque.png');\r\n      }\r\n    }\r\n    .hatch-lower {\r\n      .hatch-edge {\r\n        background-image:url('/img/patterns/pattern006-muted-top-opaque-offset.png');\r\n      }\r\n      .hatch-inside {\r\n        background-image: url('/img/patterns/pattern006-muted-opaque-offset.png');\r\n      }\r\n    }\r\n  }\r\n\r\n}\r\n"],"sourceRoot":"webpack://"}]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(1)();
	// imports


	// module
	exports.push([module.id, ".hatch-inside {\r\n  padding:10px;\r\n  background-repeat:repeat;\r\n  background-size: auto;\r\n  background-origin: border-box;\r\n  background-clip: border-box;\r\n  -webkit-box-pack: center;\r\n  -webkit-justify-content: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n  -webkit-align-items: center;\r\n      -ms-flex-align: center;\r\n              -ms-grid-row-align: center;\r\n          align-items: center;\r\n}\r\n\r\n.hatch-inside p {\r\n  font-size:1.2em;\r\n}\r\n", "", {"version":3,"sources":["/./src/lib/style/Hatch.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,yBAAyB;EACzB,sBAAsB;EACtB,8BAA8B;EAC9B,4BAA4B;EAC5B,yBAAwB;EAAxB,gCAAwB;MAAxB,sBAAwB;UAAxB,wBAAwB;EACxB,0BAAoB;EAApB,4BAAoB;MAApB,uBAAoB;cAApB,2BAAoB;UAApB,oBAAoB;CACrB;;AAED;EACE,gBAAgB;CACjB","file":"Hatch.css","sourcesContent":[".hatch-inside {\r\n  padding:10px;\r\n  background-repeat:repeat;\r\n  background-size: auto;\r\n  background-origin: border-box;\r\n  background-clip: border-box;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n\r\n.hatch-inside p {\r\n  font-size:1.2em;\r\n}\r\n"],"sourceRoot":"webpack://"}]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(2)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/less-loader/index.js?sourceMap!./Hatch.less", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./../../../node_modules/less-loader/index.js?sourceMap!./Hatch.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(2)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./Hatch-sr.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./Hatch-sr.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(2)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./Hatch-themes.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./Hatch-themes.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(2)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./Hatch.css", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js?sourceMap!./../../../node_modules/postcss-loader/index.js!./Hatch.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }
/******/ ]);