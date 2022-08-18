'use strict';

/**
 * @namespace AvisoDePrivacidad
 */

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * AvisoDePrivacidad-Show : This endpoint is called when a shopper navigates to the AvisoDePrivacidad page
 * @name Base/AvisoDePrivacidad-Show
 * @function
 * @memberof AvisoDePrivacidad
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get("Show", (req, res, next) => {
    var PageMgr = require("dw/experience/PageMgr");
    var page = PageMgr.getPage('politicas');
    if (page && page.isVisible()) {
        res.page('politicas');
    } else {
        res.render('error/notFound');
    }
    next();
});

server.get('ErrorNotFound', function (req, res, next) {
    res.setStatusCode(404);
    res.render('error/notFound');
    next();
});

module.exports = server.exports();
