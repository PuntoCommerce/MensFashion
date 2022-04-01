const restservice = require("~/cartridge/scripts/openpay/service/restService");

const rest = (path, method, body) => {
  try {
    const result = restservice.call({
      path: path,
      method: method,
      body: body,
    });
    return result;
  } catch (error) {
    return false;
  }
};

module.exports = {
  rest: rest,
};
