// const collections = require("*/cartridge/scripts/util/collections");
const OrderMgr = require("dw/order/OrderMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const { sendOrder, getToken } = require("~/cartridge/scripts/salescloud/api");
const Transaction = require("dw/system/Transaction");
const Order = require("dw/order/Order");
const Logger = require("dw/system/Logger");

const getPorcentage = (cant, total) => {
    return (cant / total) * 100;
};

const handleShipment = (shipment, shippingPriceAdjustment) => {
    const { suffix, suite } = shipment.shippingAddress;
    const interior = suffix != null ? suffix : "-";
    const exteriot = suite != null ? suite : "-";
    if (shipment.shippingMethodID == "pickup") {
        var store = StoreMgr.getStore(shipment.shippingAddress.lastName);

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
        // shippingStreet:`${shipment.shippingAddress.address1} ${shipment.shippingAddress.suite}`,
        shippingStreet:
            shipment.shippingAddress.address1 +
            " " +
            shipment.shippingAddress.address2 +
            " ext:" +
            exteriot +
            " int:" +
            interior,
        Numero_exterior__c: shipment.shippingAddress.suite,
        Numero_interior__c: shipment.shippingAddress.suffix,
        Referencia__c: shipment.shippingAddress.postBox,
        shippingPostalCode: shipment.shippingAddress.postalCode,
        shippingCity: shipment.shippingAddress.city,
        shippingState: shipment.shippingAddress.stateCode,
        shippingCountry: "Mexico",
        shippingCost:
            shipment.shippingTotalNetPrice.value + shippingPriceAdjustment,
    };
};

const parseDate = (date) => {
    var month = date.getMonth() + 1;
    var day = date.getDate();

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

module.exports.execute = () => {
    const logger = Logger.getLogger("Sales", "Sales");
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 15);

    var orders = OrderMgr.searchOrders(
        "creationDate > {0} AND custom.SalesCloudOrderId = {1} AND (paymentStatus = {2} OR custom.paypalPaymentMethod != {1})",
        "creationDate desc",
        currentDate,
        null,
        Order.PAYMENT_STATUS_PAID
    );

    const token = getToken();

    var order;
    var body;
    var salesOrderId;
    while (orders.hasNext()) {
        order = orders.next();
        order = OrderMgr.getOrder(order.orderNo);

        var discounts = 0;
        var pAdjustment;
        var priceAdjustments = order.priceAdjustments.iterator();
        while (priceAdjustments.hasNext()) {
            pAdjustment = priceAdjustments.next();
            discounts += pAdjustment.price.value * -1;
        }

        var orderDiscount = discounts;

        var products = [];
        var productLineItems = order.productLineItems.toArray();
        var p;

        productLineItems.forEach((p) => {
            var promotionIds = [];
            var pDiscount = 0;
            var productPAdjusments = p.priceAdjustments.iterator();
            var ppAdjustment;
            while (productPAdjusments.hasNext()) {
                ppAdjustment = productPAdjusments.next();
                discounts += ppAdjustment.price.value * -1;
                pDiscount += ppAdjustment.price.value * -1;
            }

            var porcToOrderDiscount = (p.price.value * p.quantityValue) / order.adjustedMerchandizeTotalPrice.value;
            var aditionalDiscount = 0;
            // if (orderDiscount != 0) {
            //     //aditionalDiscount = porcToOrderDiscount * orderDiscount;
            //     aditionalDiscount = porcToOrderDiscount * 50;
            //     pDiscount += aditionalDiscount;
            // }

            products.push({
                ProductCode: p.productID,
                Quantity: p.quantityValue,
                DiscName: promotionIds.toString(),
                DiscountP: getPorcentage(pDiscount, p.price.value),
                Discount: pDiscount,
            });
        });
        // var paymentInstruments = order.paymentInstruments[0];

        var firstName = "";
        var lastName = "";

        if (order.customer.authenticated) {
            firstName = order.customer.firstName;
            lastName = order.customer.lastName;
        } else {
            var customerName = order.customerName.split(" ");
            firstName = customerName
                .slice(0, customerName.length / 2)
                .join(" ");
            lastName = customerName
                .slice(customerName.length / 2, customerName.length)
                .join(" ");
        }

        var defaultShipment = order.defaultShipment;
        var paymentTransaction = order.paymentTransaction;

        var pricebook =
            order.allProductLineItems[0].product.priceModel.priceInfo.priceBook
                .ID;
        var shippingPriceAdjustment = 0;
        var allShippingPriceAdjustments =
            order.allShippingPriceAdjustments.toArray();

        allShippingPriceAdjustments.forEach((p) => {
            shippingPriceAdjustment =
                shippingPriceAdjustment + p.netPrice.value;
        });

        body = {
            account: {
                FirstName: firstName,
                LastName: lastName,
                PersonEmail: order.customerEmail,
                //Phone: defaultShipment.shippingAddress.phone,
                Phone: order.billingAddress.phone,
            },
            shippingInfo: handleShipment(
                defaultShipment,
                shippingPriceAdjustment
            ),
            paymentInfo: handlePayment(paymentTransaction),
            oppName: order.orderNo,
            cadena: "Men's Fashion",
            OrderDiscountDetailsTotal: discounts,
            descuentoOrden: orderDiscount,
            products: products,
            pricebookId: pricebook,
        };

        logger.debug("body: ", JSON.stringify(body));
        
        //Mandar orden
        salesOrderId = sendOrder(body, token);

        if (!salesOrderId.error) {
            Transaction.wrap(() => {
                order.custom.SalesCloudOrderId = salesOrderId;
            });
        } else {
            logger.error("OrderError {0}", JSON.stringify(body));
        }
    }
};
