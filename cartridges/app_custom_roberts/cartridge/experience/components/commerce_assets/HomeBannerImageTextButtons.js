"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");

/**
 * Render logic for the storefront.imageNoMargin component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */

module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var content = context.content;

  model.backgroundImage = ImageTransformation.getScaledImage(
    content.backgroundImage
  );

  model.mobbackgroundImage = ImageTransformation.getScaledImage(
    content.mobbackgroundImage
  );
  
  model.bannerTextOne = content.bannerTextOne ? content.bannerTextOne : "";
  model.bannerTextTwo = content.bannerTextTwo ? content.bannerTextTwo : "";

  model.selectTextlocation = content.selectTextlocation ? content.selectTextlocation : "";
  
  model.buttonText = content.buttonText ? content.buttonText : "";
  model.buttonUrl = content.buttonUrl ? content.buttonUrl : "";

  return new Template(
    "experience/components/commerce_assets/HomeBannerImageTextButtons"
  ).render(model).text;
};
