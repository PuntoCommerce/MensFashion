"use strict";

var server = require("server");
const base = module.superModule;

var collections = require("*/cartridge/scripts/util/collections");

var BasketMgr = require("dw/order/BasketMgr");
var HookMgr = require("dw/system/HookMgr");
var OrderMgr = require("dw/order/OrderMgr");
var PaymentInstrument = require("dw/order/PaymentInstrument");
var PaymentMgr = require("dw/order/PaymentMgr");
var Order = require("dw/order/Order");
var Status = require("dw/system/Status");
var Resource = require("dw/web/Resource");
var Site = require("dw/system/Site");
var Transaction = require("dw/system/Transaction");

var AddressModel = require("*/cartridge/models/address");
var formErrors = require("*/cartridge/scripts/formErrors");

var renderTemplateHelper = require("*/cartridge/scripts/renderTemplateHelper");
var ShippingHelper = require("*/cartridge/scripts/checkout/shippingHelpers");

var basketCalculationHelpers = require("*/cartridge/scripts/helpers/basketCalculationHelpers");


/**
 * Sends a confirmation to the current user
 * @param {dw.order.Order} order - The current user's order
 * @param {string} locale - the current request's locale id
 * @returns {void}
 */
base.sendConfirmationEmail = function (order, locale) {
  var OrderModel = require("*/cartridge/models/order");
  var emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");
  var Locale = require("dw/util/Locale");

  var currentLocale = Locale.getLocale(locale);

  var orderModel = new OrderModel(order, {
    countryCode: currentLocale.country,
    containerView: "order",
  });

  var orderObject = { order: orderModel };

  var emailObj = {
    to: order.customerEmail,
    subject: Resource.msg("subject.order.confirmation.email", "order", null),
    from:
      Site.current.getCustomPreferenceValue("customerServiceEmail") ||
      "no-reply@testorganization.com",
    type: emailHelpers.emailTypes.orderConfirmation,
  };

  emailHelpers.sendEmail(
    emailObj,
    "checkout/confirmation/confirmationOrderEmail",
    orderObject
  );
}


module.exports = base;
