'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.get('Start', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

    pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);
    res.render('/home/homePage');
    next();
}, pageMetaData.computedPageMetaData);

/** Renders the maintenance page when a site has been set to "Maintenance mode" */
server.get('Offline', cache.applyDefaultCache, function (req, res, next) {
    res.render('siteOffline');
    next();
});

module.exports = server.exports();
