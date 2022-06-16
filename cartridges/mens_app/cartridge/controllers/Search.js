"use strict";

const server = require("server");
server.extend(module.superModule);

server.get("Breadcrums", (req, res, next) => {
    var productHelper = require("*/cartridge/scripts/helpers/productHelpers");
    var breadcrumbs = productHelper.getAllBreadcrumbs(
        req.querystring.cgid,
        null,
        []
    );
    res.render("search/breadcrumb", {
        breadcrumbs: breadcrumbs.reverse(),
    });
    next();
});

module.exports = server.exports();
