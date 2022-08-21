const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const Resource = require("dw/web/Resource");
const Site = require("dw/system/Site");

/** createRequest callback for a service
 * @param  {dw.svc.Service} service service instance
 * @param  {Object} data call data with path, method, body for a call or createToken in case of recursive call
 * @returns {string} request body
 */
function createRequest(service, data) {
  var credential = service.configuration.credential;
  const currentSite = Site.getCurrent();
  if (!(credential instanceof ServiceCredential)) {
    var { msgf } = Resource;
    throw new Error(
      msgf("service.nocredentials", "pruebaerrors", null, serviceName)
    );
  }

  service.setURL(credential.URL);
  service.addHeader("Content-Type", "application/x-www-form-urlencoded");
  service.setRequestMethod("POST");

  service.addParam("grant_type", "password");
  service.addParam(
    "client_id",
    currentSite.getCustomPreferenceValue("SalesCloudClientId")
  );
  service.addParam(
    "client_secret",
    currentSite.getCustomPreferenceValue("SalesCloudClientSecret")
  );
  service.addParam(
    "username",
    currentSite.getCustomPreferenceValue("SalesCloudUser")
  );
  service.addParam(
    "password",
    currentSite.getCustomPreferenceValue("SalesCloudPass")
  );

  return "";
}

module.exports = (function () {
  var { msgf } = Resource;
  var restService;
  try {
    restService = LocalServiceRegistry.createService("SalesCloud.Token", {
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
    throw new Error();
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
        return result;
      }
    },
  };
})();
