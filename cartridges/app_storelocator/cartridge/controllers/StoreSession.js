const server = require("server");
const PriceBookMgr = require("dw/catalog/PriceBookMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const Site = require("dw/system/Site");

const { closestStore } = require("~/cartridge/scripts/helpers/distance");

server.get("Start", (req, res, next) => {
  const currentSite = Site.getCurrent();
  const apikey = currentSite.getCustomPreferenceValue("mapAPI");
  res.render("storesession/session", {
    apikey: apikey,
  });
  next();
});

server.post("SetStore", (req, res, next) => {
  const stores = SystemObjectMgr.querySystemObjects(
    "Store",
    "latitude != {0} AND longitude != {0}",
    "creationDate desc",
    null
  );

  const clientLocation = {
    lat: req.form.lat,
    lng: req.form.lng,
  };

  const currentSite = Site.getCurrent();
  const defaultListPricebookId = currentSite.getCustomPreferenceValue(
    "defaultListPricebookId"
  );

  const store = closestStore(store, clientLocation);
  const pricebook = store.custom.pricebookId;

  const listPrice = PriceBookMgr.getPriceBook(defaultListPricebookId);
  const salePrice = PriceBookMgr.getPriceBook(pricebook);

  PriceBookMgr.setApplicablePriceBooks(listPrice, salePrice);

  next();
});

module.exports = server.exports();
