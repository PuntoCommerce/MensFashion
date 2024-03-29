const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const Resource = require("dw/web/Resource");
const Logger = require("dw/system/Logger");

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
  var { path, method, body, token } = data;

  service.setURL(getUrlPath(credential, path));
  service.addHeader("Content-Type", "application/json");
  service.setRequestMethod(method || "GET");
  service.addHeader("Authorization", "Bearer " + token);

  return body ? JSON.stringify(body) : "";
}

module.exports = (function () {
  var { msgf } = Resource;
  var restService;
  try {
    restService = LocalServiceRegistry.createService("SalesCloud.Rest", {
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
        return {error: true, detail: error};
        throw new Error();
      }
      if (result.isOk()) {
        Logger.info("isOk: " + result);
        return restService.response;
      } else {
        Logger.info("error: " + result);
        return {error: true, detail: result};
      }
    },
  };
})();
