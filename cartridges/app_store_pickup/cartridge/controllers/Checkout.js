const server = require("server");
server.extend(module.superModule);
const Site = require("dw/system/Site");
const PUHelpers = require("*/cartridge/scripts/helpers/pickupHelpers");
const StoreMgr = require("dw/catalog/StoreMgr");
const BasketMgr = require("dw/order/BasketMgr");

server.append("Begin", (req, res, next) => {
  let mapAPI = Site.getCurrent().getCustomPreferenceValue("mapAPI");
  let viewData = res.getViewData();

  const storeId = req.session.raw.privacy.storeId;
  let store = undefined;
  if (storeId) {
    let currentB = BasketMgr.getCurrentBasket();

    let products = PUHelpers.formatProducts(currentB.productLineItems);
    store = StoreMgr.getStore(storeId);
    if (PUHelpers.hasInventoryForTheOrder(products, store)) {
      store = PUHelpers.formatStore(store, undefined);
    } else {
      store = undefined;
    }
  }

  viewData.pickup = {
    googleMapsApi: mapAPI,
    selectedStore: store,
  };

  res.setViewData(viewData);
  next();
});

module.exports = server.exports();
