var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var FileReader = require("dw/io/FileReader");

var File1 = require("dw/io/File");
var FileReader1 = require("dw/io/FileReader");
module.exports.execute = () => {
  //variables que apuntan a donde estan los xml que vamos a convertir
  let dir = new File(File.IMPEX + '/src/catalog/google/ExportCatalogMens');
  let dirPrices = new File(File.IMPEX + '/src/catalog/google/ExportPricesMens');
  let final = new File(File.IMPEX + '/src/catalog/google/catalogoMerchant.xml');
  let finalWritter = new FileWriter(final);
  let isFirst = true;
  //variables codigo
  let headerGoogle = '<?xml version="1.0"?><rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel>';
  let endGoogle = '</channel></rss>';

  var obj = new Object();
  
  let dirList =  dir.listFiles().iterator();
  let dirListPrices =  dirPrices.listFiles().iterator();
  if(dirList.hasNext()){
    if(dirListPrices.hasNext()){
    while (dirList.hasNext()) {
      while (dirListPrices.hasNext()) {
        file1 = FileReader1(dirListPrices.next());
        fileString1 = file1.readString();
        let requestXMLPrices = XML(fileString1);
        let xmlStringPrices = requestXMLPrices.toXMLString();
        let prices = XMLList(xmlStringPrices).descendants('price-table');
        let amount = prices.descendants('amount');
        let valueAmount = null
        for(let f =0; f<prices.length();f++){
          valueAmount = amount[f]; 
          let label30=prices.toString().indexOf('<price-table product-id="');
          let label31=prices.toString().indexOf('">');
          let label32=label30+25;
          var idPriceProduct = prices[f].toString().slice(label32, label31);
          obj[idPriceProduct]=valueAmount;
        }
  
      }
      //lectura de archivo.
      file = FileReader(dirList.next());
      fileString = file.readString();
      //conversion de lectuara a xml.
      let requestXML = XML(fileString);
      let xmlString = requestXML.toXMLString();
      //HeaderGoogle.
      if (isFirst) {
        finalWritter.writeLine(headerGoogle);
        isFirst = false;
      }
      
      let product = XMLList(xmlString).descendants('product');
      let brand = product.descendants('brand');
      let searchableFlag = product.descendants('searchable-flag');
      let title = product.descendants('display-name');
      let shortDescription = product.descendants('short-description');
      let onlineFlag = product.descendants('online-flag');
      let image = undefined;
  
      for(let i =0; i<product.length();i++){
        let productPosition1 = '"'+product[i]+'"';
        let label3=productPosition1.indexOf('<ean/>');
        let label8=label3-3;
        let label7=productPosition1.indexOf('<product product-id="');
        let position7 = label7+10;
  
        let positionLabel7=productPosition1.slice(position7,label8);
        let prueba=positionLabel7.indexOf('">');
        var cadena2 = positionLabel7.slice(position7, prueba);
  
        let label22=fileString.indexOf('<custom-attribute attribute-id="color">');
        let label23=fileString.indexOf('<custom-attribute attribute-id="composicion">');
        let label24=fileString.indexOf('<custom-attribute attribute-id="talla">');
        let label25=fileString.indexOf('<custom-attribute attribute-id="temporada">');
        let position22 = label22+39;
        let position23 = label23+45;
        let position24 = label24+39;
        let position25 = label25+43;
  
        let positionLabel22=fileString.slice(label22,label23);
        let positionLabel25=fileString.slice(label24,label25);
  
        let tallaEnd = positionLabel25.indexOf('</custom-attribute>');
        let cadenaTalla = positionLabel25.slice(39,tallaEnd);
        let colorEnd = positionLabel22.indexOf('</custom-attribute>');
        let cadenaColor = positionLabel22.slice(39,colorEnd);
  
        image=product[i].descendants('images');
        if(image.toString()!=''){
          image=image.elements()[0].elements().toString();
            let pos = image.toString().indexOf('<image path="');
            let aux=pos+13;
            let posend=image.toString().indexOf('"/>');
            image=image.toString().slice(aux,posend);
        }
        
         if(onlineFlag[i]==true && image[i] != undefined){
          
            finalWritter.writeLine('<item>');
            finalWritter.writeLine('<g:id>'+cadena2+'</g:id>');
            finalWritter.writeLine('<g:title>'+title[i]+'</g:title>');
            finalWritter.writeLine('<g:description>'+shortDescription[i]+'</g:description>');
            finalWritter.writeLine('<g:link>https://www.mensfashion.com.mx/'+cadena2+'.html</g:link>');
            finalWritter.writeLine('<g:image_link>https://www.mensfashion.com.mx/on/demandware.static/-/Sites-storefront-catalog-m-en/default/dwf067c8a4'+image+'</g:image_link>');
            finalWritter.writeLine('<g:availability>in stock</g:availability>');
            let priceValue;
            if(obj[cadena2]!=undefined){
              priceValue=obj[cadena2] + " MXN";
            }else{
              priceValue = 0 + " MXN";
            }
            finalWritter.writeLine('<g:price>'+priceValue+'</g:price>');
            finalWritter.writeLine('<g:brand>'+brand[i]+'</g:brand>');
            finalWritter.writeLine('<g:condition>new</g:condition>');
            finalWritter.writeLine('<g:google_product_category>Clothing &amp; Accessories</g:google_product_category>');
            if(image[i] == undefined){
              finalWritter.writeLine('<g:color>'+cadenaColor+'</g:color>');
              finalWritter.writeLine('<g:size>'+cadenaTalla+'</g:size>');
            }
            finalWritter.writeLine('</item>');
        }
      }
    }
  }
}
  
  //FinalGoogle.
  finalWritter.writeLine(endGoogle);
  finalWritter.close();
};
