const FilePrices = require("dw/io/File");
const FileWriterPrices = require("dw/io/FileWriter");
const FileReaderPrices = require("dw/io/FileReader");

const execute = (args) => {
  let path = args.path;
  if (!path.startsWith("/")) path = "/" + path;
  if (!path.endsWith("/")) path = path + "/";

  let finalPrices = new FilePrices(FilePrices.IMPEX + '/src/catalog/google/ExportPricesMens/'+args.fileName);
  let finalWriterPrices = new FileWriterPrices(finalPrices);

  let filePP = new FilePrices(FilePrices.IMPEX + path + args.fileName);

  let startFilePrices = '';
  let startPrice = '<?xml version="1.0" encoding="UTF-8"?>';
  let endFilePriceBook = '</pricebook>';
  let endFilePriceBooks = '</pricebooks>';
  let auxStringPP = '';
  let assigmentsAndAttributes = '';
  
  let fileReaderPrices = new FileReaderPrices(filePP);
  let fileStringPrices = fileReaderPrices.getString();
  let firstPositionPrices=fileStringPrices.indexOf('</header>');
  let lastPositionPrices=firstPositionPrices+39;
  startFilePrices=fileStringPrices.slice(0,lastPositionPrices);

  auxStringPS = fileStringPrices.replace(startFilePrices, startPrice);
  auxStringPS = auxStringPS.replace(endFilePriceBook, '');
  auxStringPS = auxStringPS.replace(endFilePriceBooks, '');
  finalWriterPrices.writeLine(auxStringPS);
  fileReaderPrices.close();
  finalWriterPrices.close();
};

module.exports.execute = execute;