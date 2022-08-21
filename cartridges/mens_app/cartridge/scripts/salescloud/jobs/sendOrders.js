// const collections = require("*/cartridge/scripts/util/collections");
const OrderMgr = require("dw/order/OrderMgr");
const { sendOrder } = require("~/cartridge/scripts/salescloud/api");
const Transaction = require("dw/system/Transaction");
const Order = require("dw/order/Order");

exports.execute = () => {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 15);

  let orders = OrderMgr.searchOrders(
    "creationDate > {0} AND custom.SalesCloudOrderId != {1} AND paymentStatus = {2}",
    "creationDate desc",
    currentDate,
    undefined,
    Order.PAYMENT_STATUS_PAID
  );

  let order;
  while (orders.hasNext()) {
    order = orders.next();
    order = OrderMgr.getOrder(order.orderNo);

    let products = [];
    let productLineItems = order.productLineItems.toArray();
    let p;
    productLineItems.forEach((p) => {
      products.push({ ProductCode: p.productID, Quantity: p.quantityValue });
    });

    let shippingAddress = order.shipments[0].shippingAddress;
    let paymentInstruments = order.paymentInstruments[0];

    let firstName = "";
    let lastName = "";

    if (order.customer.authenticated) {
      firstName = order.customer.firstName;
      lastName = order.customer.lastName;
    } else {
      firstName = shippingAddress.firstName;
      lastName = shippingAddress.lastName;
    }

    let body = {
      account: {
        FirstName: firstName,
        LastName: lastName,
        PersonEmail: order.customerEmail,
        Phone: shippingAddress.phone,
      },
      shippingInfo: {
        shippingStreet: shippingAddress.address1,
        shippingPostalCode: shippingAddress.postalcode,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.stateCode,
        shippingCountry: "Mexico",
      },
      paymentType: paymentInstruments.paymentMethod,
      oppName: order.orderNo,
      cadena: "Men's Fashion",
      products: products,
    };

    let salesOrderId = sendOrder(body);

    if (!salesOrderId.error) {
      Transaction.wrap(() => {
        order.custom.SalesCloudOrderId = salesOrderId;
      });
    }
  }
};
