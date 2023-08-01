var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var FileReader = require("dw/io/FileReader");

module.exports.execute = (args) => {
  let dir = new File(File.IMPEX + args.path);
  let final = new File(File.IMPEX + args.pathSaveFileName + args.fileName);
  let finalWritter = new FileWriter(final);
  let listadoDir = dir.list();
  let dirListAttributosGenerales = dir.listFiles().iterator();
  let dirListAttributosDeAttributos = dir.listFiles().iterator();

  let dirCategoryAsigment = dir.listFiles().iterator();

  let startProduct = '<?xml version="1.0" encoding="UTF-8"?><catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="'+args.catalogProductID+'"><header><image-settings><internal-location base-path="/" /><view-types><view-type>large</view-type><view-type>medium</view-type><view-type>small</view-type><view-type>swatch</view-type></view-types><alt-pattern>${productname}</alt-pattern><title-pattern>${productname}</title-pattern></image-settings></header>';
  // let startProduct = '<?xml version="1.0" encoding="UTF-8"?><catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="storefront-catalog-m-en"><header><image-settings><internal-location base-path="/" /><view-types><view-type>large</view-type><view-type>medium</view-type><view-type>small</view-type><view-type>swatch</view-type></view-types><alt-pattern>${productname}</alt-pattern><title-pattern>${productname}</title-pattern></image-settings></header>';
  finalWritter.writeLine(startProduct);
  
  //Generar atributos generales y valores de atributo
  var jsonAttributesId = [];
  var jsonAttributesValues = [];
  while (dirListAttributosGenerales.hasNext()) {
    file = FileReader(dirListAttributosGenerales.next());
    fileString = file.readString();

    //Objeto
    let XMLObject = XML(fileString);
    let xmlnamespaceDeclarations = XMLObject.elements();

    let xmlCountElement = Object.keys(xmlnamespaceDeclarations).length;
    for (let i = 0; i < xmlCountElement; i++) {

      //Si es linea de atributo general
      if(xmlnamespaceDeclarations[i].toString().startsWith('<variation-attribute '))
      {
        let xmlAttributeTemp = xmlnamespaceDeclarations[i].attributes();
        let valorAttributeNameTemp = xmlAttributeTemp[0] 

        let xmlDescendantTemp = xmlnamespaceDeclarations[i].descendants();
        let valorTemp = xmlDescendantTemp[0]

        //Settear Valor General
        let addToJson = {
          key: valorAttributeNameTemp,
          value: valorTemp
        }
        var existeVal = false
        var jsonAttributesIdCount = jsonAttributesId.length;
        for (let j = 0; j < jsonAttributesIdCount; j++) {
          if (jsonAttributesId[j].key == addToJson.key && jsonAttributesId[j].value == addToJson.value){
            existeVal = true
          }
        }
        if (existeVal == false)
        {
          jsonAttributesId.push(addToJson);
        }

        //Settear attributo Values ej. morado, verde, 19 2-3 S/N, 14.5 4-5 S/N
        let xmlDescednantTempCount = Object.keys(xmlDescendantTemp).length;
        for (let x = 0; x < xmlDescednantTempCount; x++) 
        {
          if(xmlDescendantTemp[x].toString().startsWith('<variation-attribute-value '))
          {
            let attributeValue = xmlDescendantTemp[x].attributes();

            let addToJsonAttributeValue = {
              key: valorAttributeNameTemp,
              value: attributeValue[0]
            }
            
            var existeAttributeVal = false
            var jsonAttributesValuesCount = jsonAttributesValues.length;
            for (let k = 0; k < jsonAttributesValuesCount; k++) {
              if (jsonAttributesValues[k].key == addToJsonAttributeValue.key && jsonAttributesValues[k].value == addToJsonAttributeValue.value){
                existeAttributeVal = true
              }
            }
            if (existeAttributeVal == false)
            {
              jsonAttributesValues.push(addToJsonAttributeValue);
            }
          }
        }
      }
    }
  }

  //Ciclar attributos y generar archivo escribir
  for (let h = 0; h < jsonAttributesId.length; h++) {
    finalWritter.writeLine('<variation-attribute attribute-id="'+jsonAttributesId[h].key+'" variation-attribute-id="'+jsonAttributesId[h].key+'"><display-name xml:lang="x-default">'+jsonAttributesId[h].value+'</display-name>');
    finalWritter.writeLine('<variation-attribute-values>');
    for (let r = 0; r < jsonAttributesValues.length; r++) {
      if(jsonAttributesValues[r].key == jsonAttributesId[h].key)
      {
        finalWritter.writeLine('<variation-attribute-value value="'+jsonAttributesValues[r].value+'">');
        finalWritter.writeLine('<display-value xml:lang="x-default">'+jsonAttributesValues[r].value+'</display-value>');
        finalWritter.writeLine('<description xml:lang="x-default">'+jsonAttributesValues[r].value+'</description>');
        finalWritter.writeLine('</variation-attribute-value>');
      }
    }
    finalWritter.writeLine('</variation-attribute-values></variation-attribute>');
  }

  let endFileProducts = '</catalog>';
  finalWritter.writeLine(endFileProducts);
  finalWritter.close();

  //Dejar todo en una linea para que no tenga errores de saldo de linea
  let reReadFile2 = new File(File.IMPEX + args.pathSaveFileName + args.fileName);
  let reFile2 = FileReader(reReadFile2);
  let stringFile2 = reFile2.readString();
  stringFile2 = stringFile2.replace(/[\r\n]/gm, '');
  let writterFile2 = new FileWriter(reReadFile2);
  writterFile2.writeLine(stringFile2);
  writterFile2.close();




















  //Generar category assignment
  let finalCatAssig = null;
  let finalCatAssigWritter = null;
  // finalCatAssigWritter.writeLine(startProduct);

  let countDivididor = 0;
  let countCantidadDividas = 0;
  let contadorAux = 0;

  while (dirCategoryAsigment.hasNext()){
    contadorAux = contadorAux+1;
    if(countDivididor == 0){
      finalCatAssig = new File(File.IMPEX + args.pathSaveFileName + countCantidadDividas + args.fileName);
      finalCatAssigWritter = new FileWriter(finalCatAssig);
      finalCatAssigWritter.writeLine(startProduct);
    }


    file = FileReader(dirCategoryAsigment.next());
    fileString = file.readString();
    let firstPositionProduct = fileString.indexOf('<category-assignment');
    let endPositionProduct = fileString.indexOf('</catalog>');
    let stringAuxiliar = fileString.slice(firstPositionProduct, endPositionProduct);
    finalCatAssigWritter.writeLine(stringAuxiliar);

    if(dirCategoryAsigment.hasNext() == false)
    {
      finalCatAssigWritter.writeLine(endFileProducts);
      finalCatAssigWritter.close();

      let reReadFile = new File(File.IMPEX + args.pathSaveFileName + countCantidadDividas + args.fileName);
      let reFile = FileReader(reReadFile);
      let stringFile = reFile.readString();
      stringFile = stringFile.replace(/[\r\n]/gm, '');
      let writterFile = new FileWriter(reReadFile);
      writterFile.writeLine(stringFile);
      writterFile.close();
      countCantidadDividas = countCantidadDividas+1;
      countDivididor = -1;
    }
    else if(countDivididor == 20){
      finalCatAssigWritter.writeLine(endFileProducts);
      finalCatAssigWritter.close();

      let reReadFile = new File(File.IMPEX + args.pathSaveFileName + countCantidadDividas + args.fileName);
      let reFile = FileReader(reReadFile);
      let stringFile = reFile.readString();
      stringFile = stringFile.replace(/[\r\n]/gm, '');
      let writterFile = new FileWriter(reReadFile);
      writterFile.writeLine(stringFile);
      writterFile.close();
      countCantidadDividas = countCantidadDividas+1;
      countDivididor = -1;
    }
    countDivididor = countDivididor + 1;
    let testtt = '0';
  }























  // while (dirCategoryAsigment.hasNext()){
  //   file = FileReader(dirCategoryAsigment.next());
  //   fileString = file.readString();
  //   //Objeto
  //   let XMLObject = XML(fileString);
  //   let xmlnamespaceDeclarations = XMLObject.elements();
  //   let xmlCountElement = Object.keys(xmlnamespaceDeclarations).length;
  //   for (let i = 0; i < xmlCountElement; i++) {
  //     //Si es linea de atributo general
  //     if(xmlnamespaceDeclarations[i].toString().startsWith('<category-assignment '))
  //     {
  //       let variableVulnerable = xmlnamespaceDeclarations[i];
  //       let tesssto = "";
  //       let xmlDescendantTemp = xmlnamespaceDeclarations[i].descendants();
  //       let xmlDescednantTempCount = Object.keys(xmlDescendantTemp).length;
  //       for (let x = 0; x < xmlDescednantTempCount; x++) 
  //       {
          
  //       }
      
  //     }
  //   }



  //   let testtt = '0';
  // }

  // finalCatAssigWritter.writeLine(endFileProducts);
  // finalCatAssigWritter.close();
};


// let firstPositionProduct = fileString.indexOf('<category-assignment');
// let endPositionProduct = fileString.indexOf('</catalog>');
// let stringAuxiliar = fileString.slice(firstPositionProduct, endPositionProduct);