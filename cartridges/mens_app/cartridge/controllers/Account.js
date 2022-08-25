const server = require("server");
server.extend(module.superModule);
const { sendAccount } = require("*/cartridge/scripts/salescloud/api");

server.append("SubmitRegistration", (req, res, next) => {
  const viewData = res.getViewData();
  const body = {
    FirstName: viewData.firstName,
    LastName: viewData.lastName,
    PersonEmail: viewData.email,
    Phone: viewData.phone,
  };
  sendAccount(body);
  next();
});

module.exports = server.exports();
