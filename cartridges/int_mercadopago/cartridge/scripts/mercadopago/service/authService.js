"use strict";

const serviceName = "int_mercadopago.http.rest";
const paymentMethodID = "MercadoPago";

const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const PaymentMgr = require("dw/order/PaymentMgr");
const Resource = require("dw/web/Resource");

/**
 * Create URL for a call
 * @param  {dw.svc.ServiceCredential} credential current service credential
 * @param  {string} path REST action endpoint
 * @returns {string} url for a call
 */
function getUrlPath(credential, path) {
  var url = credential.URL;
  if (!url.match(/.+\/$/)) {
    url += "/";
  }
  url += path;
  return url;
}

/** createRequest callback for a service
 * @param  {dw.svc.Service} service service instance
 * @param  {Object} data call data with path, method, body for a call or createToken in case of recursive call
 * @returns {string} request body
 */
function createRequest(service, data) {
  var credential = service.configuration.credential;
  if (!(credential instanceof ServiceCredential)) {
    var { msgf } = Resource;
    throw new Error(
      msgf("service.nocredentials", "pruebaerrors", null, serviceName)
    );
  }
  var { path, method, createToken, partnerAttributionId } = data;

  const paymentProcessor =
    PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();

  const clientId = paymentProcessor.getPreferenceValue("client_id");
  const clientSecret = paymentProcessor.getPreferenceValue("client_secret");
  // const clientId = paymentProcessor.custom.client_id;
  // const clientSecret = paymentProcessor.custom.client_secret;

  service.setURL(getUrlPath(credential, path));
  service.addHeader("Content-Type", "application/json");
  service.setRequestMethod(method || "POST");
  service.addHeader("Authorization", "Bearer " + credential.password);

  return JSON.stringify({
    client_secret: clientSecret,
    client_id: clientId,
    grant_type: "client_credentials",
  });
}

module.exports = (function () {
  var { msgf } = Resource;
  var restService;
  try {
    restService = LocalServiceRegistry.createService(serviceName, {
      createRequest: createRequest,
      parseResponse: function (_, httpClient) {
        return JSON.parse(httpClient.getText());
      },
      filterLogMessage: function (msg) {
        return msg;
      },
      getRequestLogMessage: function (request) {
        return request;
      },
      getResponseLogMessage: function (response) {
        return response.text;
      },
    });
  } catch (error) {
    return error;
    // throw new Error();
  }

  return {
    call: function (data) {
      var result;
      try {
        result = restService.setThrowOnError().call(data);
      } catch (error) {
        return error;
        throw new Error();
      }
      if (result.isOk()) {
        return restService.response;
      } else {
        return false;
      }
    },
  };
})();
