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

const {
  getPaymentMethods,
  getCardToken,
  createPayment,
} = require("*/cartridge/scripts/mercadopago/helpers/mercadoPagoApi");

const paymentMethodIdMP = "MercadoPago";

/**
 * Creates a token. This should be replaced by utilizing a tokenization provider
 * @returns {string} a token
 */
function createToken() {
  return Math.random().toString(36).substr(2);
}

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
  var serverErrors = [];
  var creditCardStatus;

  const paymentMEthodsMP = getPaymentMethods(cardNumber);
  if (paymentMEthodsMP.error && !paymentMEthodsMP.length) {
    // Invalid Payment Instrumentx
    let invalidPaymentMethod = Resource.msg(
      "error.payment.not.valid",
      "mercadopago",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  }

  const issuer_id = paymentMEthodsMP.results[0].issuer.id;

  const cartToken = getCardToken(
    currentBasket.billingAddress.fullName,
    cardNumber,
    expirationMonth,
    expirationYear,
    cardSecurityCode
  );

  if (!cartToken) {
    // Invalid Payment Instrumentx
    let invalidPaymentMethod = Resource.msg(
      "error.payment.not.valid",
      "mercadopago",
      null
    );
    return {
      fieldErrors: [],
      serverErrors: [invalidPaymentMethod],
      error: true,
    };
  }
  const cartTokenId = cartToken.id;

  var cardType = paymentInformation.cardType.value;

  Transaction.wrap(function () {
    var paymentInstruments =
      currentBasket.getPaymentInstruments(paymentMethodIdMP);

    collections.forEach(paymentInstruments, function (item) {
      currentBasket.removePaymentInstrument(item);
    });

    var paymentInstrument = currentBasket.createPaymentInstrument(
      paymentMethodIdMP,
      currentBasket.totalGrossPrice
    );

    paymentInstrument.setCreditCardHolder(
      currentBasket.billingAddress.fullName
    );
    paymentInstrument.setBankAccountNumber(issuer_id);
    paymentInstrument.setCreditCardNumber(cardNumber);
    paymentInstrument.setCreditCardType(cardType);
    paymentInstrument.setCreditCardExpirationMonth(expirationMonth);
    paymentInstrument.setCreditCardExpirationYear(expirationYear);
    paymentInstrument.setCreditCardToken(cartTokenId);
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

  const items = getListedItemsForMP(order);
  const customer = order.getCustomer();

  const shippingInfo = order.shipments[0].shippingAddress;

  const payer = {
    address: {},
    phone: {
      area_code: 52,
      number: shippingInfo.phone,
    },
    first_name: shippingInfo.firstName,
    last_name: shippingInfo.lastName,
    // email: order.customerEmail,
  };

  const shipments = {
    receiver_address: {
      zip_code: shippingInfo.postalCode,
      state_name: shippingInfo.stateCode,
      city_name: shippingInfo.city,
      street_name: shippingInfo.address1,
      street_number: shippingInfo.address2 || 0,
    },
  };

  const body = {
    additional_info: {
      items: items,
      payer: payer,
      shipments: shipments,
    },
    transaction_amount: order.totalGrossPrice.value,
    token: paymentInstrument.creditCardToken,
    installments: 1,
    issuer_id: parseInt(paymentInstrument.bankAccountNumber),
    payer: {
      email: order.customerEmail,
    },
  };

  const logger = Logger.getLogger("mercadopago", "mercadopago");

  try {
    const paymentMP = createPayment(body);
    // if(paymentMP.ok){}
    Transaction.wrap(function () {
      if (paymentMP.error) {
        logger.error(
          "\n Fail in payment.\nError: {0} \nRequest: {1}",
          paymentMP.errorMessage,
          JSON.stringify(body)
        );
        error = true;
        serverErrors.push(Resource.msg("error.technical", "mercadopago", null));
      } else {
        order.custom.isMercadoPago = true;
        paymentInstrument.paymentTransaction.setTransactionID(paymentMP.id);
        if (
          paymentMP.status === "approved" ||
          paymentMP.status === "pending" ||
          paymentMP.status === "in_process" ||
          paymentMP.status === "in_mediation"
        ) {
          if (paymentMP.status === "approved") {
            order.setPaymentStatus(Order.PAYMENT_STATUS_PAID);
          }
        } else {
          // error = true;
          // serverErrors.push(
          //   Resource.msg("error.rejected", "mercadopago", null)
          // );
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

function getListedItemsForMP(order) {
  const items = [];
  for (var i = 0; i < order.productLineItems.length; i++) {
    const item = order.productLineItems[i];
    // const product = ProductMgr.getProduct(item.productID);

    items.push({
      id: item.productID,
      title: item.productName,
      description: "",
      picture_url: "",
      category_id: "",
      quantity: item.quantityValue,
      unit_price: parseFloat(item.priceValue.toFixed(2)),
    });
  }
  return items;
}

exports.Handle = Handle;
exports.Authorize = Authorize;
exports.createToken = createToken;
