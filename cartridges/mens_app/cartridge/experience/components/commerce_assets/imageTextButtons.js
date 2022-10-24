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

const getComponentSize = (selection) => {
  switch (selection) {
    case "Large":
      return "1480px";
      break;
    case "Medium":
      return "782px";
      break;
    case "Small":
      return "500px";
      break;
    default:
      return "110px";
      break;
  }
};

const getItemsLayout = (selection) => {
  switch (selection) {
    case "Text-Left-Buttons-Right":
      return {
        content: "justify-content: space-around; flex-direction: row",
        buttons: "column",
      };
      break;
    case "Text-Right-Buttons-Left":
      return {
        content: "justify-content: space-around; flex-direction: row-reverse;",
        buttons: "column",
      };
      break;
    case "Center-Text-Up-Buttons-Down":
      return {
        content: "justify-content: center; flex-direction: column",
        buttons: "row",
      };
      break;
    case "Center-Text-Down-Buttons-Up":
      return {
        content: "justify-content: center; flex-direction: column-reverse",
        buttons: "row",
      };
      break;
    default:
      return {
        content: "justify-content: center; flex-direction: row",
        buttons: "column",
      };
      break;
  }
};

module.exports.render = function (context, modelIn) {
  var model = modelIn || new HashMap();
  var content = context.content;

  model.backgroundImage = ImageTransformation.getScaledImage(
    content.backgroundImage
  );
  model.backgroundImageMobile = ImageTransformation.getScaledImage(
    content.backgroundImageMobile
  );
  model.imageBrightness = content.imageBrightness ? content.imageBrightness : "100%";
  model.text = content.text ? context.text : "";
  model.layoutSize = {
    componentSize: getComponentSize(content.componentSize),
    itemsLayout: getItemsLayout(content.itemsLayout),
  };
  model.markupLayout = content.markupLayout || "center";
  model.display_button = content.display_button ? content.display_button : 'Yes';

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
