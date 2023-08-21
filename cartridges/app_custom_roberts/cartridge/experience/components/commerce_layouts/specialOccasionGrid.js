"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var PageRenderHelper = require("*/cartridge/experience/utilities/PageRenderHelper.js");
var productHelper = require('*/cartridge/scripts/helpers/productHelpers.js');
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");

/**
 * Render logic for the storefront.1 Row x 2 Col (Mobile) 1 Row x 2 Col (Desktop) layout
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */


const getProduct = (product) => {
  var params = { pid: product.ID };
  var productHelperResult = productHelper.showProductPage(params, request.pageMetaData);
  return productHelperResult;
};

module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var content = context.content;

  model.rightSideImage = ImageTransformation.getScaledImage(
    content.rightSideImage
  );
  model.mobSideImage = ImageTransformation.getScaledImage(
    content.mobSideImage
  );
  model.headTitle = content.headTitle;
  model.headSubTitle = content.headSubTitle;
  model.description = content.description;
  model.buttonText = content.buttonText;
  model.buttonUrl = content.buttonUrl;

  //for dynamic products
  var product = context.content.product1;
  var product2 = context.content.product2;

  var productHelperResult = getProduct(product);
  var productHelperResult2 = getProduct(product2);

  var productType = productHelperResult.product.productType;

  model.product = productHelperResult.product;
  model.addToCartUrl = productHelperResult.addToCartUrl;
  model.resources = productHelperResult.resources;
  model.breadcrumbs = productHelperResult.breadcrumbs;
  model.canonicalUrl = productHelperResult.canonicalUrl;
  model.schemaData = productHelperResult.schemaData;

  model.product2 = productHelperResult2.product;
  model.addToCartUrl2 = productHelperResult2.addToCartUrl;
  model.resources2 = productHelperResult2.resources;
  model.breadcrumbs2 = productHelperResult2.breadcrumbs;
  model.canonicalUrl2 = productHelperResult2.canonicalUrl;
  model.schemaData2 = productHelperResult2.schemaData;

  return new Template(
    "experience/components/commerce_layouts/specialOccasionGrid"
  ).render(model).text;
};
