/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/contactUs.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/contactUs.js":
/*!*********************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/contactUs.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar processInclude = __webpack_require__(/*! ./util */ \"./cartridges/app_storefront_base/cartridge/client/default/js/util.js\");\r\n\r\n$(document).ready(function () {\r\n    processInclude(__webpack_require__(/*! ./contactUs/contactUs */ \"./cartridges/app_storefront_base/cartridge/client/default/js/contactUs/contactUs.js\"));\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/contactUs.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/contactUs/contactUs.js":
/*!*******************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/contactUs/contactUs.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Display the returned message.\r\n * @param {string} data - data returned from the server's ajax call\r\n * @param {Object} button - button that was clicked for contact us sign-up\r\n */\r\nfunction displayMessage(data, button) {\r\n    $.spinner().stop();\r\n    var status;\r\n    if (data.success) {\r\n        status = 'alert-success';\r\n    } else {\r\n        status = 'alert-danger';\r\n    }\r\n\r\n    if ($('.contact-us-signup-message').length === 0) {\r\n        $('body').append(\r\n            '<div class=\"contact-us-signup-message\"></div>'\r\n        );\r\n    }\r\n    $('.contact-us-signup-message')\r\n        .append('<div class=\"contact-us-signup-alert text-center ' + status + '\" role=\"alert\">' + data.msg + '</div>');\r\n\r\n    setTimeout(function () {\r\n        $('.contact-us-signup-message').remove();\r\n        button.removeAttr('disabled');\r\n    }, 3000);\r\n}\r\n\r\nmodule.exports = {\r\n    subscribeContact: function () {\r\n        $('form.contact-us').submit(function (e) {\r\n            e.preventDefault();\r\n            var form = $(this);\r\n            var button = $('.subscribe-contact-us');\r\n            var url = form.attr('action');\r\n\r\n            $.spinner().start();\r\n            button.attr('disabled', true);\r\n            $.ajax({\r\n                url: url,\r\n                type: 'post',\r\n                dataType: 'json',\r\n                data: form.serialize(),\r\n                success: function (data) {\r\n                    displayMessage(data, button);\r\n                    if (data.success) {\r\n                        $('.contact-us').trigger('reset');\r\n                    }\r\n                },\r\n                error: function (err) {\r\n                    displayMessage(err, button);\r\n                }\r\n            });\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/contactUs/contactUs.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js":
/*!****************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/util.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nmodule.exports = function (include) {\r\n    if (typeof include === 'function') {\r\n        include();\r\n    } else if (typeof include === 'object') {\r\n        Object.keys(include).forEach(function (key) {\r\n            if (typeof include[key] === 'function') {\r\n                include[key]();\r\n            }\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/util.js?");

/***/ })

/******/ });