"use strict";
const server = require("server");
server.extend(module.superModule);

const OrderMgr = require("dw/order/OrderMgr");
const { sendOrder } = require("~/cartridge/scripts/salescloud/api");
const Transaction = require("dw/system/Transaction");
const Order = require("dw/order/Order");

server.append("Confirm", (req, res, next) => {
  const viewData = res.getViewData();
  const order = OrderMgr.getOrder(viewData.order.orderNumber);
  viewData.order.customerName = order.customerName;
  res.setViewData(viewData);
  next();
});

server.get("CustomSendOrder", (req, res, next) => {
  // let currentDate = new Date();
  // currentDate.setDate(currentDate.getDate() - 15);

  // let orders = OrderMgr.searchOrders(
  //   "creationDate > {0} AND custom.SalesCloudOrderId != {1} AND paymentStatus = {2}",
  //   "creationDate desc",
  //   currentDate,
  //   undefined,
  //   Order.PAYMENT_STATUS_PAID
  // );

  let order = OrderMgr.getOrder(req.querystring.orderId);

  // let order;
  // while (orders.hasNext()) {
  //   order = orders.next();
  //   order = OrderMgr.getOrder(order.orderNo);

  //   let firstName = "";
  //   let lastName = "";

  //   if (order.customer.authenticated) {
  //     firstName = order.customer.firstName;
  //     lastName = order.customer.lastName;
  //   } else {
  //     lastName = order.customerName;
  //   }

  //   let products = [];
  //   let productLineItems = order.productLineItems.toArray();
  //   let p;
  //   productLineItems.forEach((p) => {
  //     products.push({ ProductCode: p.productID, Quantity: p.quantityValue });
  //   });

  //   let body = {
  //     account: {
  //       FirstName: firstName,
  //       LastName: lastName,
  //       PersonEmail: order.customerEmail,
  //     },
  //     oppName: order.orderNo,
  //     cadena: "Men's Fashion",
  //     products: products,
  //   };

  //   let salesOrderId = sendOrder(body);

  //   if (!salesOrderId.error) {
  //     Transaction.wrap(() => {
  //       order.custom.SalesCloudOrderId = salesOrderId;
  //     });
  //   }
  // }
  res.json({ salesOrderId: "orders" });
  next();
});

module.exports = server.exports();
