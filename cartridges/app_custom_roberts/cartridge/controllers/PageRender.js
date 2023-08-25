'use strict';

/**
 * @namespace PDrender
 */

var server = require('server');

/**
 * PDrender-Show : This endpoint is called when a shopper navigates to the PDrender page
 * @name Base/PDrender-Show
 * @function
 * @memberof PDrender
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */

server.get('Show', function (req, res, next) {
    var PageMgr = require('dw/experience/PageMgr');
    var page = PageMgr.getPage(req.querystring.page);
    if (page && page.isVisible()) {
        res.page(req.querystring.page);
    } else {
        res.render('error/notFound');
    }
    next();
});

module.exports = server.exports();
