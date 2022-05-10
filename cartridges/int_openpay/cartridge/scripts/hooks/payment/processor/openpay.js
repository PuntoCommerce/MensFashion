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

const OpenPay = require("*/cartridge/scripts/openpay/helpers/openpayApi");

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
  var expirationMonth = paymentInformation.expirationMonth.value;
  var expirationYear = paymentInformation.expirationYear.value;
  var holderName = paymentInformation.holderName.value;
  var deviceSessionId = paymentInformation.deviceSessionId.value;
  var serverErrors = [];
  var creditCardStatus;

  const body = {
    card_number: cardNumber,
    holder_name: holderName,
    expiration_year: expirationYear,
    expiration_month: expirationMonth,
    cvv2: cardSecurityCode,
  };

  const OPResponse = OpenPay.rest("/tokens", "POST", body);

  if (OPResponse.error) {
    let invalidPaymentMethod = Resource.msg(
      "error.payment.data",
      "openpay",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  }

  const cardToken = OPResponse.id;

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
    paymentInstrument.setCreditCardExpirationMonth(expirationMonth);
    paymentInstrument.setCreditCardExpirationYear(expirationYear);
    paymentInstrument.setCreditCardType(deviceSessionId);
    paymentInstrument.setCreditCardToken(cardToken);
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
  const order = OrderMgr.getOrder(orderNumber);

  if (!order) {
    serverErrors.push(Resource.msg("error.technical", "checkout", null));
    return {
      fieldErrors: fieldErrors,
      serverErrors: serverErrors,
      error: true,
    };
  }

  const body = {
    source_id: paymentInstrument.creditCardToken,
    method: "card",
    amount: order.totalGrossPrice.value,
    currency: order.currencyCode,
    description: "Order #" + order.orderNo,
    order_id: order.orderNo,
    device_session_id: paymentInstrument.creditCardType,
    customer: {
      name: order.billingAddress.firstName,
      last_name: order.billingAddress.lastName,
      phone_number: order.billingAddress.phone,
      email: order.customerEmail,
    },
  };

  try {
    const OPResponse = OpenPay.rest("/charges", "POST", body);

    if (OPResponse.error) {
      serverErrors.push(OPResponse.error.message);
      error = true;
    }
    Transaction.wrap(function () {
      if (OPResponse.status === "failed") {
        error = true;
        serverErrors.push(Resource.msg("error.payment.fail", "openpay", null));
      } else {
        paymentInstrument.paymentTransaction.setTransactionID(OPResponse.id);
        order.custom.isOpenPay = true;
        if (OPResponse.status === "completed") {
          // order.setPaymentStatus(Order.PAYMENT_STATUS_PAID);
        }
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
