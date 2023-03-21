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



base.copyBillingAddressToBasket = function (address, currentBasket) {
  var billingAddress = currentBasket.billingAddress;

  Transaction.wrap(function () {
    if (!billingAddress) {
      billingAddress = currentBasket.createBillingAddress();
    }

    billingAddress.setFirstName(address.firstName);
    billingAddress.setLastName(address.lastName);
    billingAddress.setAddress1(address.address1);
    billingAddress.setAddress2(address.address2);
    billingAddress.setCity(address.city);
    billingAddress.setPostalCode(address.postalCode);
    billingAddress.setStateCode(address.stateCode);
    billingAddress.setCountryCode(address.countryCode.value);
    billingAddress.setSuite(address.suite);
    billingAddress.setSuffix(address.suffix);
    billingAddress.setPostBox(address.postBox);
    if (!billingAddress.phone) {
      billingAddress.setPhone(address.phone);
    }
  });
}


base.copyShippingAddressToShipment = function (shippingData, shipmentOrNull) {
  var currentBasket = BasketMgr.getCurrentBasket();
  var shipment = shipmentOrNull || currentBasket.defaultShipment;

  var shippingAddress = shipment.shippingAddress;

  Transaction.wrap(function () {
    if (shippingAddress === null) {
      shippingAddress = shipment.createShippingAddress();
    }

    shippingAddress.setFirstName(shippingData.address.firstName);
    shippingAddress.setLastName(shippingData.address.lastName);
    shippingAddress.setAddress1(shippingData.address.address1);
    shippingAddress.setAddress2(shippingData.address.address2);
    shippingAddress.setCity(shippingData.address.city);
    shippingAddress.setPostalCode(shippingData.address.postalCode);
    shippingAddress.setStateCode(shippingData.address.stateCode);
    shippingAddress.setSuite(shippingData.address.numExt); //Suite es para numero exterior
    shippingAddress.setSuffix(shippingData.address.numInt); //Suffix es para numero Interiror
    shippingAddress.setPostBox(shippingData.address.reference); //Post box es para referencias
    var countryCode = shippingData.address.countryCode.value
      ? shippingData.address.countryCode.value
      : shippingData.address.countryCode;
    shippingAddress.setCountryCode(countryCode);
    shippingAddress.setPhone(shippingData.address.phone);

    ShippingHelper.selectShippingMethod(shipment, shippingData.shippingMethod);
  });
}

base.copyCustomerAddressToShipment = function (address, shipmentOrNull) {
  var currentBasket = BasketMgr.getCurrentBasket();
  var shipment = shipmentOrNull || currentBasket.defaultShipment;
  var shippingAddress = shipment.shippingAddress;

  Transaction.wrap(function () {
    if (shippingAddress === null) {
      shippingAddress = shipment.createShippingAddress();
    }

    shippingAddress.setFirstName(address.firstName);
    shippingAddress.setLastName(address.lastName);
    shippingAddress.setAddress1(address.address1);
    shippingAddress.setAddress2(address.address2);
    shippingAddress.setCity(address.city);
    shippingAddress.setPostalCode(address.postalCode);
    shippingAddress.setStateCode(address.stateCode);
    shippingAddress.setSuite(address.numExt);
    shippingAddress.setSuffix(address.numInt);
    shippingAddress.setPostBox(address.reference);
    var countryCode = address.countryCode;
    shippingAddress.setCountryCode(countryCode.value);
    shippingAddress.setPhone(address.phone);
  });
}

base.copyCustomerAddressToBilling = function (address) {
  var currentBasket = BasketMgr.getCurrentBasket();
  var billingAddress = currentBasket.billingAddress;

  Transaction.wrap(function () {
    if (!billingAddress) {
      billingAddress = currentBasket.createBillingAddress();
    }

    billingAddress.setFirstName(address.firstName);
    billingAddress.setLastName(address.lastName);
    billingAddress.setAddress1(address.address1);
    billingAddress.setAddress2(address.address2);
    billingAddress.setCity(address.city);
    billingAddress.setPostalCode(address.postalCode);
    billingAddress.setStateCode(address.stateCode);
    billingAddress.setSuite(address.numExt); 
    billingAddress.setSuffix(address.numInt);
    billingAddress.setPostBox(address.reference);
    var countryCode = address.countryCode;
    billingAddress.setCountryCode(countryCode.value);
    if (!billingAddress.phone) {
      billingAddress.setPhone(address.phone);
    }
  });
}

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
