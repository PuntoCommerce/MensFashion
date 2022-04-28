"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");

var URLUtils = require("dw/web/URLUtils");
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");

/**
 * Render logic for storefront.promotionCard component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var content = context.content;

  model.image = ImageTransformation.getScaledImage(content.image);
  model.title = content.title;
  model.subtitle = content.subtitle;
  model.url = URLUtils.url(content.url);
  model.cardPosition = content.cardPosition;

  return new Template(
    "experience/components/commerce_assets/promotionCard"
  ).render(model).text;
};
