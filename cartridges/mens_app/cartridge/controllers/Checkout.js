"use strict";

/**
 * @namespace Checkout
 */

const server = require("server");
server.extend(module.superModule);

server.get("oAuth", (req, res, next) => {
  res.render("checkout/auth");
  next();
});

module.exports = server.exports();
