const restservice = require("~/cartridge/scripts/cfe/service/restService");

const rest = (path, method, body, OPTokenResponse) => {
  try {
    const result = restservice.call({
      path: path,
      method: method,
      body: body,
      OPTokenResponse: OPTokenResponse
    });
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

module.exports = {
  rest: rest,
};
