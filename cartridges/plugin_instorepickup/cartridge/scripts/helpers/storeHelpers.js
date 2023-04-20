'use strict';

var base = module.superModule;

/**
 * Searches for stores and creates a plain object of the stores returned by the search
 * @param {string} radius - selected radius
 * @param {string} postalCode - postal code for search
 * @param {string} lat - latitude for search by latitude
 * @param {string} long - longitude for search by longitude
 * @param {Object} geolocation - geolocation object with latitude and longitude
 * @param {boolean} showMap - boolean to show map
 * @param {dw.web.URL} url - a relative url
 * @param {[Object]} products - an array of product ids to quantities that needs to be filtered by.
 * @returns {Object} a plain object containing the results of the search
 */
function getStores(radius, postalCode, lat, long, geolocation, showMap, url, products) {
    var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');

    var storesModel = base.getStores(radius, postalCode, lat, long, geolocation, showMap, url);

    if (products) {
        storesModel.stores = storesModel.stores.filter(function (store) {
            var storeInventoryListId = store.inventoryListId;
            if (storeInventoryListId) {
                var storeInventory = ProductInventoryMgr.getInventoryList(storeInventoryListId);
                return products.every(function (product) {
                    var inventoryRecord = storeInventory ? storeInventory.getRecord(product.id) : null;
                    return inventoryRecord && inventoryRecord.ATS.value >= product.quantity;
                });
            }
            return false;
        });
    }

    return storesModel;
}

/**
 * Collects all the cart and new selected product array for inventory
 * @returns {Array} productArray
 */
function getProductsListAsJson() {
    var BasketMgr = require('dw/order/BasketMgr'),
        productArray = [],
        basket = BasketMgr.getCurrentBasket();
    try {
        if (!empty(basket) && basket.getProductLineItems().size() > 0) {
            require('*/cartridge/scripts/util/collections').forEach(basket.productLineItems, function (lineItem) {
                productArray.push( { id: lineItem.productID, quantity: lineItem.quantity.value } );
            });
        }
        return productArray;
    } catch (error) {
        return null;
    }
}

module.exports = {
    getStores: getStores,
    getProductsListAsJson: getProductsListAsJson
};
Object.keys(base).forEach(function (prop) {
    // eslint-disable-next-line no-prototype-builtins
    if (!module.exports.hasOwnProperty(prop)) {
        module.exports[prop] = base[prop];
    }
});
