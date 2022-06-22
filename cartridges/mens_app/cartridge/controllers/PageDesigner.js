"use strict";

const server = require("server");
server.extend(module.superModule);

server.replace("CommerceAssets_ProductTile", (req, res, next) => {
  var URLUtils = require("dw/web/URLUtils");
  var ProductFactory = require("*/cartridge/scripts/factories/product");

  var context = JSON.parse(req.querystring.data);
  context.product = ProductFactory.get({
    pview: context.pview,
    pid: context.productID,
  });
  context.urls = {
    product: URLUtils.url("Product-Show", "pid", context.product.id)
      .relative()
      .toString(),
  };

  res.render("product/productTile.isml", context);

  next();
});

module.exports = server.exports();
