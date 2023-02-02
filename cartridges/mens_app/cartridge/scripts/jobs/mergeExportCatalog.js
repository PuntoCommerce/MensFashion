var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var FileReader = require("dw/io/FileReader");

module.exports.execute = () => {
  let dir = new File(File.IMPEX + "/src/catalog/google/ExportCatalogMens");
  let final = new File(File.IMPEX + "/src/catalog/googleMerge.xml");
  let finalWritter = new FileWriter(final);
  let startFile="";
  let headerXML='<?xml version="1.0" encoding="UTF-8"?>'+
  '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">'+
  '<xs:element name="product">'+
  '<xs:complexType>'+
  '<xs:sequence>'+
  '<xs:element name="brand"/>'+
  '</xs:sequence>'+
  '</xs:complexType>'+
  '</xs:element>';
  let endFile = "</catalog>";
  let endXml="</xs:schema>";
  let dirList = dir.listFiles().iterator();
  let file;
  let finalString = "";
  let auxString = "";
  let isFirst = true;
  let assigmentsAndAttributes = "";
  let fileString;

  while (dirList.hasNext()) {
    file = FileReader(dirList.next());

    fileString = file.readString();

    if (isFirst) {
      let firstPosition=fileString.indexOf('</header>');
      let lastPosition=firstPosition+9;
      startFile=fileString.slice(0,lastPosition);
    }

    auxString = fileString.replace(startFile, "");
    auxString = auxString.replace(endFile, "");

    if (isFirst) {
      auxString = headerXML + auxString;
      isFirst = false;
    }

    finalWritter.writeLine(auxString);
    file.close();
  }
  finalWritter.writeLine(assigmentsAndAttributes);
  finalWritter.writeLine(endXml);
  finalWritter.close();
};
