const token = require("~/cartridge/scripts/salescloud/token");
const rest = require("~/cartridge/scripts/salescloud/rest");

const getToken = () => {
  return token.call().access_token;
};

const call = (path, method, body) => {
  return rest.call({
    path: path,
    method: method,
    token: getToken(),
    body: body,
  });
};

module.exports = {
  sendOrder: (body) =>
    call("services/apexrest/OpportunityProducts", "POST", body),
  getInventory: () => call("services/apexrest/inventory", "GET", {}),
  getPrices: () => call("services/apexrest/pricebook", "GET", {}),
};
