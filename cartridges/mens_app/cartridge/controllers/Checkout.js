"use strict";

/**
 * @namespace Checkout
 */

const server = require("server");
server.extend(module.superModule);

const URLUtils = require("dw/web/URLUtils");
const csrfProtection = require("*/cartridge/scripts/middleware/csrf");
const consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

server.get(
  "oAuth",
  consentTracking.consent,
  server.middleware.https,
  csrfProtection.generateToken,
  (req, res, next) => {
    const actionUrl = URLUtils.url("Account-Login", "rurl", 2);
    let rememberMe = false;
    if (req.currentCustomer.credentials) {
      rememberMe = true;
    }

    const isAuth = req.session;

    const profileForm = server.forms.getForm("profile");
    profileForm.clear();

    if (req.session.raw.customer.authenticated) {
      res.redirect(URLUtils.url("Checkout-Begin"));
    } else {
      res.render("checkout/auth", {
        profileForm: profileForm,
        rememberMe: rememberMe,
        actionUrl: actionUrl,
      });
    }
    next();
  }
);

server.append('Begin', function (req, res, next) {
  var viewData = res.getViewData();
  var usingMultiShipping = false;
  viewData.order.usingMultiShipping = usingMultiShipping;
  res.setViewData(viewData);
  next();
});

module.exports = server.exports();
