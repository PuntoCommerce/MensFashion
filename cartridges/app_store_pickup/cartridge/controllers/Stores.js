const server = require("server");
server.extend(module.superModule);
const PUHelpers = require("*/cartridge/scripts/helpers/pickupHelpers");
const BasketMgr = require("dw/order/BasketMgr");

const renderTemplateHelper = require("*/cartridge/scripts/renderTemplateHelper");

server.post("CustomFindStores", (req, res, next) => {
  let lat = req.form.lat;
  let long = req.form.long;

  let stores = PUHelpers.getNearestStroes(parseFloat(lat), parseFloat(long));
  if (stores.isEmpty()) {
    res.json({
      error: true,
      message: "NO STORES",
    });

    return next();
  }

  let currentB = BasketMgr.getCurrentBasket();
  let products = PUHelpers.formatProducts(currentB.productLineItems);
  stores = PUHelpers.filterStores(products, stores.keySet(), {
    lat: lat,
    long: long,
  });
  stores = PUHelpers.sortStores(stores);

  const storeId = req.session.raw.privacy.storeId;

  let renderedStores = renderTemplateHelper.getRenderedHtml(
    { stores: { stores: stores }, defaultStoreId: storeId },
    "storeLocator/storeLocatorCheckoutResults"
  );

  res.json({
    stores: stores,
    renderedStores: renderedStores,
  });

  next();
});

module.exports = server.exports();
