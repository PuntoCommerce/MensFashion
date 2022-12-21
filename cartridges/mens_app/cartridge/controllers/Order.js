"use strict";
const server = require("server");
server.extend(module.superModule);

const OrderMgr = require("dw/order/OrderMgr");
const { sendOrder } = require("~/cartridge/scripts/salescloud/api");
const Transaction = require("dw/system/Transaction");
const Order = require("dw/order/Order");

const getPorcentage = (cant, total) => {
  return (cant / total) * 100;
};

const handleShipment = (shipment) => {
  if (shipment.shippingMethodID == "pickup") {
    let store = StoreMgr.getStore(shipment.shippingAddress.lastName);

    return {
      pickUpStoreId: store.ID,
      storeShippingStreet: store.address1,
      storeShippingPostalCode: store.postalCode,
      storeShippingCity: store.city,
      storeShippingState: store.stateCode,

      shippingCost: shipment.shippingTotalNetPrice.value,
    };
  }
  return {
    shippingStreet: shipment.shippingAddress.address1,
    shippingPostalCode: shipment.shippingAddress.postalCode,
    shippingCity: shipment.shippingAddress.city,
    shippingState: shipment.shippingAddress.stateCode,
    shippingCountry: "Mexico",
    shippingCost: shipment.shippingTotalNetPrice.value,
  };
};

const parseDate = (date) => {
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }
  return day + "/" + month + "/" + date.getFullYear();
};

const handlePayment = (payment) => {
  return {
    type: payment.paymentInstrument.paymentMethod,
    authorizationNumber: payment.transactionID,
    authorizationDate: parseDate(payment.lastModified),
  };
};

server.append("Confirm", (req, res, next) => {
  const viewData = res.getViewData();
  const order = OrderMgr.getOrder(viewData.order.orderNumber);
  viewData.order.customerName = order.customerName;
  res.setViewData(viewData);
  next();
});

server.get("CustomSendOrder", (req, res, next) => {
  const order = OrderMgr.getOrder(req.querystring.orderId);

  let discounts = 0;
  let pAdjustment;
  let priceAdjustments = order.priceAdjustments.iterator();
  while (priceAdjustments.hasNext()) {
    pAdjustment = priceAdjustments.next();
    discounts += pAdjustment.price.value * -1;
  }

  let orderDiscount = discounts;

  let products = [];
  let productLineItems = order.productLineItems.toArray();
  let p;

  productLineItems.forEach((p) => {
    let promotionIds = [];
    let pDiscount = 0;
    let productPAdjusments = p.priceAdjustments.iterator();
    let ppAdjustment;
    while (productPAdjusments.hasNext()) {
      ppAdjustment = productPAdjusments.next();
      discounts += ppAdjustment.price.value * -1;
      pDiscount += ppAdjustment.price.value * -1;
    }

    let porcToOrderDiscount =
      (p.price.value * p.quantityValue) /
      order.adjustedMerchandizeTotalPrice.value;

    let aditionalDiscount = 0;
    if (orderDiscount != 0) {
      aditionalDiscount = porcToOrderDiscount * orderDiscount;
      pDiscount += aditionalDiscount;
    }

    products.push({
      ProductCode: p.productID,
      Quantity: p.quantityValue,
      DiscName: promotionIds.toString(),
      DiscountP: getPorcentage(pDiscount, p.price.value),
      Discount: pDiscount,
    });
  });
  // let paymentInstruments = order.paymentInstruments[0];

  let firstName = "";
  let lastName = "";

  if (order.customer.authenticated) {
    firstName = order.customer.firstName;
    lastName = order.customer.lastName;
  } else {
    let customerName = order.customerName.split(" ");
    firstName = customerName.slice(0, customerName.length / 2).join(" ");
    lastName = customerName
      .slice(customerName.length / 2, customerName.length)
      .join(" ");
  }

  let defaultShipment = order.defaultShipment;
  let paymentTransaction = order.paymentTransaction;

  let pricebook =
    order.allProductLineItems[0].product.priceModel.priceInfo.priceBook.ID;

  const body = {
    account: {
      FirstName: firstName,
      LastName: lastName,
      PersonEmail: order.customerEmail,
      Phone: defaultShipment.shippingAddress.phone,
    },
    shippingInfo: handleShipment(defaultShipment),
    paymentInfo: handlePayment(paymentTransaction),
    oppName: order.orderNo,
    cadena: "Men's Fashion",
    OrderDiscountDetailsTotal: discounts,
    descuentoOrden: orderDiscount,
    products: products,
    pricebookId: pricebook,
  };
  res.json({ order: body });
  next();
});

module.exports = server.exports();
