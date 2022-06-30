const ProductMgr = require("dw/catalog/ProductMgr");
const PromotionMgr = require("dw/campaign/PromotionMgr");

const findPromotions = (productId) => {
  const apiProduct = ProductMgr.getProduct(productId);
  const promotions =
    PromotionMgr.activeCustomerPromotions.getProductPromotions(apiProduct);
  return promotions;
};

module.exports = {
  findPromotions: findPromotions,
};
