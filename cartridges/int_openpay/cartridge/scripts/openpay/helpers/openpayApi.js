const restservice = require("~/cartridge/scripts/openpay/service/restservice");

const rest = (path, method, body = null) => {
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
  createCardToken: createCardToken,
};
j;
