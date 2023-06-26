const restservice = require("~/cartridge/scripts/cfe/service/cfeToken");

const rest = (path, method, body,createToken) => {
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
