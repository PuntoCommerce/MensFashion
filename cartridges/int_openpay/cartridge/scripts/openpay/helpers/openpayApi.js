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
    return { error: true, message: error.message };
  }
};

module.exports = {
  rest: rest,
};
