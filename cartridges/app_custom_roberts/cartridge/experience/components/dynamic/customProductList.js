'use strict';

/* global response */

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');
var ImageTransformation = require("*/cartridge/experience/utilities/ImageTransformation.js");
var productHelper = require('*/cartridge/scripts/helpers/productHelpers.js');

/**
 * Render logic for the product list component
 * @param {dw.experience.ComponentScriptContext} context The Component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 *
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();
    var component = context.component;
    model.component = component;
    model.regions = PageRenderHelper.getRegionModelRegistry(component);
    var content = context.content;
    model.categoryId = content.category.getID();
    model.categoryName = content.category.getDisplayName();
    
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');
    var ProductSearch = require('*/cartridge/models/search/productSearch');    

    var apiProductSearch = new ProductSearchModel();
    var params = { cgid: model.categoryId };
    apiProductSearch = searchHelper.setupSearch(apiProductSearch, params);
    // var sortingRule = ''; //apiProductSearch?.category?.defaultSortingRule?.ID;
    var sortingRule = ''; //apiProductSearch?.category?.defaultSortingRule?.ID;
    apiProductSearch.search();

    var productSearch = new ProductSearch(
        apiProductSearch,
        params,
        sortingRule,
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );
    model.productSearch = productSearch;
    model.apiProductSearch = apiProductSearch;
    model.maxSlots = 4;

    //breadcrumb
    var breadcrumbs = productHelper.getAllBreadcrumbs(
        model.categoryId,
        null,
        []
    );

    model.breadcrumbs = breadcrumbs.reverse();

    // // Component Regions
    // var gridCol = '12';
    // model.gridClassName = 'region col-6 col-sm-' + gridCol;
    // model.isEditMode = PageRenderHelper.isInEditMode();

    // // instruct 1 hour relative pagecache
    // var expires = new Date();
    // expires.setHours(expires.getHours() + 1);
    // response.setExpires(expires);
    // response.setVaryBy('price_promotion');

    //banner configuration starts

    model.selectBannerType = content.selectBannerType;

    //visual filter
    model.visualFilterText = content.visualFilterText;

    model.category1Image = ImageTransformation.getScaledImage(
        content.category1Image
    );
    model.category1Text = content.category1Text;
    model.category1Url = content.category1Url;

    model.category2Image = ImageTransformation.getScaledImage(
        content.category2Image
    );
    model.category2Text = content.category2Text;
    model.category2Url = content.category2Url;

    model.category3Image = ImageTransformation.getScaledImage(
        content.category3Image
    );
    model.category3Text = content.category3Text;
    model.category3Url = content.category3Url;

    //full banner
    model.fullBannerImage = ImageTransformation.getScaledImage(
        content.fullBannerImage
    );

    // instruct 24 hours relative pagecache
    var expires = new Date();
    expires.setDate(expires.getDate() + 1); // this handles overflow automatically
    response.setExpires(expires);
    response.setVaryBy('price_promotion');
    
    return new Template('experience/components/dynamic/customProductList/productList.isml').render(model).text;
};
