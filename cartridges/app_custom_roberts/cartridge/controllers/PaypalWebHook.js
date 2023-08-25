var server = require("server");
const Transaction = require("dw/system/Transaction");
const Order = require("dw/order/Order");
const OrderMgr = require("dw/order/OrderMgr");
const paypalConstants = require("*/cartridge/scripts/util/paypalConstants");

const Logger = require('dw/system/Logger');

const {
    updateOrderDetails,
    getBillingAgreementToken,
    createBillingAgreement,
    getOrderDetails,
    cancelBillingAgreement,
    exchangeAuthCodeForAccessToken,
    getPaypalCustomerInfo,
} = require("*/cartridge/scripts/paypal/paypalApi");

server.post("Callback", function (req, res, next) {
    var responseObject = {};

    var whEvent = JSON.parse(request.httpParameterMap.requestBodyAsString);
    var eventType = whEvent.event_type;
    var eventResource = whEvent.resource;

    var orderNo = eventResource.invoice_id; //SFCC Order Number like 00000801
    var paymentStatus = eventResource.status;
    var template = "paypal-webhook";

    Logger.warn('custom_vinit', JSON.stringify(whEvent));
    Logger.warn(JSON.stringify(whEvent));
    Logger.warn('custom_vinit_whEvent', whEvent);

    if (eventType == paypalConstants.PAYMENT_CAPTURE_COMPLETED) {
        // worked update payment status

        Transaction.begin();
        const order = OrderMgr.getOrder(orderNo);

        var msgPaymentStatus = "paid";
        var msgPaymentReport = "paid";

        order.custom.paymentStatus = " [ " + msgPaymentStatus + " ]";
        order.custom.paymentReport = " [ " + msgPaymentReport + " ]";
        order.addNote("PayPal payment response", " [ paid ] ");

        order.setPaymentStatus(Order.PAYMENT_STATUS_PAID);
        Transaction.commit();

        // worked update payment status

        responseObject.success = true;
    } else {
        //other callbacks

        responseObject.success = false;
    }

    responseObject.orderNo = orderNo;
    responseObject.eventType = eventType;
    responseObject.paymentStatus = paymentStatus;

    res.json(responseObject);
    next();

    // worked update payment status

    // Transaction.begin();
    // const order = OrderMgr.getOrder("00000801");

    // properties.data = order;

    // var msgPaymentStatus = 'paid';
    // var msgPaymentReport = 'paid';

    // order.custom.paymentStatus = " [ " + msgPaymentStatus + " ]";
    // order.custom.paymentReport = " [ " + msgPaymentReport + " ]";
    // order.addNote(
    //     "PayPal payment response", " [ paid ] "
    // );

    // order.setPaymentStatus(Order.PAYMENT_STATUS_PAID);
    // Transaction.commit();

    // worked update payment status

    // var response = getOrderDetails({
    //     custom: {
    //         paypalOrderID: '9GC32192GR602041M'
    //     }
    // });

    //res.json(response);
    //next();
});

module.exports = server.exports();
