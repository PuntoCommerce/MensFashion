const OrderMgr = require("dw/order/OrderMgr");
const Order = require("dw/order/Order");
const Transaction = require("dw/system/Transaction");

const OpenPay = require("~/cartridge/scripts/openpay/helpers/openpayApi");

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
    "creationDate > {0} AND custom.isOpenPay = {1} AND paymentStatus = {2}",
    "creationDate desc",
    currentDate,
    true,
    Order.PAYMENT_STATUS_NOTPAID
  );

  while (orders.hasNext()) {
    let order = orders.next();
    let transactionID = order
      .getPaymentInstrument()
      .getPaymentTransaction().transactionID;

    let realOrder = OrderMgr.getOrder(order.orderNo);
    if (transactionID) {
      let payment = OpenPay.rest("/charges/" + transactionID, "GET", {});
      if (!payment.error) {
        if (payment.status === "completed") {
          changePaymentStatus(realOrder, Order.PAYMENT_STATUS_PAID);
        } else if (payment.status === "failed") {
          changeOrderStatus(realOrder, Order.ORDER_STATUS_CANCELLED);
        }
      }
    } else {
      changeOrderStatus(realOrder, Order.ORDER_STATUS_CANCELLED);
    }
  }
};

exports.execute = execute;
