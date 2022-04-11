"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");

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

  model.bannerMessage = content.bannerMessage;
  model.bannerMessageResponsive = content.bannerMessageResponsive;

  return new Template("experience/components/commerce_assets/topBar").render(
    model
  ).text;
};
