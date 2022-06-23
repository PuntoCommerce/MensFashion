"use strict";

var Template = require("dw/util/Template");
var HashMap = require("dw/util/HashMap");
var PageRenderHelper = require("*/cartridge/experience/utilities/PageRenderHelper.js");

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

  let active = false;
  const checkActive = (name) => {
    if (name && !active) {
      active = true;
      return "active";
    }
    return "";
  };

  model.regions = PageRenderHelper.getRegionModelRegistry(component);
  model.content = [
    {
      name: content.tab1,
      content: model.regions.content1,
      id: "navtaba",
      active: checkActive(content.tab1),
    },
    {
      name: content.tab2,
      content: model.regions.content2,
      id: "navtabb",
      active: checkActive(content.tab2),
    },
    {
      name: content.tab3,
      content: model.regions.content3,
      id: "navtabc",
      active: checkActive(content.tab3),
    },
    {
      name: content.tab4,
      content: model.regions.content4,
      id: "navtabd",
      active: checkActive(content.tab4),
    },
    {
      name: content.tab5,
      content: model.regions.content5,
      id: "navtabe",
      active: checkActive(content.tab5),
    },
  ];

  return new Template("experience/components/commerce_layouts/navTabs").render(
    model
  ).text;
};
