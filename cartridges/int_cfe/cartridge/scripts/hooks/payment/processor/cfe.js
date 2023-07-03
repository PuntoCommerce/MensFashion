"use strict";

var collections = require("*/cartridge/scripts/util/collections");

var PaymentInstrument = require("dw/order/PaymentInstrument");
var PaymentMgr = require("dw/order/PaymentMgr");
var PaymentStatusCodes = require("dw/order/PaymentStatusCodes");
var Resource = require("dw/web/Resource");
var Transaction = require("dw/system/Transaction");

const OrderMgr = require("dw/order/OrderMgr");
const CustomerMgr = require("dw/customer/CustomerMgr");
const Logger = require("dw/system/Logger");
const Order = require("dw/order/Order");



/**
 * Verifies that entered credit card information is a valid card. If the information is valid a
 * credit card payment instrument is created
 * @param {dw.order.Basket} basket Current users's basket
 * @param {Object} paymentInformation - the payment information
 * @param {string} paymentMethodID - paymentmethodID
 * @param {Object} req the request object
 * @return {Object} returns an error object
 */
function Handle(basket, paymentInformation, paymentMethodID, req) {
  var currentBasket = basket;
  var cardErrors = {};
  var cardNumber = paymentInformation.cardNumber.value;
  var cardSecurityCode = paymentInformation.securityCode.value;
  var holderName = paymentInformation.holderName.value;
  var deviceSessionId = paymentInformation.deviceSessionId.value;
  var serverErrors = [];
  var creditCardStatus;
  var CFI = require("*/cartridge/scripts/cfe/helpers/cfeApi");
  var CFIToken = require("*/cartridge/scripts/cfe/helpers/cfeTokenHelper");
  var OPTokenResponse = CFIToken.rest("/api/token", "POST");
  
  if (OPTokenResponse.error) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.data",
      "cfe",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  }

  const body = {
    account: OPTokenResponse.account,
    cardNumber: cardNumber,
    cardId: holderName,
    nip: cardSecurityCode
  };

  const OPResponse = CFI.rest("api/balance", "POST", body, OPTokenResponse);
  var totalGrossPrice = currentBasket.totalGrossPrice.value;
  if (OPResponse.error) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.data",
      "cfe",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  } else if (OPResponse.balance < totalGrossPrice ) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.fail",
      "creditCard",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  } else if (OPResponse.responseCode == 0) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.balance",
      "cfe",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  } else if (OPResponse.responseCode == -31) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.card",
      "creditCard",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  } else if (OPResponse.responseCode == -36) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.nip",
      "creditCard",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  }

  const cardToken = OPResponse.cardNumber;

  Transaction.wrap(function () {
    var paymentInstruments =
      currentBasket.getPaymentInstruments(paymentMethodID);

    collections.forEach(paymentInstruments, function (item) {
      currentBasket.removePaymentInstrument(item);
    });

    var paymentInstrument = currentBasket.createPaymentInstrument(
      paymentMethodID,
      currentBasket.totalGrossPrice
    );

    paymentInstrument.setCreditCardHolder(holderName);
    paymentInstrument.setCreditCardNumber(cardNumber);
    paymentInstrument.setCreditCardType(cardNumber);
    paymentInstrument.setCreditCardToken(cardSecurityCode);
    // paymentInstrument.setCreditCardIssueNumber(cardNumber);
  });

  return {
    fieldErrors: cardErrors,
    serverErrors: serverErrors,
    error: false,
  };
}

/**
 * Authorizes a payment using a credit card. Customizations may use other processors and custom
 *      logic to authorize credit card payment.
 * @param {number} orderNumber - The current order's number
 * @param {dw.order.PaymentInstrument} paymentInstrument -  The payment instrument to authorize
 * @param {dw.order.PaymentProcessor} paymentProcessor -  The payment processor of the current
 *      payment method
 * @return {Object} returns an error object
 */
function Authorize(orderNumber, paymentInstrument, paymentProcessor) {
  var serverErrors = [];
  var fieldErrors = {};
  var error = false;
  var CFI = require("*/cartridge/scripts/cfe/helpers/cfeApi");
  var CFIToken = require("*/cartridge/scripts/cfe/helpers/cfeTokenHelper");
  var order = OrderMgr.getOrder(orderNumber);

  if (!order) {
    serverErrors.push(Resource.msg("error.technical", "checkout", null));
    return {
      fieldErrors: fieldErrors,
      serverErrors: serverErrors,
      error: true,
    };
  }

  const OPTokenResponse = CFIToken.rest("/api/token", "POST");
  
  if (OPTokenResponse.error) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.data",
      "cfe",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  }
  const body = {
    account: OPTokenResponse.account,
    cardNumber: paymentInstrument.creditCardType,
    cardId: paymentInstrument.creditCardHolder,
    nip: paymentInstrument.creditCardToken,
    amount: order.totalGrossPrice.value
  };

  try {
    const OPResponse = CFI.rest("/api/redeem", "POST", body,OPTokenResponse);

    if (OPResponse.error) {
      serverErrors.push(OPResponse.error.message);
      error = true;
    }
    Transaction.wrap(function () {
      if (OPResponse.responseCode === 1) {
        paymentInstrument.paymentTransaction.setTransactionID(OPResponse.transactionId);
        order.custom.iscfe = true;
        order.setPaymentStatus(Order.PAYMENT_STATUS_PAID);
      } else if (OPResponse.responseCode === -30) {
        error = true;
        serverErrors.push(Resource.msg("error.payment.fail", "cfe", null));
      } else if (OPResponse.responseCode === -31) {
        error = true;
        serverErrors.push(Resource.msg("error.payment.fail", "cfe", null));
      }else if(OPResponse.responseCode === 401) {
        error = true;
        serverErrors.push(Resource.msg("error.payment.unauthorized", "cfe", null));
      }else {
        error = true;
        serverErrors.push(Resource.msg("error.payment.fail", "cfe", null));
      }
      paymentInstrument.paymentTransaction.setPaymentProcessor(
        paymentProcessor
      );
    });
  } catch (e) {
    error = true;
    serverErrors.push(Resource.msg("error.technical", "checkout", null));
  }

  return {
    fieldErrors: fieldErrors,
    serverErrors: serverErrors,
    error: error,
  };
}

exports.Handle = Handle;
exports.Authorize = Authorize;
