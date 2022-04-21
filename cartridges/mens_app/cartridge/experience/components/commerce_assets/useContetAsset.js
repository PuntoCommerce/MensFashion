'use strict';

/**
 * Script file for rendering an content asset component
 */

/* Initialize constants */
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');


/**
 * Render logic for content asset in a page designer component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @returns {string} The template to be displayed
 */

module.exports.render = function (context) {
    var content = context.content;
    var model = new HashMap();

    model.assetID = content.assetID;

    return new Template('experience/components/commerce_assets/useContentAsset').render(model).text;
};
