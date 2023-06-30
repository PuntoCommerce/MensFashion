"use strict";

const serviceName = "CFEPayment.rest";
const paymentMethodID = "CFE"

const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const PaymentMgr = require("dw/order/PaymentMgr");
const Resource = require("dw/web/Resource");

const { Base64 } = require("~/cartridge/scripts/cfe/utils/Base64");

const creteUrlPath = (credential,path) => {
  var url = credential.URL;
  if (!url.match(/.+\/$/)) {
    url += "/";
  }
  url += path;
  return url;
};

const createRequest = (service, data) => {
  const credential = service.configuration.credential;
  if (!(credential instanceof ServiceCredential)) {
    const { msgf } = Resource;
    throw new Error(
      msgf("service.nocredentials", "cfeerrors", null, serviceName)
    );
  }

  var { path, method, body,OPTokenResponse } = data;
  service.addHeader('Content-Type', 'application/json');
    service.setURL(creteUrlPath(credential,path));
    service.setRequestMethod(method);
    service.addHeader("Authorization", "Bearer " + OPTokenResponse.authorizedToken);

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
        return { error: true, message: result.errorMessage };
      }
    },
  };
})();
