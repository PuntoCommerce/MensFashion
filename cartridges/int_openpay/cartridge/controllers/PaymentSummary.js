const server = require("server");
var PaymentMgr = require("dw/order/PaymentMgr");

server.get("Payment", (req, res, next) => {
  var payment = PaymentMgr.getPaymentMethod(req.querystring.paymentID);
  res.render("checkout/billing/paymentOptions/paymentSummary", {
    payment: {
      id: payment.ID,
      name: payment.name,
      description: payment.description,
      image: payment.image,
    },
  });
  next();
});

module.exports = server.exports();
