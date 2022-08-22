const File = require("dw/io/File");
const FileWriter = require("dw/io/FileWriter");
const { getInventory } = require("~/cartridge/scripts/salescloud/api");

module.exports.execute = () => {
  const result = getInventory();
  let file = new File(File.IMPEX + "/src/catalog/newInventory.xml");
  let fileWriter = new FileWriter(file, "UTF-8");
  fileWriter.write(result);
  fileWriter.close();
  return file;
};
