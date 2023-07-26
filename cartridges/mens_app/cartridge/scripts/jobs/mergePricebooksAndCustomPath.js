var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var FileReader = require("dw/io/FileReader");

module.exports.execute = (args) => {
  let dir = new File(File.IMPEX + args.path);
  let final = new File(File.IMPEX + args.pathSaveFileName + args.fileName);
  let finalWritter = new FileWriter(final);
  let startFile =
    '<?xml version="1.0" encoding="UTF-8"?><pricebooks xmlns="http://www.demandware.com/xml/impex/pricebook/2006-10-31"><pricebook><header pricebook-id="' + args.pricebookID + '"><currency>MXN</currency><display-name xml:lang="x-default">'+args.pricebookName+'</display-name><description xml:lang="x-default">'+args.pricebookName+'</description><online-flag>true</online-flag></header><price-tables>';

  let endFile = "</price-tables></pricebook></pricebooks>";
  let dirList = dir.listFiles().iterator();

  let file;
  let finalString = "";
  let auxString = "";
  let isFirst = true;

  while (dirList.hasNext()) {
    file = FileReader(dirList.next());

    auxString = file.readString().replace(startFile, "");
    auxString = auxString.replace(endFile, "");

    if (isFirst) {
      auxString = startFile + auxString;
      isFirst = false;
    }

    finalWritter.writeLine(auxString);
    file.close();
  }
  finalWritter.writeLine(endFile);
  finalWritter.close();
};
