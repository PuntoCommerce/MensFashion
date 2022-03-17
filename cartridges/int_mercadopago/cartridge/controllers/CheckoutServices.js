const server = require("server");
server.extend(module.superModule);

// server.append("SubmitPayment", (req, res, next) => {
//   const viewData = res.getViewData();

//   next();
// });

module.exports = server.exports();
