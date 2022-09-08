const File = require("dw/io/File");
const FileWriter = require("dw/io/FileWriter");
const FileReader = require("dw/io/FileReader");

const execute = (args) => {
  let path = args.path;
  if (!path.startsWith("/")) path = "/" + path;
  if (!path.endsWith("/")) path = path + "/";

  let file = new File(File.IMPEX + path + args.fileName);
  let fileReader = new FileReader(file, "UTF-8");

  let fileString = fileReader.getString();
  fileReader.close();

  let init = fileString.indexOf("<");
  let last = fileString.lastIndexOf(">") + 1 - fileString.length;

  let newFile = fileString.slice(init, last);

  let fileWriter = new FileWriter(file, "UTF-8");
  fileWriter.write(newFile);
  fileWriter.close();
};

module.exports.execute = execute;
