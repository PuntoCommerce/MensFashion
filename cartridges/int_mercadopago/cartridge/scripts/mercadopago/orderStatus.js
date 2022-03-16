
const OrderMgr = require("dw/order/OrderMgr");
const Order = require("dw/order/Order");
const Transaction = require("dw/system/Transaction");
const {
  getPayment,
} = require("~/cartridge/scripts/mercadopago/helpers/mercadoPagoApi");
/* 
  Search all orders that was created 7 day ago to check the payment status and update it 
 */

const execute = () => {
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
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);

  let orders = OrderMgr.searchOrders(
    "creationDate > {0} AND custom.isMercadoPago = {1}",
    "creationDate desc",
    currentDate,
    true
  );

  for each(order in orders) {
    let newOrder = order;
    let transactionID = order
      .getPaymentInstrument()
      .getPaymentTransaction().transactionID;

    let realOrder = OrderMgr.getOrder(order.orderNo);
    if (transactionID) {
      let payment = getPayment(transactionID);
      if (payment) {
        if (payment.status === "approved") {
          changePaymentStatus(realOrder, Order.PAYMENT_STATUS_PAID);
        } else if (
          payment.status === "rejected" ||
          payment.status === "cancelled"
        ) {
          changeOrderStatus(realOrder, Order.ORDER_STATUS_CANCELLED);
        }
      }
    } else {
      changeOrderStatus(realOrder, Order.ORDER_STATUS_CANCELLED);
    }
  };
};

exports.execute = execute;
