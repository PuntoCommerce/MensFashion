"use strict";

const server = require("server");
server.extend(module.superModule);

var OrderMgr = require('dw/order/OrderMgr');

server.append("Confirm", (req, res, next) => {
  const viewData = res.getViewData();
  const order = OrderMgr.getOrder(viewData.order.orderNumber);
  viewData.order.customerName = order.customerName;
  res.setViewData(viewData);
  next();
  
});


module.exports = server.exports();
