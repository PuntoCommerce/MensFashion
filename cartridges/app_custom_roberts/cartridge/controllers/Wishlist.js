'use strict';

var server = require('server');
server.extend(module.superModule);

var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var ProductList = require('dw/customer/ProductList');
var PAGE_SIZE_ITEMS = 15;

server.replace('AddProduct', function (req, res, next) {
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 });
    var pid = req.body;
    var optionId = req.form.optionId || null;
    var optionVal = req.form.optionVal || null;

    var config = {
        qty: 1,
        optionId: optionId,
        optionValue: optionVal,
        req: req,
        type: 10
    };
    var errMsg = productListHelper.itemExists(list, pid, config) ? Resource.msg('wishlist.addtowishlist.exist.msg', 'wishlist', null) :
        Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null);
    var success = '';
    if(productListHelper.itemExists(list, pid, config)){
        productListHelper.removeItem(req.currentCustomer.raw, pid,config);
        errMsg = Resource.msg('wishlist.remove.success', 'wishlist', null);
    }
    else{
        success = productListHelper.addItem(list, pid, config);
    }
    
    if (success) {
        res.json({
            success: true,
            pid: pid,
            msg: Resource.msg('wishlist.addtowishlist.success.msg', 'wishlist', null)
        });
    } else {
        res.json({
            error: true,
            pid: pid,
            msg: errMsg,
            product: 'remove' 
        });
    }
    next();
});

server.replace('RemoveProductAccount', function (req, res, next) {
    productListHelper.removeItem(req.currentCustomer.raw, req.querystring.pid, { req: req, type: ProductList.TYPE_WISH_LIST });
    var wishListAccount = require('*/cartridge/models/account/wishListAccount');
    var apiWishList = productListHelper.getList(req.currentCustomer.raw, { type: ProductList.TYPE_WISH_LIST });
    var wishlistAccountModel = {};
    wishListAccount(wishlistAccountModel, apiWishList);
    var areItemsPresentInWishlist = wishlistAccountModel.wishlist.length !== 0;

    res.render('account/wishlist/listCards', {
        account: {
            wishlist: wishlistAccountModel.wishlist
        },
        socialLinks: areItemsPresentInWishlist
    });

    res.json({
        success: true,
        msg: Resource.msg('wishlist.remove.success', 'wishlist', null)
    })

    next();
});

server.post('isAdded', function (req, res, next) {
    var result = {};
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type:10 });
    var WishlistModel = require('*/cartridge/models/productList');
    var wishlistModel = new WishlistModel(
        list,
        {
            type: 'wishlist',
            publicView: req.querystring.publicView || false,
            pageSize: PAGE_SIZE_ITEMS,
            pageNumber: req.querystring.pageNumber || 1
        }
    ).productList;
   
    result.list = wishlistModel;
    var pid = JSON.parse(req.body);
    var content =[]
    result.list.items.map(function(value){
        if(value.pid==pid.pid){
            content.push(value.pid);
        }
    });
  
    res.json({isAdded : content.length});
    next();
});

module.exports = server.exports();
