var ProductMgr = require('dw/catalog/ProductMgr');
var Category = require('dw/catalog/Category');
var Catalog = require('dw/catalog/Catalog');
var ProductPriceModel = require('dw/catalog/ProductPriceModel');
var ProductPriceTable = require('dw/catalog/ProductPriceTable');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var SeekableIterator = require('dw/util/SeekableIterator');
var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var FileReader = require("dw/io/FileReader");
var Logger = require('dw/system/Logger');
Logger = Logger.getLogger('AkService', 'log');

module.exports.execute = (args) => {

  let final = new File(File.CATALOGS + "/" + args.siteNameURL + "/default/googleMerchantFinalFile.xml");
  let finalWritter = new FileWriter(final);




  
  


  let headerGoogle = '<?xml version="1.0"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel>';
  let endGoogle = '</channel></rss>';
  let title = '<title>Example - Online Store zapata</title>';
  let link = '<link>http://www.example.com</link>';
  let description = '<description>This is a sample feed containing the required and recommended attributes for a variety of different products</description>';
  

  finalWritter.writeLine(headerGoogle + title + link + description);

  //get all product from site assigned
  let productIterator = ProductMgr.queryAllSiteProducts();
  Logger.info(File.CATALOGS + "/" + args.siteNameURL + "/default/googleMerchantFinalFile.xml");
  var itera = 0;
  while (productIterator.hasNext()) {
    let itemOpen = "<item>";
    let itemClose = "</item>";
    let itemCollector = "";
    Logger.info("Numero: " + itera);
    itera = itera+1;
    
    let product = productIterator.next();
    let priceModel = product.getPriceModel();
    let productPriceMXN = priceModel.getPriceBookPrice(args.pricebookListID);

    let g_id = product.ID;
    let g_title = product.name;
    let g_description = product.shortDescription;
    let g_link = args.storeURL + product.ID + ".html"

    let g_imagelink = null
    let g_imagelinkCount = product.getImages("large");
    if(g_imagelinkCount.length > 0){
      g_imagelink = g_imagelinkCount[0].absURL;
    }

    let g_availabilityRaw = product.available;
    let g_gavailabilityFinal = "";
    if(g_availabilityRaw == true){
      g_gavailabilityFinal = "in_stock"
    }
    else{
      g_gavailabilityFinal = "out_of_stock"
    }

    let g_price = productPriceMXN + " " + productPriceMXN.currencyCode;

    let g_brand = product.brand;

    let g_google_product_category = "";
    if(args.googleProductCategoryDefault != "null"){
      g_google_product_category = args.googleProductCategoryDefault;
    }

    let Item = itemOpen;
    Item += "<g:id>"+g_id+"</g:id>";
    Item += "<g:title>"+g_title+"</g:title>";

    if(args.useDescription == true){
      Item += "<g:description>"+g_description+"</g:description>";
    }
    else{
      Item += "<g:description></g:description>";  
    }
      
    Item += "<g:link>"+g_link+"</g:link>";
    Item += "<g:image_link>"+g_imagelink+"</g:image_link>";
    Item += "<g:condition>new</g:condition>";
    Item += "<g:availability>"+g_gavailabilityFinal+"</g:availability>";
    Item += "<g:price>"+g_price+"</g:price>";
    Item += "<g:brand>"+g_brand+"</g:brand>";
    Item += "<g:google_product_category>"+g_google_product_category+"</g:google_product_category>";
    Item += "<g:mpn></g:mpn>";
    Item += "<g:gtin></g:gtin>";
    Item += itemClose;

    // itemCollector += Item
    finalWritter.writeLine(Item);
    // if(itera+1 == 1049)
    // {
    //   break;
    // }
  }

  //Close iterator for good practices
  productIterator.close();

  // let finalXMLText = headerGoogle + title + link + description + itemCollector + endGoogle;
  finalWritter.writeLine(endGoogle);



  // let finalWritter = new FileWriter(final);
  // finalWritter.writeLine(finalXMLText);
  finalWritter.close();


}