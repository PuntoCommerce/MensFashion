const server = require("server");
const OrderMgr = require("dw/order/OrderMgr");
const Order = require("dw/order/Order");
const Transaction = require("dw/system/Transaction");
const {
  getPayment,
} = require("int_mercadopago/cartridge/scripts/mercadopago/helpers/mercadoPagoApi");

let emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");

server.get("Prueba", (req, res, next) => {
  const changePaymentStatus = (order, status) => {
    Transaction.wrap(() => {
      order.setPaymentStatus(status);
    });
  };

  const changeOrderStatus = (order, status) => {
    Transaction.wrap(() => {
      order.setStatus(status);
    });
  };

  // let failOrder = (order) => {
  //   Transaction.wrap(() => {
  //     OrderMgr.failOrder(order, false);
  //   });
  // };

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);

  let orders = OrderMgr.searchOrders(
    "creationDate > {0} AND custom.isMercadoPago = {1}",
    "creationDate desc",
    currentDate,
    true
    
  );

  let approved = [];
  let rejected = [];

  // let fun = () => {
    for each(order in orders) {
    let newOrder = order;
    let transactionID = order
      .getPaymentInstrument()
      .getPaymentTransaction().transactionID;

      // approved.push(transactionID);
      
      let realOrder = OrderMgr.getOrder(order.orderNo);
    if (transactionID) {
      let payment = getPayment(transactionID);
      if (payment) {

        // var emailObj = {
        //   to: order.customerEmail,
        //   subject: "Payment status",
        //   from: "no-reply@salesforce.com",
        //   type: 7,
        // };

        if (payment.status === "approved") {
          approved.push(order.orderNo);
          changePaymentStatus(realOrder, Order.PAYMENT_STATUS_PAID);
          // emailHelpers.sendEmail(emailObj, "checkout/payment/paymentApproved", {
          //   order: realOrder,
          // });
        } else if (
          payment.status === "rejected" ||
          payment.status === "cancelled"
        ) {
          rejected.push(order.orderNo);
          changeOrderStatus(realOrder, Order.ORDER_STATUS_CANCELLED);
          // emailHelpers.sendEmail(emailObj, "checkout/payment/paymentDecline", {
          //   order: realOrder,
          // });
        }
      }
    } else {
      changeOrderStatus(realOrder, Order.ORDER_STATUS_CANCELLED);
    }
  };

  res.json({
    approved: approved,
    rejected: rejected,
  });
  next();
});

module.exports = server.exports();
