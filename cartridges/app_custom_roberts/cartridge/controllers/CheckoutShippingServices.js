'use strict';

/**
 * @namespace CheckoutShippingServices
 */

var server = require('server');
server.extend(module.superModule)

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');


/**
 * CheckoutShippingServices-SelectShippingMethod : The CheckoutShippingServices-SelectShippingMethod endpoint saves the selected shipping method to the basket
 * @name Base/CheckoutShippingServices-SelectShippingMethod
 * @function
 * @memberof CheckoutShippingServices
 * @param {middleware} - server.middleware.https
 * @param {querystringparameter} - shipmentUUID - the universally unique identifier of the shipment
 * @param {querystringparameter} - methodID - the selected shipping method id
 * @param {httpparameter} - firstName - shipping address input field, shopper's shipping first name
 * @param {httpparameter} - lastName - shipping address input field, shopper's last name
 * @param {httpparameter} - address1 - shipping address input field, address line 1
 * @param {httpparameter} - address2 - shipping address input field address line 2
 * @param {httpparameter} - city - shipping address input field, city
 * @param {httpparameter} - postalCode -  shipping address input field, postal code (or zipcode)
 * @param {httpparameter} - stateCode - shipping address input field, state code (Not all locales have state code)
 * @param {httpparameter} - countryCode -  shipping address input field, country
 * @param {httpparameter} - phone - shipping address input field, shopper's phone number
 * @param {httpparameter} - shipmentUUID - the universally unique identifier of the shipment
 * @param {httpparameter} - methodID - The selected shipping method id
 * @param {httpparameter} - isGift - Checkbox that is for determining whether or not this is a gift
 * @param {httpparameter} - giftMessage - text area for gift message
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.replace('SelectShippingMethod', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var Transaction = require('dw/system/Transaction');
    var AccountModel = require('*/cartridge/models/account');
    var OrderModel = require('*/cartridge/models/order');
    var URLUtils = require('dw/web/URLUtils');
    var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');
    var Locale = require('dw/util/Locale');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });
        return next();
    }

    var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
    var shippingMethodID = req.querystring.methodID || req.form.methodID || req.body;
    var shipment;
    if (shipmentUUID) {
        shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
    } else {
        shipment = currentBasket.defaultShipment;
    }

    var viewData = res.getViewData();
    viewData.address = ShippingHelper.getAddressFromRequest(req);
    viewData.isGift = req.form.isGift === 'true';
    viewData.giftMessage = req.form.isGift ? req.form.giftMessage : null;
    res.setViewData(viewData);

    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var shippingData = res.getViewData();
        var address = shippingData.address;

        try {
            Transaction.wrap(function () {
                var shippingAddress = shipment.shippingAddress;

                if (!shippingAddress) {
                    shippingAddress = shipment.createShippingAddress();
                }

                shippingAddress.setFirstName(address.firstName || '');
                shippingAddress.setLastName(address.lastName || '');
                shippingAddress.setAddress1(address.address1 || '');
                shippingAddress.setAddress2(address.address2 || '');
                shippingAddress.setCity(address.city || '');
                shippingAddress.setPostalCode(address.postalCode || '');
                shippingAddress.setStateCode(address.stateCode || '');
                shippingAddress.setCountryCode(address.countryCode || '');
                shippingAddress.setPhone(address.phone || '');

                ShippingHelper.selectShippingMethod(shipment, shippingMethodID);

                basketCalculationHelpers.calculateTotals(currentBasket);
            });
        } catch (err) {
            res.setStatusCode(500);
            res.json({
                error: true,
                errorMessage: Resource.msg('error.cannot.select.shipping.method', 'cart', null)
            });

            return;
        }

        COHelpers.setGift(shipment, shippingData.isGift, shippingData.giftMessage);

        var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
        var currentLocale = Locale.getLocale(req.locale.id);

        var basketModel = new OrderModel(
            currentBasket,
            { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
        );

        res.json({
            customer: new AccountModel(req.currentCustomer),
            order: basketModel
        });
    });

    return next();
});

module.exports = server.exports();
