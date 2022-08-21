// const collections = require("*/cartridge/scripts/util/collections");
const OrderMgr = require("dw/order/OrderMgr");
const { sendOrder } = require("~/cartridge/scripts/salescloud/api");
const Transaction = require("dw/system/Transaction");
const Order = require("dw/order/Order");

const handleShipment = (shipment) => {
  if (shipment.shippingMethodID == "pickup") {
    return { pickUpStoreId: shipment.shippingAddress.lastName };
  }
  return {
    shippingStreet: shipment.shippingAddress.address1,
    shippingPostalCode: shipment.shippingAddress.postalCode,
    shippingCity: shipment.shippingAddress.city,
    shippingState: shipment.shippingAddress.stateCode,
    shippingCountry: "Mexico",
  };
};

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
    let paymentInstruments = order.paymentInstruments[0];

    let firstName = "";
    let lastName = "";

    if (order.customer.authenticated) {
      firstName = order.customer.firstName;
      lastName = order.customer.lastName;
    } else {
      lastName = order.customerName;
    }

    let defaultShipment = order.defaultShipment;

    let body = {
      account: {
        FirstName: firstName || "",
        LastName: lastName,
        PersonEmail: order.customerEmail,
        Phone: defaultShipment.shippingAddress.phone,
      },
      shippingInfo: handleShipment(defaultShipment),
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
