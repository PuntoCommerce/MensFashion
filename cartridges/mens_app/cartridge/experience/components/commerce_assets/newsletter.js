"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");

// var URLUtils = require("dw/web/URLUtils");
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");

/**
 * Render logic for storefront.topBar component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var content = context.content;

  model.textTop = content.textTop;
  model.image = ImageTransformation.getScaledImage(content.image);
  model.contentText = content.contentText || "";
  model.formPosition = content.formPosition;

  return new Template(
    "experience/components/commerce_assets/newsletter"
  ).render(model).text;
};
