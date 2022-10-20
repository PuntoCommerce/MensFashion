var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var FileReader = require("dw/io/FileReader");

module.exports.execute = () => {
  let dir = new File(File.IMPEX + "/src/catalogMens/products");
  let final = new File(File.IMPEX + "/src/catalog/finalProducts.xml");
  let finalWritter = new FileWriter(final);
  let startFile =
    '<?xml version="1.0" encoding="UTF-8"?><catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="storefront-catalog-m-en"><header><image-settings><internal-location base-path="/" /><view-types><view-type>large</view-type><view-type>medium</view-type><view-type>small</view-type><view-type>swatch</view-type></view-types><alt-pattern>${productname}</alt-pattern><title-pattern>${productname}</title-pattern></image-settings></header>';

  let endFile = "</catalog>";
  let dirList = dir.listFiles().iterator();

  let file;
  let finalString = "";
  let auxString = "";
  let isFirst = true;
  let assigmentsAndAttributes = "";

  while (dirList.hasNext()) {
    file = FileReader(dirList.next());

    auxString = file.readString().replace(startFile, "");
    auxString = auxString.replace(endFile, "");

    if (auxString.startsWith("<variation-attribute")) {
      assigmentsAndAttributes = auxString;
      auxString = "";
    }

    if (isFirst) {
      auxString = startFile + auxString;
      isFirst = false;
    }

    finalWritter.writeLine(auxString);
    file.close();
  }
  finalWritter.writeLine(assigmentsAndAttributes);
  finalWritter.writeLine(endFile);
  finalWritter.close();
};
