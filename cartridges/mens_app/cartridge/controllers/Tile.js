"use strict";

const server = require("server");
server.extend(module.superModule);

const {
  findPromotions,
  findAttribiutes,
} = require("*/cartridge/scripts/helpers/hightLightHelper");

server.append("Show", (req, res, next) => {
  const viewData = res.getViewData();
  viewData.product.promotions = findPromotions(viewData.product.id);
  viewData.product.customAttributes = findAttribiutes(viewData.product.id);

  next();
});

module.exports = server.exports();