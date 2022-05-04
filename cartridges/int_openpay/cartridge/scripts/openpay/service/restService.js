"use strict";

const serviceName = "int_openpay.http.rest";
const paymentMethodID = "OpenPay";

const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const PaymentMgr = require("dw/order/PaymentMgr");
const Resource = require("dw/web/Resource");

const { Base64 } = require("*/cartridge/scripts/openpay/utils/Base64");

const creteUrlPath = (credential, openpayId, path) => {
  var url = credential.URL;
  if (!url.match(/.+\/$/)) {
    url += "/";
  }
  url += openpayId + path;
  return url;
};

const createRequest = (service, data) => {
  const credential = service.configuration.credential;
  if (!(credential instanceof ServiceCredential)) {
    const { msgf } = Resource;
    throw new Error(
      msgf("service.nocredentials", "openpayerrors", null, serviceName)
    );
  }
  var { path, method, body } = data;

  const paymentProcessor =
    PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();

  const openpayId = paymentProcessor.getPreferenceValue("openpay_id");

  const b64Password = Base64.encode(credential.password + ":");

  service.setURL(creteUrlPath(credential, openpayId, path));
  service.addHeader("Content-Type", "application/json");
  service.setRequestMethod(method);
  service.addHeader("Authorization", "Basic " + b64Password);
  // service.setAu
  // service.addHeader(" " + credential.password);

  return body ? JSON.stringify(body) : "";
};

const parseResponse = (_, httpClient) => {
  return JSON.parse(httpClient.getText());
};

module.exports = (() => {
  const { msgf } = Resource;
  let restService;
  try {
    restService = LocalServiceRegistry.createService(serviceName, {
      createRequest: createRequest,
      parseResponse: parseResponse,
    });
  } catch (error) {
    return error;
  }

  return {
    call: (data) => {
      let result;
      try {
        result = restService.setThrowOnError().call(data);
      } catch (error) {
        return error;
      }
      if (result.isOk()) {
        return restService.response;
      } else {
        return result.response;
      }
    },
  };
})();
