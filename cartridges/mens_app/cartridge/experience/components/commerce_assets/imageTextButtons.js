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
  model.text = content.text;

  model.buttons = [
    {
      active: content.text1 && content.url1 ? true : false,
      text: content.text1,
      url: content.url1,
    },
    {
      active: content.text2 && content.url2 ? true : false,
      text: content.text2,
      url: content.url2,
    },
    {
      active: content.text3 && content.url3 ? true : false,
      text: content.text3,
      url: content.url3,
    },
  ];

  return new Template(
    "experience/components/commerce_assets/imageTextButtons"
  ).render(model).text;
};
