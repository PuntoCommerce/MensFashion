"use strict";

const server = require("server");
server.extend(module.superModule);

const {
    findPromotions,
    findAttribiutes,
} = require("*/cartridge/scripts/helpers/hightLightHelper");

var ProductMgr = require("dw/catalog/ProductMgr");
var money = require('dw/value/Money');
var collections = require('*/cartridge/scripts/util/collections');
var formatMoney = require('dw/util/StringUtils').formatMoney;

server.append("Show", (req, res, next) => {
    const viewData = res.getViewData();
    var promotions = findPromotions(viewData.product.id);
    viewData.product.promotions = promotions;
    viewData.product.customAttributes = findAttribiutes(viewData.product.id);
    var productId = viewData.product.id;

    // Get the product object by ID
    var product = ProductMgr.getProduct(productId);

    try {
        if (product) {
            // Product found
            if (promotions) {
                var PROMOTION_CLASS_PRODUCT = require('dw/campaign/Promotion').PROMOTION_CLASS_PRODUCT;
                var price = money.NOT_AVAILABLE;

                var promotion = collections.find(promotions, function (promo) {
                    return promo.promotionClass && promo.promotionClass.equals(PROMOTION_CLASS_PRODUCT);
                });
                if (promotion) {
                    var promotionPr = collections.findPromotions(productId)
                    var promotional_price = promotion.getPromotionalPrice(product);
                    var promotion_pr = promotionPr.getPromotionalPrice(product)
                    if (promotion_pr.value !== 0) {
                        viewData.product.hasProduct = 'yes'
                        viewData.product.promotional_price = formatMoney(promotional_price);
                        viewData.product.promotion_pr = formatMoney(promotion_pr)
                    }
                } else {
                    viewData.product.hasProduct = 'inner promotion no'
                    viewData.product.promotional_price = null;
                }
            } else {
                viewData.product.hasProduct = 'promotion no'
                viewData.product.promotional_price = null;
            }
        } else {
            // Product not found
            viewData.product.hasProduct = 'product no'
            viewData.product.promotional_price = null;
        }
    } catch (error) {
        viewData.product.hasProduct = 'in catch error'
        viewData.product.promotional_price = error;
    }
    next();
});

module.exports = server.exports();
