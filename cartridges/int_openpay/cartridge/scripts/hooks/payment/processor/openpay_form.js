"use strict";

var COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");

/**
 * Verifies the required information for billing form is provided.
 * @param {Object} req - The request object
 * @param {Object} paymentForm - the payment form
 * @param {Object} viewFormData - object contains billing form data
 * @returns {Object} an object that has error information or payment information
 */
function processForm(req, paymentForm, viewFormData) {
  var array = require("*/cartridge/scripts/util/array");

  var viewData = viewFormData;
  var creditCardErrors = {};

  viewData.paymentMethod = {
    value: paymentForm.paymentMethod.value,
    htmlName: paymentForm.paymentMethod.value,
  };

  viewData.paymentInformation = {
    // cardType: {
    //   value: paymentForm.creditCardFields.cardType.value,
    //   htmlName: paymentForm.creditCardFields.cardType.htmlName,
    // },
    cardNumber: {
      value: paymentForm.openpay.card_number_openpay.value,
      htmlName: paymentForm.openpay.card_number_openpay.htmlName,
    },
    securityCode: {
      value: paymentForm.openpay.cvv_openpay.value,
      htmlName: paymentForm.openpay.cvv_openpay.htmlName,
    },
    expirationMonth: {
      value: parseInt(paymentForm.openpay.month_openpay.value, 10),
      htmlName: paymentForm.openpay.month_openpay.htmlName,
    },
    expirationYear: {
      value: parseInt(paymentForm.openpay.year_openpay.value, 10),
      htmlName: paymentForm.openpay.year_openpay.htmlName,
    },
    holderName: {
      value: paymentForm.openpay.name_openpay.value,
      htmlName: paymentForm.openpay.name_openpay.htmlName,
    },
    deviceSessionId: {
      value: paymentForm.openpay.device_session_id.value,
      htmlName: paymentForm.openpay.device_session_id.htmlName,
    },
  };

  if (req.form.storedPaymentUUID) {
    viewData.storedPaymentUUID = req.form.storedPaymentUUID;
  }

  // viewData.saveCard = paymentForm.creditCardFields.saveCard.checked;

  // process payment information
  if (
    viewData.storedPaymentUUID &&
    req.currentCustomer.raw.authenticated &&
    req.currentCustomer.raw.registered
  ) {
    var paymentInstruments = req.currentCustomer.wallet.paymentInstruments;
    var paymentInstrument = array.find(paymentInstruments, function (item) {
      return viewData.storedPaymentUUID === item.UUID;
    });

    viewData.paymentInformation.cardNumber.value =
      paymentInstrument.creditCardNumber;
    viewData.paymentInformation.cardType.value =
      paymentInstrument.creditCardType;
    viewData.paymentInformation.securityCode.value = req.form.securityCode;
    viewData.paymentInformation.expirationMonth.value =
      paymentInstrument.creditCardExpirationMonth;
    viewData.paymentInformation.expirationYear.value =
      paymentInstrument.creditCardExpirationYear;
    viewData.paymentInformation.creditCardToken =
      paymentInstrument.raw.creditCardToken;
  }

  return {
    error: false,
    viewData: viewData,
  };
}

/**
 * Save the credit card information to login account if save card option is selected
 * @param {Object} req - The request object
 * @param {dw.order.Basket} basket - The current basket
 * @param {Object} billingData - payment information
 */
function savePaymentInformation(req, basket, billingData) {
  var CustomerMgr = require("dw/customer/CustomerMgr");

  if (
    !billingData.storedPaymentUUID &&
    req.currentCustomer.raw.authenticated &&
    req.currentCustomer.raw.registered &&
    billingData.saveCard &&
    billingData.paymentMethod.value === "OpenPay"
  ) {
    var customer = CustomerMgr.getCustomerByCustomerNumber(
      req.currentCustomer.profile.customerNo
    );

    var saveCardResult = COHelpers.savePaymentInstrumentToWallet(
      billingData,
      basket,
      customer
    );

    req.currentCustomer.wallet.paymentInstruments.push({
      creditCardHolder: saveCardResult.creditCardHolder,
      maskedCreditCardNumber: saveCardResult.maskedCreditCardNumber,
      creditCardType: saveCardResult.creditCardType,
      creditCardExpirationMonth: saveCardResult.creditCardExpirationMonth,
      creditCardExpirationYear: saveCardResult.creditCardExpirationYear,
      UUID: saveCardResult.UUID,
      creditCardNumber: Object.hasOwnProperty.call(
        saveCardResult,
        "creditCardNumber"
      )
        ? saveCardResult.creditCardNumber
        : null,
      raw: saveCardResult,
    });
  }
}

exports.processForm = processForm;
exports.savePaymentInformation = savePaymentInformation;
