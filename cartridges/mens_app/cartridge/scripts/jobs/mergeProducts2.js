const File = require("dw/io/File");
const FileWriter = require("dw/io/FileWriter");
const FileReader = require("dw/io/FileReader");

const execute = (args) => {
  let path = args.path;
  if (!path.startsWith("/")) path = "/" + path;
  if (!path.endsWith("/")) path = path + "/";

  let final = new File(File.IMPEX + '/src/catalog/google/ExportCatalogMens/'+args.fileName);
  let finalWriterProduct = new FileWriter(final);

  let finalPrices = new File(File.IMPEX + '/src/catalog/google/ExportPricesMens/'+args.fileName);
  let finalWriterPrices = new FileWriter(finalPrices);

  let file = new File(File.IMPEX + path + args.fileName);
  let fileReader = new FileReader(file);
  let fileString = fileReader.getString();

  let startFile = '';
  let startPrice = '<?xml version="1.0" encoding="UTF-8"?>';
  let startProduct = '<?xml version="1.0" encoding="UTF-8"?><products>';
  let endProduct = '</products>';
  let endFileProducts = '</catalog>';
  let endFilePriceBook = '</pricebook>';
  let endFilePriceBooks = '</pricebooks>';
  let auxString = '';
  let assigmentsAndAttributes = '';
  let firstPosition=fileString.indexOf('</header>');
  let lastPosition=firstPosition+9;
  startFile=fileString.slice(0,lastPosition);
  
  //Si llega path de productos crea el archivo con modificaciones
  if(path=='/src/catalogMens/products/'){
    auxString = fileString.replace(startFile, startProduct);
    auxString = auxString.replace(endFileProducts, endProduct);
    if (auxString.startsWith("<variation-attribute")) {
      assigmentsAndAttributes = auxString;
      auxString = '';
    }
    finalWriterProduct.writeLine(auxString);
    fileReader.close();
    finalWriterProduct.writeLine(assigmentsAndAttributes);
    finalWriterProduct.close();
  }
      
  //Si llega path de pricios crea el archivo con modificaciones
  if(path=='/src/catalogPricebook/StandardPriceBook/'){
    auxString = fileString.replace(startFile, startPrice);
    auxString = auxString.replace(endFilePriceBook, '');
    auxString = auxString.replace(endFilePriceBooks, '');
    finalWriterPrices.writeLine(auxString);
    fileReader.close();
    finalWriterPrices.close();
  }
};

module.exports.execute = execute;