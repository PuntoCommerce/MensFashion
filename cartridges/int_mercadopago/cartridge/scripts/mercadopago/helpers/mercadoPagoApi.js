const restService = require("~/cartridge/scripts/mercadopago/service/restService");
const authService = require("~/cartridge/scripts/mercadopago/service/authService");
const publicService = require("~/cartridge/scripts/mercadopago/service/publicService");

const getToken = () => {
  try {
    const token = authService.call({
      path: "oauth/token",
      method: "POST",
      body: {},
    });

    return token;
  } catch (err) {
    return {
      error: true,
      message: "something went wrong",
      errorMessage: err,
    };
  }
};

const getPaymentMethods = (bins) => {
  try {
    const paymentMethods = publicService.call({
      path: "v1/payment_methods/search",
      method: "GET",
      params: { bins: bins },
    });
    return paymentMethods;
  } catch (err) {
    return {
      error: true,
      message: "something went wrong",
      errorMessage: err,
    };
  }
};

const getCardToken = (
  cardholdername,
  cardnumber,
  expirationMonth,
  expirationYear,
  securityCode
) => {
  try {
    const paymentMethods = publicService.call({
      path: "v1/card_tokens",
      method: "POST",
      body: {
        card_number: cardnumber,
        cardholder: { name: cardholdername },
        security_code: securityCode,
        expiration_month: expirationMonth,
        expiration_year: expirationYear,
      },
    });
    return paymentMethods;
  } catch (err) {
    return false;
  }
};

const createPayment = (body) => {
  try {
    const payment = restService.call({
      path: "v1/payments",
      method: "POST",
      token: getToken().access_token,
      body: body,
    });
    return payment;
  } catch (err) {
    return {
      error: true,
      message: "something went wrong",
      errorMessage: err,
    };
  }
};

const getPayment = (id) => {
  try {
    const payment = restService.call({
      path: `v1/payments/` + id,
      method: "GET",
      token: getToken().access_token,
    });
    return payment;
  } catch (err) {
    return false;
  }
};

module.exports = {
  getPaymentMethods: getPaymentMethods,
  getCardToken: getCardToken,
  createPayment: createPayment,
  getPayment: getPayment,
};
