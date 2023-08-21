'use strict';

/* global request, response */

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');
var productHelper = require('*/cartridge/scripts/helpers/productHelpers.js');

var ContentMgr = require('dw/content/ContentMgr');
var product_return_info = ContentMgr.getContent('products-returns-exchange-info'); // Replace with the actual content asset ID
var product_return_info_txt = product_return_info ? product_return_info.custom.body : '';

/**
 * Render logic for the product detail component
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();

    var component = context.component;
    model.regions = PageRenderHelper.getRegionModelRegistry(component);
    var product = context.content.product;

    var params = { pid: product.ID };
    var productHelperResult = productHelper.showProductPage(params, request.pageMetaData);
    var productType = productHelperResult.product.productType;

    var template;
    if (!productHelperResult.product.online && productType !== 'set' && productType !== 'bundle') {
        template = new Template('error/notFound');
        template.setStatusCode(404);
        return template.render().text;
    }
    // While this would break if the template is specified at the product,
    // those where excluded in ProductHelper.getPageDesignerPage
    //template = new Template('experience/components/dynamic/' + productHelperResult.template);

    var customProductTemplate = 'productDetails'

    if(productHelperResult.template == 'product/productDetails'){
        customProductTemplate = 'productDetails';
    }else if(productHelperResult.template == 'product/setDetails'){
        customProductTemplate = 'setDetails';
    }else if(productHelperResult.template == 'product/bundleDetails'){
        customProductTemplate = 'bundleDetails';
    }

    template = new Template('experience/components/dynamic/customProduct/' + customProductTemplate);



    model.product = productHelperResult.product;
    model.product_return_info_txt = product_return_info_txt;
    model.addToCartUrl = productHelperResult.addToCartUrl;
    model.resources = productHelperResult.resources;
    model.breadcrumbs = productHelperResult.breadcrumbs;
    model.canonicalUrl = productHelperResult.canonicalUrl;
    model.schemaData = productHelperResult.schemaData;

    // instruct 24 hours relative pagecache
    var expires = new Date();
    expires.setDate(expires.getDate() + 1); // this handles overflow automatically
    response.setExpires(expires);
    response.setVaryBy('price_promotion');

    return template.render(model).text;
};
