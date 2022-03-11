const server = require("server");
server.extend(module.superModule);

const Resource = require("dw/web/Resource");

// server.append("PlaceOrder", function (req, res, next) {
//   const viewData = res.getViewData();

//   // req.mercadopago = {
//   //   paymentMethod: "MercadoPago",
//   //   isValid: true,
//   // };

//   // next();

//   res.json({
//     error: true,
//     errorStage: {
//       stage: "payment",
//       step: "paymentInstrument",
//     },
//     errorMessage: Resource.msg("error.payment.not.valid", "checkout", null),
//   });
//   return next();
// });

module.exports = server.exports();
