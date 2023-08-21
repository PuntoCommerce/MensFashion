"use strict";

/**
 * @namespace Checkout
 */

const server = require("server");
server.extend(module.superModule);

const URLUtils = require("dw/web/URLUtils");
var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
const csrfProtection = require("*/cartridge/scripts/middleware/csrf");
const consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

const _require = require("*/cartridge/controllers/middlewares/index");

const { checkout } = _require;

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

//mp custom checkout controller
server.get(
  'MpBegin',
  server.middleware.https,
  consentTracking.consent,
  csrfProtection.generateToken,
  function (req, res, next) {
      var BasketMgr = require('dw/order/BasketMgr');
      var Transaction = require('dw/system/Transaction');
      var AccountModel = require('*/cartridge/models/account');
      var OrderModel = require('*/cartridge/models/order');
      var URLUtils = require('dw/web/URLUtils');
      var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
      var Locale = require('dw/util/Locale');
      var collections = require('*/cartridge/scripts/util/collections');
      var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

      var currentBasket = BasketMgr.getCurrentBasket();
      if (!currentBasket) {
          res.redirect(URLUtils.url('Cart-Show'));
          return next();
      }

      var validatedProducts = validationHelpers.validateProducts(currentBasket);
      if (validatedProducts.error) {
          res.redirect(URLUtils.url('Cart-Show'));
          return next();
      }

      var requestStage = req.querystring.stage;
      var currentStage = requestStage || 'customer';
      var billingAddress = currentBasket.billingAddress;

      var currentCustomer = req.currentCustomer.raw;
      var currentLocale = Locale.getLocale(req.locale.id);
      var preferredAddress;

      // only true if customer is registered
      if (req.currentCustomer.addressBook && req.currentCustomer.addressBook.preferredAddress) {
          var shipments = currentBasket.shipments;
          preferredAddress = req.currentCustomer.addressBook.preferredAddress;

          collections.forEach(shipments, function (shipment) {
              if (!shipment.shippingAddress) {
                  COHelpers.copyCustomerAddressToShipment(preferredAddress, shipment);
              }
          });

          if (!billingAddress) {
              COHelpers.copyCustomerAddressToBilling(preferredAddress);
          }
      }

      // Calculate the basket
      Transaction.wrap(function () {
          COHelpers.ensureNoEmptyShipments(req);
      });

      if (currentBasket.shipments.length <= 1) {
          req.session.privacyCache.set('usingMultiShipping', false);
      }

      if (currentBasket.currencyCode !== req.session.currency.currencyCode) {
          Transaction.wrap(function () {
              currentBasket.updateCurrency();
          });
      }

      COHelpers.recalculateBasket(currentBasket);

      var guestCustomerForm = COHelpers.prepareCustomerForm('coCustomer');
      var registeredCustomerForm = COHelpers.prepareCustomerForm('coRegisteredCustomer');
      var shippingForm = COHelpers.prepareShippingForm();
      var billingForm = COHelpers.prepareBillingForm();
      var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');

      if (preferredAddress) {
          shippingForm.copyFrom(preferredAddress);
          billingForm.copyFrom(preferredAddress);
      }

      // Loop through all shipments and make sure all are valid
      var allValid = COHelpers.ensureValidShipments(currentBasket);

      var orderModel = new OrderModel(
          currentBasket,
          {
              customer: currentCustomer,
              usingMultiShipping: usingMultiShipping,
              shippable: allValid,
              countryCode: currentLocale.country,
              containerView: 'basket'
          }
      );

      // Get rid of this from top-level ... should be part of OrderModel???
      var currentYear = new Date().getFullYear();
      var creditCardExpirationYears = [];

      for (var j = 0; j < 10; j++) {
          creditCardExpirationYears.push(currentYear + j);
      }

      var accountModel = new AccountModel(req.currentCustomer);

      var reportingURLs;
      reportingURLs = reportingUrlsHelper.getCheckoutReportingURLs(
          currentBasket.UUID,
          2,
          'Shipping'
      );

      if (currentStage === 'customer') {
          if (accountModel.registeredUser) {
              // Since the shopper already login upon starting checkout, fast forward to shipping stage
              currentStage = 'shipping';

              // Only need to update email address in basket if start checkout from other page like cart or mini-cart
              // and not on checkout page reload.
              if (!requestStage) {
                  Transaction.wrap(function () {
                      currentBasket.customerEmail = accountModel.profile.email;
                      orderModel.orderEmail = accountModel.profile.email;
                  });
              }
          } else if (currentBasket.customerEmail) {
              // Email address has already collected so fast forward to shipping stage
              currentStage = 'shipping';
          }
      }

      res.render('checkout/mpCheckout', {
          order: orderModel,
          customer: accountModel,
          forms: {
              guestCustomerForm: guestCustomerForm,
              registeredCustomerForm: registeredCustomerForm,
              shippingForm: shippingForm,
              billingForm: billingForm
          },
          expirationYears: creditCardExpirationYears,
          currentStage: currentStage,
          reportingURLs: reportingURLs,
          oAuthReentryEndpoint: 2
      });

      return next();
  }
);

server.append("MpBegin", server.middleware.https, checkout.begin);

//CFE custom checkout controller
server.get(
    'CFEBegin',
    server.middleware.https,
    consentTracking.consent,
    csrfProtection.generateToken,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var Transaction = require('dw/system/Transaction');
        var AccountModel = require('*/cartridge/models/account');
        var OrderModel = require('*/cartridge/models/order');
        var URLUtils = require('dw/web/URLUtils');
        var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
        var Locale = require('dw/util/Locale');
        var collections = require('*/cartridge/scripts/util/collections');
        var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');
  
        var currentBasket = BasketMgr.getCurrentBasket();
        if (!currentBasket) {
            res.redirect(URLUtils.url('Cart-Show'));
            return next();
        }
  
        var validatedProducts = validationHelpers.validateProducts(currentBasket);
        if (validatedProducts.error) {
            res.redirect(URLUtils.url('Cart-Show'));
            return next();
        }
  
        var requestStage = req.querystring.stage;
        var currentStage = requestStage || 'customer';
        var billingAddress = currentBasket.billingAddress;
  
        var currentCustomer = req.currentCustomer.raw;
        var currentLocale = Locale.getLocale(req.locale.id);
        var preferredAddress;
  
        // only true if customer is registered
        if (req.currentCustomer.addressBook && req.currentCustomer.addressBook.preferredAddress) {
            var shipments = currentBasket.shipments;
            preferredAddress = req.currentCustomer.addressBook.preferredAddress;
  
            collections.forEach(shipments, function (shipment) {
                if (!shipment.shippingAddress) {
                    COHelpers.copyCustomerAddressToShipment(preferredAddress, shipment);
                }
            });
  
            if (!billingAddress) {
                COHelpers.copyCustomerAddressToBilling(preferredAddress);
            }
        }
  
        // Calculate the basket
        Transaction.wrap(function () {
            COHelpers.ensureNoEmptyShipments(req);
        });
  
        if (currentBasket.shipments.length <= 1) {
            req.session.privacyCache.set('usingMultiShipping', false);
        }
  
        if (currentBasket.currencyCode !== req.session.currency.currencyCode) {
            Transaction.wrap(function () {
                currentBasket.updateCurrency();
            });
        }
  
        COHelpers.recalculateBasket(currentBasket);
  
        var guestCustomerForm = COHelpers.prepareCustomerForm('coCustomer');
        var registeredCustomerForm = COHelpers.prepareCustomerForm('coRegisteredCustomer');
        var shippingForm = COHelpers.prepareShippingForm();
        var billingForm = COHelpers.prepareBillingForm();
        var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
  
        if (preferredAddress) {
            shippingForm.copyFrom(preferredAddress);
            billingForm.copyFrom(preferredAddress);
        }
  
        // Loop through all shipments and make sure all are valid
        var allValid = COHelpers.ensureValidShipments(currentBasket);
  
        var orderModel = new OrderModel(
            currentBasket,
            {
                customer: currentCustomer,
                usingMultiShipping: usingMultiShipping,
                shippable: allValid,
                countryCode: currentLocale.country,
                containerView: 'basket'
            }
        );
  
        // Get rid of this from top-level ... should be part of OrderModel???
        var currentYear = new Date().getFullYear();
        var creditCardExpirationYears = [];
  
        for (var j = 0; j < 10; j++) {
            creditCardExpirationYears.push(currentYear + j);
        }
  
        var accountModel = new AccountModel(req.currentCustomer);
  
        var reportingURLs;
        reportingURLs = reportingUrlsHelper.getCheckoutReportingURLs(
            currentBasket.UUID,
            2,
            'Shipping'
        );
  
        if (currentStage === 'customer') {
            if (accountModel.registeredUser) {
                // Since the shopper already login upon starting checkout, fast forward to shipping stage
                currentStage = 'shipping';
  
                // Only need to update email address in basket if start checkout from other page like cart or mini-cart
                // and not on checkout page reload.
                if (!requestStage) {
                    Transaction.wrap(function () {
                        currentBasket.customerEmail = accountModel.profile.email;
                        orderModel.orderEmail = accountModel.profile.email;
                    });
                }
            } else if (currentBasket.customerEmail) {
                // Email address has already collected so fast forward to shipping stage
                currentStage = 'shipping';
            }
        }
  
        res.render('checkout/cfeCheckout', {
            order: orderModel,
            customer: accountModel,
            forms: {
                guestCustomerForm: guestCustomerForm,
                registeredCustomerForm: registeredCustomerForm,
                shippingForm: shippingForm,
                billingForm: billingForm
            },
            expirationYears: creditCardExpirationYears,
            currentStage: currentStage,
            reportingURLs: reportingURLs,
            oAuthReentryEndpoint: 2
        });
  
        return next();
    }
  );
  server.append("CFEBegin", server.middleware.https, checkout.begin);

module.exports = server.exports();
