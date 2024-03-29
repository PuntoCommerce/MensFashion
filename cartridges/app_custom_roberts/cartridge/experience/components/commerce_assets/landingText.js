'use strict';

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');


/**
 * Render logic for storefront.imageAndText component.
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commcerce Cloud Plattform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();
    var content = context.content;

    model.text = content.text ? content.text : null;
    model.fontSize = content.fontSize ? content.fontSize : '20px';
    model.textAlign = content.textAlign ? content.textAlign : 'left';
    model.marginBottom = content.marginBottom ? content.marginBottom : '1';
    model.marginTop = content.marginTop ? content.marginTop : '1';

    return new Template('experience/components/commerce_assets/landingText').render(model).text;
};
