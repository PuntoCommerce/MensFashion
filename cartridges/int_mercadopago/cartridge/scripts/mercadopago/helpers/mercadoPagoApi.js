const restService = require("*/cartridge/scripts/mercadopago/service/restService");
const authService = require("*/cartridge/scripts/mercadopago/service/authService");
const publicService = require("*/cartridge/scripts/mercadopago/service/publicService");

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
      // params: { bins: bins },
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
      // body: {
      //   additional_info: {
      //     items: [
      //       {
      //         id: "PR0001",
      //         title: "Point Mini",
      //         description:
      //           "Producto Point para cobros con tarjetas mediante bluetooth",
      //         picture_url:
      //           "https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium@2x.png",
      //         category_id: "electronics",
      //         quantity: 1,
      //         unit_price: 58.8,
      //       },
      //     ],
      //     payer: {
      //       first_name: "Test",
      //       last_name: "Test",
      //       phone: {
      //         area_code: 11,
      //         number: "987654321",
      //       },
      //       address: {},
      //     },
      //     shipments: {
      //       receiver_address: {
      //         zip_code: "12312-123",
      //         state_name: "Rio de Janeiro",
      //         city_name: "Buzios",
      //         street_name: "Av das Nacoes Unidas",
      //         street_number: 3003,
      //       },
      //     },
      //   },
      //   transaction_amount: 100,
      //   token: cartToken,
      //   installments: 1,
      //   issuer_id: issuer_id,
      //   // "payment_method_id": "master",
      //   payer: {
      //     email: "test@test.com",
      //   },
      // },
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

module.exports = {
  getToken: getToken,
  getPaymentMethods: getPaymentMethods,
  getCardToken: getCardToken,
  createPayment: createPayment,
};
