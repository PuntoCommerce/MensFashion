"use strict";

const server = require("server");
server.extend(module.superModule);

const {
  findPromotions,
} = require("*/cartridge/scripts/helpers/promotionHelper");

server.append("Show", (req, res, next) => {
  const viewData = res.getViewData();
  viewData.product.promotions = findPromotions(viewData.product.id);
  next();
});

module.exports = server.exports();
