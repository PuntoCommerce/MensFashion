"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var PageRenderHelper = require("*/cartridge/experience/utilities/PageRenderHelper.js");
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");


/**
 * Render logic for the storefront.1 Row x 2 Col (Mobile) 1 Row x 2 Col (Desktop) layout
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var content = context.content;

  model.heading = content.heading;

  model.imageCat1 = ImageTransformation.getScaledImage(
    content.imageCat1
  );
  model.imageCat2 = ImageTransformation.getScaledImage(
    content.imageCat2
  );
  model.imageCat3 = ImageTransformation.getScaledImage(
    content.imageCat3
  );

  model.mobimageCat1 = ImageTransformation.getScaledImage(
    content.mobimageCat1
  );
  model.mobimageCat2 = ImageTransformation.getScaledImage(
    content.mobimageCat2
  );
  model.mobimageCat3 = ImageTransformation.getScaledImage(
    content.mobimageCat3
  );
  
  model.selectCategroyGrid = content.selectCategroyGrid;
  
  model.selectMobileCategroyGrid = content.selectMobileCategroyGrid;

  model.textCat1 = content.textCat1;
  model.textCat2 = content.textCat2;
  model.textCat3 = content.textCat3;

  model.urlCat1 = content.urlCat1;
  model.urlCat2 = content.urlCat2;
  model.urlCat3 = content.urlCat3;

  return new Template(
    "experience/components/commerce_layouts/visualCategoryGrid"
  ).render(model).text;
};
