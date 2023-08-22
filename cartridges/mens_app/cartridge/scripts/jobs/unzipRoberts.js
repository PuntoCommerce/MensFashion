const File = require("dw/io/File");

module.exports.execute = () => {
    const fileDir = new File(
        File.CATALOGS +
            File.SEPARATOR +
            "storefront-catalog-roberts" +
            File.SEPARATOR +
            "default" +
            File.SEPARATOR +
            "images"
    );
    const fileNew = new File(
        File.CATALOGS +
            File.SEPARATOR +
            "storefront-catalog-roberts" +
            File.SEPARATOR +
            "default" +
            File.SEPARATOR +
            "images"
    );
    const inter = fileDir.listFiles().iterator();
    let fileInter;
    let fileName = "";
    let err;
    while (inter.hasNext()) {
        fileInter = inter.next();
        fileName = fileInter.getName();
        try {
            if (fileName.endsWith(".zip")) {
                fileInter.unzip(fileNew);
                fileInter.remove();
            }
        } catch (error) {
            err = error;
            let message = error.message;
        }
    }
    let list = fileNew.list();
};