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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Validates and Return the cquotient namespace provided by the commerce cloud platform\r\n * @returns {Object} - einsteinUtils or null\r\n */\r\nfunction getEinsteinUtils() {\r\n    var einsteinUtils = window.CQuotient;\r\n    if (einsteinUtils && (typeof einsteinUtils.getCQUserId === 'function') && (typeof einsteinUtils.getCQCookieId === 'function')) {\r\n        return einsteinUtils;\r\n    }\r\n    return null;\r\n}\r\n\r\n/**\r\n * Renders the einstein response into a given dom element\r\n * @param {jQuery} $parentElement parent element where recommendations will show.\r\n */\r\nfunction showControls($parentElement) {\r\n    var $liTemplate = $parentElement.find('.hidden-indicators-template li');\r\n    var $carouselItems = $parentElement.find('.carousel-item');\r\n\r\n    $carouselItems.each(function (index) {\r\n        var $newIndiator = $liTemplate.clone();\r\n        if (index === 0) {\r\n            $parentElement.find('.pd-carousel-indicators').append($newIndiator);\r\n        } else {\r\n            $newIndiator.removeClass('active');\r\n            $parentElement.find('.pd-carousel-indicators').append($newIndiator);\r\n        }\r\n        $parentElement.find('.pd-carousel-indicators li').last().attr('data-position', index);\r\n        $parentElement.removeClass('hide-indicators');\r\n    });\r\n}\r\n\r\n/**\r\n * fills in the carousel with product tile html objects\r\n * @param {string} einsteinResponse string html for product tiles\r\n * @param {jQuery} $parentElement parent element where recommendations will show.\r\n */\r\nfunction fillDomElement(einsteinResponse, $parentElement) {\r\n    var recommender = $parentElement.data('recommender');\r\n    var recommendedProducts = einsteinResponse[recommender].recs;\r\n    if (recommendedProducts && recommendedProducts.length > 0) {\r\n        var template = $parentElement.data('template');\r\n        var swatches = $parentElement.data('swatches');\r\n        var displayRatings = $parentElement.data('displayratings');\r\n        var components = [];\r\n        components = recommendedProducts.map(function (recommendedProduct) {\r\n            var tiledefinition = {};\r\n            tiledefinition.classxs = $parentElement.data('bsxs');\r\n            tiledefinition.classsm = $parentElement.data('bssm');\r\n            tiledefinition.classmd = $parentElement.data('bsmd');\r\n            tiledefinition.template = template;\r\n            tiledefinition.swatches = swatches;\r\n            tiledefinition.displayratings = displayRatings;\r\n            tiledefinition.model = {\r\n                type: 'product',\r\n                id: recommendedProduct.id\r\n            };\r\n            return tiledefinition;\r\n        });\r\n\r\n        var url = new URL($parentElement.data('product-load-url'));\r\n        url.searchParams.append('components', JSON.stringify(components));\r\n        url.searchParams.append('limit', $parentElement.data('limit'));\r\n        url.searchParams.append('recommender', recommender);\r\n        $.ajax({\r\n            url: url.href,\r\n            type: 'get',\r\n            dataType: 'html',\r\n            success: function (html) {\r\n                $parentElement.find('.carousel-inner').html(html);\r\n                showControls($parentElement);\r\n                $('body').trigger('carousel:setup', {});\r\n            },\r\n            error: function () {\r\n                $parentElement.spinner().stop();\r\n            }\r\n        });\r\n    }\r\n}\r\n\r\n /**\r\n * Processes a recommendation tile, with an already initialized category specific anchors array\r\n * @param {jQuery} $parentElement parent element where recommendations will show.\r\n * @param {Object} einsteinUtils cquotient object\r\n * @param {Array} anchorsArray array of objects representing anchors\r\n */\r\nfunction processRecommendationsTile($parentElement, einsteinUtils, anchorsArray) {\r\n    var recommender = $parentElement.data('recommender');\r\n\r\n    var params = {\r\n        userId: einsteinUtils.getCQUserId(),\r\n        cookieId: einsteinUtils.getCQCookieId(),\r\n        ccver: '1.01'\r\n    };\r\n\r\n    if (anchorsArray) {\r\n        params.anchors = anchorsArray;\r\n    }\r\n\r\n    /**\r\n    * Processes a recommendation responses\r\n    * @param {Object} einsteinResponse cquotient object\r\n    */\r\n    function recommendationsReceived(einsteinResponse) {\r\n        fillDomElement(einsteinResponse, $parentElement);\r\n        $parentElement.spinner().stop();\r\n    }\r\n\r\n    if (einsteinUtils.getRecs) {\r\n        einsteinUtils.getRecs(einsteinUtils.clientId, recommender, params, recommendationsReceived);\r\n    } else {\r\n        einsteinUtils.widgets = einsteinUtils.widgets || []; // eslint-disable-line no-param-reassign\r\n        einsteinUtils.widgets.push({\r\n            recommenderName: recommender,\r\n            parameters: params,\r\n            callback: recommendationsReceived\r\n        });\r\n    }\r\n}\r\n\r\n/**\r\n * Processes a recommendation tile, with an already initialized product specific anchors array\r\n * @param {jQuery} $parentElement parent element where recommendations will show.\r\n * @returns {Array} - containing an anchor object\r\n */\r\nfunction createProductAnchor($parentElement) {\r\n    return [{\r\n        id: $parentElement.data('primaryProductId'),\r\n        sku: $parentElement.data('secondaryProductId'),\r\n        type: $parentElement.data('alternativeGroupType'),\r\n        alt_id: $parentElement.data('alternativeGroupId')\r\n    }];\r\n}\r\n\r\n/**\r\n * Rerieves data attributes from parent element and converts to gretel compatible recommenders array\r\n * @param {jQuery} $parentElement parent element where recommendations will show.\r\n * @returns {Array} - containing an anchor object\r\n */\r\nfunction createCategoryAnchor($parentElement) {\r\n    return [{ id: $parentElement.data('categoryId') }];\r\n}\r\n\r\n/**\r\n * Gets all placeholder elements, which hold einstein recommendations queries the details from the\r\n * einstein engine and feeds them back to the dom element\r\n */\r\nfunction loadRecommendations() {\r\n    var einsteinUtils = getEinsteinUtils();\r\n    if (einsteinUtils) {\r\n        var $recommendationTiles = $('.einstein-carousel');\r\n        $recommendationTiles.each(function () {\r\n            var $parentElement = $(this);\r\n            $parentElement.spinner().start();\r\n            if ($(this).closest('.experience-einstein-einsteinCarouselProduct').length) {\r\n                return processRecommendationsTile($parentElement, einsteinUtils, createProductAnchor($parentElement));\r\n            } else if ($(this).closest('.experience-einstein-einsteinCarouselCategory').length) {\r\n                return processRecommendationsTile($parentElement, einsteinUtils, createCategoryAnchor($parentElement));\r\n            }\r\n            return processRecommendationsTile($parentElement, einsteinUtils);\r\n        });\r\n    }\r\n}\r\n\r\n$(document).ready(function () {\r\n    loadRecommendations();\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/einsteinCarousel.js?");

/***/ })

/******/ });