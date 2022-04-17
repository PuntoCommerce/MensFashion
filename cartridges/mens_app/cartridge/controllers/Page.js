const server = require("server");
server.extend(module.superModule);

server.append("IncludeHeaderMenu", (req, res, next) => {
  const viewData = res.getViewData();

  let mobileImege = "mens/MF_19.png";
  let mobileTitle = "Default Image";
  let boolStop = false;

  viewData.categories.forEach((category) => {
    if (category.image && !boolStop) {
      mobileImege = category.image;
      mobileTitle = category.name;
      boolStop = true;
    }
  });

  viewData.mobileImege = mobileImege;
  viewData.mobileTitle = mobileTitle;

  res.setViewData(viewData);
  next();
});

module.exports = server.exports();
