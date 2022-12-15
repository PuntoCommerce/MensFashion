const token = require("~/cartridge/scripts/salescloud/token");
const rest = require("~/cartridge/scripts/salescloud/rest");

const getToken = () => {
  return token.call().access_token;
};

const call = (path, method, body,token) => {
  return rest.call({
    path: path,
    method: method,
    token: token,
    body: body,
  });
};

module.exports = {
  sendOrder: (body,token) =>
    call("services/apexrest/OpportunityProducts", "POST", body,token),
  getInventory: () => call("services/apexrest/inventory", "GET", {}),
  getPrices: () => call("services/apexrest/pricebook", "GET", {}),
  sendAccount: (body) => call("services/apexrest/AccountC", "POST", body),
};
