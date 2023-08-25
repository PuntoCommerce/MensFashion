const StoreMgr = require("dw/catalog/StoreMgr");
const ProductInventoryMgr = require("dw/catalog/ProductInventoryMgr");
const ArrayList = require("dw/util/ArrayList");
const Site = require("dw/system/Site");

const getNearestStroes = (lat, long) => {
  let radiusSearchDistance = Site.getCurrent().getCustomPreferenceValue(
    "radiusSearchDistance"
  );
  let stores = StoreMgr.searchStoresByCoordinates(
    lat,
    long,
    "km",
    radiusSearchDistance
  );
  return stores;
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const rad = (x) => {
    return (x * Math.PI) / 180;
  };
  const R = 6378.137; //Earth radius in km
  const dLat = rad(lat2 - lat1);
  const dLong = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d).toFixed(0);
}

const sortStores = (stores) => {
  return stores.sort((a, b) => a.distance - b.distance);
};

const formatStore = (store, coords) => {
  let distance;
  if (coords) {
    distance = calculateDistance(
      coords.lat,
      coords.long,
      store.latitude,
      store.longitude
    );
  }

  return {
    ID: store.ID,
    name: store.name,
    latitude: store.latitude,
    longitude: store.longitude,
    address1: store.address1,
    address2: store.address2,
    city: store.city,
    stateCode: store.stateCode,
    postalCode: store.postalCode,
    storeHours: store.storeHours,
    phone: store.phone,
    distance: distance,
  };
};

const hasInventoryForTheOrder = (products, store) => {
  let product;
  let inventoryRecord;
  if (store.custom.inventoryListId) {
    inventoryList = ProductInventoryMgr.getInventoryList(
      store.custom.inventoryListId
    );
    let productsIterator = products.iterator();
    while (productsIterator.hasNext()) {
      product = productsIterator.next();
      inventoryRecord = inventoryList.getRecord(product.pid);
      if (inventoryRecord) {
        if (inventoryRecord.ATS.value < product.quantity) {
          if (!inventoryRecord.perpetual) {
            return false;
          }
        }
      } else {
        return false;
      }
    }
  }
  return true;
};

const filterStores = (products, stores, coords) => {
  let storesIterator = stores.iterator();
  let filteredStoresArray = [];

  let store;
  let product;
  let inventoryList;
  let inventoryRecord;
  let productsIterator;
  while (storesIterator.hasNext()) {
    store = storesIterator.next();
    if (store.custom.inventoryListId) {
      inventoryList = ProductInventoryMgr.getInventoryList(
        store.custom.inventoryListId
      );
      productsIterator = products.iterator();
      while (productsIterator.hasNext()) {
        product = productsIterator.next();
        inventoryRecord = inventoryList.getRecord(product.pid);
        if (inventoryRecord) {
          if (
            inventoryRecord.ATS.value >= product.quantity ||
            inventoryRecord.perpetual
          ) {
            store = formatStore(store, coords);
            filteredStoresArray.push(store);
          }
        }
      }
    }
  }

  return filteredStoresArray;
};

const formatProducts = (productsCollection) => {
  let iterator = productsCollection.iterator();
  let item;
  let itemsArray = ArrayList();
  while (iterator.hasNext()) {
    item = iterator.next();
    itemsArray.add({
      pid: item.productID,
      quantity: item.quantity,
    });
  }
  return itemsArray;
};

module.exports = {
  getNearestStroes: getNearestStroes,
  filterStores: filterStores,
  sortStores: sortStores,
  formatStore: formatStore,
  calculateDistance: calculateDistance,
  formatProducts: formatProducts,
  hasInventoryForTheOrder: hasInventoryForTheOrder,
};
