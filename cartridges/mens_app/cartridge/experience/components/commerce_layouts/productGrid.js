"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var PageRenderHelper = require("*/cartridge/experience/utilities/PageRenderHelper.js");

const getLayout = (selection) => {
  switch (selection) {
    case "Big-Item-Left":
      return { position: "left", containerStyle: "40% 20% 20%" };
      break;
    case "Big-Item-Right":
      return { position: "right", containerStyle: "20% 20% 40%" };
      break;
    case "Big-Item-Center":
      return { position: "center", containerStyle: "20% 40% 20%" };
      break;
    default:
      return { position: "left", containerStyle: "40% 20% 20%" };
      break;
  }
};

/**
 * Render logic for the storefront.2 Row x 1 Col (Mobile) 2 Row x 1 Col (Desktop) layout
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var component = context.component;
  var content = context.content;

  model.regions = PageRenderHelper.getRegionModelRegistry(component);
  model.layout = getLayout(content.layout);

  return new Template(
    "experience/components/commerce_layouts/productGrid"
  ).render(model).text;
};
