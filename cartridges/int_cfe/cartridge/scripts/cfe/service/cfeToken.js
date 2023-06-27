"use strict";

const serviceName = "CFEPaymentToken";
const paymentMethodID = "CFE"
var Site = require('dw/system/Site');
const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const PaymentMgr = require("dw/order/PaymentMgr");
const Resource = require("dw/web/Resource");
var authTokenkey = Site.current.getCustomPreferenceValue('cfeTokenKey');

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
  var { path, method, body } = data;

  const paymentProcessor =
    PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();
  
    service.setURL(creteUrlPath(credential,path));
  
    var encoding = require('dw/crypto/Encoding');
    var bytes = require('dw/util/Bytes');
    var username = credential.user;
    var password = credential.password;;
    var token = 'Basic ' + encoding.toBase64(bytes(username + ':' + password));
    service.setRequestMethod('POST');
    service.addHeader('x-loyalty3-key', authTokenkey);
    service.addHeader('Authorization', token);
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
        return { error: true, message: result.errorMessage };
      }
    },
  };
})();
