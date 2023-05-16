const server = require("server");
const Site = require("dw/system/Site");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const URLUtils = require("dw/web/URLUtils");

server.get("Start", (req, res, next) => {
  const currentSite = Site.getCurrent();

  const mapAPI = currentSite.getCustomPreferenceValue("mapAPI");
  const MAX_DISTANCE = currentSite.getCustomPreferenceValue("maxDistance");
  const layout = currentSite.getCustomPreferenceValue("layout");

  const svgMarker = {
    path: currentSite.getCustomPreferenceValue("svgPath"),
    fillColor: currentSite.getCustomPreferenceValue("svgFillColor"),
    fillOpacity: currentSite.getCustomPreferenceValue("svgFillOpacity"),
    scale: currentSite.getCustomPreferenceValue("svgScale"),
    strokeWeight: currentSite.getCustomPreferenceValue("svgStrokeWeight"),
    strokeColor: currentSite.getCustomPreferenceValue("svgStrokeColor"),
  };

  const stores = SystemObjectMgr.querySystemObjects(
    "Store",
    "latitude != {0} AND longitude != {0} AND city!={0}",
    "city asc",
    null
  );

  let storeList = [];
  let storeListAux = [];
  let pos = 1;

  while (stores.hasNext()) {
    let store = stores.next();
    storeList.push({
      id: store.ID,
      name: store.name,
      address: store.address1,
      city: store.city,
      state: store.stateCode,
      postalCode: store.postalCode,
      phone: store.phone,
      latitude: store.latitude,
      longitude: store.longitude,
    });
    if (pos < 4) { 
      storeListAux.push({
        id: store.ID,
        name: store.name,
        address: store.address1,
        city: store.city,
        state: store.stateCode,
        postalCode: store.postalCode,
        phone: store.phone,
        latitude: store.latitude,
        longitude: store.longitude,
      });
   } 
    pos++;
  }



  const clusterMarker = URLUtils.staticURL(
    "/images/storelocator/clusterMarker.svg"
  );
  const storeMarker = URLUtils.staticURL(
    "/images/storelocator/storeMarker.svg"
  );
  const storeMarkerFocus = URLUtils.staticURL(
    "/images/storelocator/storeMarkerFocus.svg"
  );
  const address = URLUtils.staticURL("/images/store_locator.svg");
  const phone = URLUtils.staticURL("/images/storelocator/phone.svg");
  const mail = URLUtils.staticURL("/images/storelocator/mail.svg");
  const clock = URLUtils.staticURL("/images/storelocator/clock.svg");
  const userLocation = URLUtils.staticURL(
    "/images/storelocator/userLocation.svg"
  );
  const userLocationDisabled = URLUtils.staticURL(
    "/images/storelocator/userLocationDisabled.svg"
  );

  res.render("storelocator/storelocator", {
    storelocator: {
      mapAPI: mapAPI,
      stores: storeList,
      storesAux: storeListAux,
      svgMarker: svgMarker,
      MAX_DISTANCE: MAX_DISTANCE,
      layout: layout.value,
      icons: {
        clusterMarker: clusterMarker.toString(),
        storeMarker: storeMarker.toString(),
        address: address.toString(),
        phone: phone.toString(),
        mail: mail.toString(),
        clock: clock.toString(),
        userLocation: userLocation.toString(),
        userLocationDisabled: userLocationDisabled.toString(),
        storeMarkerFocus: storeMarkerFocus.toString(),

      },
    },
  });
  next();
});



server.get('MapList', function (req, res, next) {
  const currentSite = Site.getCurrent();

  const mapAPI = currentSite.getCustomPreferenceValue("mapAPI");
  const MAX_DISTANCE = currentSite.getCustomPreferenceValue("maxDistance");
  const layout = currentSite.getCustomPreferenceValue("layout");

  const svgMarker = {
    path: currentSite.getCustomPreferenceValue("svgPath"),
    fillColor: currentSite.getCustomPreferenceValue("svgFillColor"),
    fillOpacity: currentSite.getCustomPreferenceValue("svgFillOpacity"),
    scale: currentSite.getCustomPreferenceValue("svgScale"),
    strokeWeight: currentSite.getCustomPreferenceValue("svgStrokeWeight"),
    strokeColor: currentSite.getCustomPreferenceValue("svgStrokeColor"),
  };

  const stores = SystemObjectMgr.querySystemObjects(
    "Store",
    "latitude != {0} AND longitude != {0} AND city!={0}",
    "city asc",
    null
  );

  let storeList = [];


  while (stores.hasNext()) {
    let store = stores.next();
    
      
      storeList.push({
        id: store.ID,
        name: store.name,
        address: store.address1,
        city: store.city,
        state: store.stateCode,
        postalCode: store.postalCode,
        phone: store.phone,
        latitude: store.latitude,
        longitude: store.longitude,
      });
  }


  const clusterMarker = URLUtils.staticURL(
    "/images/storelocator/clusterMarker.svg"
  );
  const storeMarker = URLUtils.staticURL(
    "/images/storelocator/storeMarker.svg"
  );
  const storeMarkerFocus = URLUtils.staticURL(
    "/images/storelocator/storeMarkerFocus.svg"
  );
  const address = URLUtils.staticURL("/images/storelocator/address.svg");
  const phone = URLUtils.staticURL("/images/storelocator/phone.svg");
  const mail = URLUtils.staticURL("/images/storelocator/mail.svg");
  const clock = URLUtils.staticURL("/images/storelocator/clock.svg");
  const userLocation = URLUtils.staticURL(
    "/images/storelocator/userLocation.svg"
  );
  const userLocationDisabled = URLUtils.staticURL(
    "/images/storelocator/userLocationDisabled.svg"
  );

  res.render("storeLocator/mapList", {
    storelocator: {
      mapAPI: mapAPI,
      stores: storeList,
      svgMarker: svgMarker,
      MAX_DISTANCE: MAX_DISTANCE,
      layout: layout.value,
      icons: {
        clusterMarker: clusterMarker.toString(),
        storeMarker: storeMarker.toString(),
        address: address.toString(),
        phone: phone.toString(),
        mail: mail.toString(),
        clock: clock.toString(),
        userLocation: userLocation.toString(),
        userLocationDisabled: userLocationDisabled.toString(),
        storeMarkerFocus: storeMarkerFocus.toString(),

      },
    },
  });
  next();
});

server.get("Store", (req, res, next) => {
  const storeID = req.querystring.storeID;
  try {
    const store = StoreMgr.getStore(storeID);
    res.json({
      store: {
        ID: store.ID,
        name: store.name,
        address: store.address1,
        city: store.city,
        state: store.stateCode,
        postalCode: store.postalCode,
        phone: store.phone,
        email: store.email,
        latitude: store.latitude,
        longitude: store.longitude,
        hours: store.storeHours ? store.storeHours.markup : "",
        image: store.image ? store.image.url.toString() : "",
      },
    });
    next();
  } catch (error) {
    res.json({
      error: error,
    });
    next();
  }
});

module.exports = server.exports();
