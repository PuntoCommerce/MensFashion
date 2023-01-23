"use strict";
var server = require("server");
var cache = require("*/cartridge/scripts/middleware/cache");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var pageMetaData = require("*/cartridge/scripts/middleware/pageMetaData");

/**
 * @param {string} email - email for password reset
 */
server.get(
    "Confirmation",
    consentTracking.consent,
    cache.applyDefaultCache,
    function (req, res, next) {
        var Site = require("dw/system/Site");
        var PageMgr = require("dw/experience/PageMgr");
        var pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");

        pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

        var page = PageMgr.getPage("accountRegisteredEmail");

        res.render("checkout/confirmation/confirmationOrderEmail");
        next();
    },
    pageMetaData.computedPageMetaData
);

// Aqui va a ir el otro controlador de los status de envio

module.exports = server.exports();