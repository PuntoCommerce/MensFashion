'use strict';

var base = module.superModule;

var collections = require('*/cartridge/scripts/util/collections');
/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @param {Object} [address] - optional address object
 * @returns {dw.util.Collection} an array of ShippingModels
 */
function getApplicableShippingMethods(shipment, address) {
    var ShippingMgr = require('dw/order/ShippingMgr');
    var ShippingMethodModel = require('*/cartridge/models/shipping/shippingMethod');

    if (!shipment) return null;

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);

    var shippingMethods;
    if (address) {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods(address);
    } else {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods();
    }

    // Move Pickup in store method to the end of the list
    var pickupInstoreMethod = collections.find(shippingMethods, function (method) {
        return method.custom.storePickupEnabled;
    });
    if (pickupInstoreMethod) {
        shippingMethods.remove(pickupInstoreMethod);
        shippingMethods.add(pickupInstoreMethod);
    }

    return shippingMethods.toArray().map(function (shippingMethod) {
        return new ShippingMethodModel(shippingMethod, shipment);
    });
}

/**
 * Mark a shipment to be picked up instore
 * @param {dw.order.Shipment} shipment - line item container to be marked for pickup instore
 * @param {string} storeId - Id of the store for shipment to be picked up from.
 */
function markShipmentForPickup(shipment, storeId) {
    var StoreMgr = require('dw/catalog/StoreMgr');
    var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
    var Transaction = require('dw/system/Transaction');

    var store = StoreMgr.getStore(storeId);
    var storeInventory = ProductInventoryMgr.getInventoryList(
        store.custom.inventoryListId
    );
    Transaction.wrap(function () {
        collections.forEach(shipment.productLineItems, function (lineItem) {
            lineItem.custom.fromStoreId = storeId; // eslint-disable-line no-param-reassign
            lineItem.setProductInventoryList(storeInventory);
        });
        shipment.custom.fromStoreId = storeId; // eslint-disable-line no-param-reassign
    });
}

/**
 * Remove pickup instore indicators from the shipment
 * @param {dw.order.Shipment} shipment - Shipment to be marked
 */
function markShipmentForShipping(shipment) {
    var Transaction = require('dw/system/Transaction');

    Transaction.wrap(function () {
        collections.forEach(shipment.productLineItems, function (lineItem) {
            lineItem.custom.fromStoreId = null; // eslint-disable-line no-param-reassign
            lineItem.setProductInventoryList(null);
        });
        shipment.custom.fromStoreId = null; // eslint-disable-line no-param-reassign
    });
}

/**
 * Remove pickup instore indicators from the shipment
 * @param {String} shippingMethodtId - shippingMethodtId
 * @param {dw.order.Basket} currentBasket - currentBasket
 */
function markAllShipmentsForShippingMethod(shipmentId, currentBasket) {
    var ShippingMgr = require('dw/order/ShippingMgr');
    var shippingMethods = ShippingMgr.getAllShippingMethods();
    var Transaction = require('dw/system/Transaction');
    Transaction.wrap(function () {
        collections.forEach(shippingMethods, function (shippingMethod) {
            if (shippingMethod && shippingMethod.ID === shipmentId) {
                collections.forEach(currentBasket.shipments, function (itemShipment) {
                    itemShipment.setShippingMethod(shippingMethod)
                });
            }
        });
        require("*/cartridge/scripts/helpers/basketCalculationHelpers").calculateTotals(currentBasket);
    });
}

/**
 * resturns selected shipping method shipment on checkout shipping method update
 * @param {String} shippingMethodtId - shippingMethodtId
 */
function getAllShipmentsForShippingMethod(shippingMethodtId) {
    var ShippingMgr = require('dw/order/ShippingMgr');
    var shippingMethods = ShippingMgr.getAllShippingMethods();
    var shippingMethod = collections.find(shippingMethods, function (method) {
        return method.ID === shippingMethodtId;
    });
    return shippingMethod;
}

//Copies shipping address from one shipment to another
function copyShippingAddress(fromShipment, toShipment) {
    try {
        var fromShipmentShippingAddress = fromShipment.getShippingAddress();
        if (fromShipmentShippingAddress) {
            var toShipmentShippingAddress = null;
            if(toShipment.shippingAddress == null) {
                toShipmentShippingAddress = toShipment.createShippingAddress();
            } else {
                toShipmentShippingAddress = toShipment.shippingAddress;
            }
            toShipmentShippingAddress.setFirstName(fromShipmentShippingAddress.firstName);
            toShipmentShippingAddress.setLastName(fromShipmentShippingAddress.lastName);
            toShipmentShippingAddress.setAddress1(fromShipmentShippingAddress.address1);
            toShipmentShippingAddress.setAddress2(fromShipmentShippingAddress.address2);
            toShipmentShippingAddress.setCity(fromShipmentShippingAddress.city);
            toShipmentShippingAddress.setPostalCode(fromShipmentShippingAddress.postalCode);
            toShipmentShippingAddress.setStateCode(fromShipmentShippingAddress.stateCode);
            toShipmentShippingAddress.setCountryCode(fromShipmentShippingAddress.countryCode);
            if(fromShipmentShippingAddress.phone && fromShipmentShippingAddress.phone.length > 0) {
                toShipmentShippingAddress.setPhone(fromShipmentShippingAddress.phone.replace(/[^a-zA-Z0-9]/g, ''));
            }
        }
    } catch (error) {
        
    }
}

/**
 * set default to all lineitems make once shioment remove others
 * @param {dw.order.Basket} currentBasket - currentBasket
 */
function markMultipleShipmentsToOne(currentBasket) {
    var defaultShipment =  currentBasket.defaultShipment;
    var Transaction = require('dw/system/Transaction');
    Transaction.wrap(function () {
        collections.forEach(currentBasket.shipments, function (shipment) {
            if (!shipment.isDefault()) {
                collections.forEach(shipment.productLineItems, function (lineItem) {
                    lineItem.setShipment(defaultShipment);
                });
                if (shipment.shippingMethod != null) {
                    defaultShipment.setShippingMethod(shipment.shippingMethod);
                }
                //copy shipping address
                copyShippingAddress(shipment, defaultShipment);
                currentBasket.removeShipment(shipment);
            }
        });
    });
}

module.exports = {
    getApplicableShippingMethods: getApplicableShippingMethods,
    markShipmentForPickup: markShipmentForPickup,
    markShipmentForShipping: markShipmentForShipping,
    markAllShipmentsForShippingMethod: markAllShipmentsForShippingMethod,
    getAllShipmentsForShippingMethod: getAllShipmentsForShippingMethod,
    copyShippingAddress: copyShippingAddress,
    markMultipleShipmentsToOne: markMultipleShipmentsToOne
};
Object.keys(base).forEach(function (prop) {
    // eslint-disable-next-line no-prototype-builtins
    if (!module.exports.hasOwnProperty(prop)) {
        module.exports[prop] = base[prop];
    }
});
