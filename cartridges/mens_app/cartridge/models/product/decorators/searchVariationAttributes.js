"use strict";

var ATTRIBUTE_NAME = "color";
var collections = require("*/cartridge/scripts/util/collections");
var URLUtils = require("dw/web/URLUtils");

module.exports = function (object, hit) {
  Object.defineProperty(object, "variationAttributes", {
    enumerable: true,
    value: (function () {
      var colors = hit.getRepresentedVariationValues(ATTRIBUTE_NAME);

      return [
        {
          attributeId: "color",
          id: "color",
          swatchable: true,
          values: collections.map(colors, function (color) {
            return {
              id: color.ID,
              description: color.description,
              displayValue: color.displayValue,
              value: color.value,
              selectable: true,
              selected: true,

              url: URLUtils.url(
                "Product-Show",
                "pid",
                hit.productID,
                "dwvar_" + hit.productID + "_color",
                color.value
              ).toString(),
            };
          }),
        },
      ];
    })(),
  });
};
