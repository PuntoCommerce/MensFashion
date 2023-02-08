const FileProduct = require("dw/io/File");
const FileWriterProduct = require("dw/io/FileWriter");
const FileReaderProduct = require("dw/io/FileReader");

const execute = (args) => {
  let path = args.path;
  if (!path.startsWith("/")) path = "/" + path;
  if (!path.endsWith("/")) path = path + "/";

  let final = new FileProduct(FileProduct.IMPEX + '/src/catalog/google/ExportCatalogMens/'+args.fileName);
  let finalWriterProduct = new FileWriterProduct(final);

  let filePS = new FileProduct(FileProduct.IMPEX + path + args.fileName);

  let startFileProduct = '';
  let startProduct = '<?xml version="1.0" encoding="UTF-8"?><products>';
  let endProduct = '</products>';
  let endFileProducts = '</catalog>';
  let auxStringPS = '';
  let assigmentsAndAttributes = '';
  

  let fileReaderP = new FileReaderProduct(filePS);
  let fileStringProduct = fileReaderP.getString();
  let firstPositionProduct=fileStringProduct.indexOf('</header>');
  let lastPositionProduct=firstPositionProduct+9;
  startFileProduct=fileStringProduct.slice(0,lastPositionProduct);

  auxStringPP = fileStringProduct.replace(startFileProduct, startProduct);
  auxStringPP = auxStringPP.replace(endFileProducts, endProduct);
  if (auxStringPP.startsWith("<variation-attribute")) {
    assigmentsAndAttributes = auxStringPP;
    auxStringPP = '';
  }
  finalWriterProduct.writeLine(auxStringPP);
  fileReaderP.close();
  finalWriterProduct.writeLine(assigmentsAndAttributes);
  finalWriterProduct.close();
  
};

module.exports.execute = execute;