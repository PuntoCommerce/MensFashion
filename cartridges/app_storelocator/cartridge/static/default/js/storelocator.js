const elementMap = document.getElementById("map");
const icons = JSON.parse(elementMap.getAttribute("icons"));
let MAX_DISTANCE = parseFloat(elementMap.getAttribute("max-distance")); //km

let markers = [];
let currentPositionClient = {};
let directionsService;
let directionsDisplay;
let markerClustered;
let memovar = [];
function initMap() {
    const minerva = { lat: 20.67645435642226, lng: -103.38935752238434 };
    const map = new google.maps.Map(elementMap, {
        zoom: 4,
        center: minerva,
    });

    // const stores = document.getElementsByClassName("storelocator-store");
    // const storesArray = parseArrayObjects(Array.from(stores));
    const storesArray = JSON.parse(
        document.getElementById("listing").getAttribute("stores")
    );
    memovar = storesArray;
    const storesArrayAux = JSON.parse(
        document.getElementById("listing").getAttribute("storesAux")
    );

    handleClickUserLocation(map, storesArray);
    const userLocationButton = document.getElementById("userLocationButton");

    userLocationButton.addEventListener("click", () =>
        handleClickUserLocation(map, storesArray, true)
    );
    // console.log(storesArray);

    updateStoresAux(map, storesArrayAux, storesArray);
    createDetails(map);
    initAutocomplete(map, storesArray, storesArrayAux);

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
    });
}

function createMarkers(map, stores) {
    const markers = [];
    stores.forEach((store) => {
        const storeLat = store.latitude;
        const storeLng = store.longitude;
        const storeName = store.name;
        const svgMarker = document
            .getElementById("map")
            .getAttribute("marker-style");

        const marker = new google.maps.Marker({
            position: { lat: parseFloat(storeLat), lng: parseFloat(storeLng) },
            map: map,
            title: storeName,
            icon: icons.storeMarker,
        });

        marker.animaition = google.maps.Animation.BOUNCE;
        marker.animating = false;

        const detailItem = document.getElementById(`store-${store.id}`);
        marker.addListener("click", () => detailItem.click());
        marker.metadata = { id: store.id };
        markers.push(marker);
    });
    return markers;
}

function centerMap(map) {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
}

function createDetails(map) {
    // console.log("createDetails");
    const scopeModalUrl = document.getElementById("urlStoreDetails");
    const dataUrl = scopeModalUrl.getAttribute("data-url");
    const details = document.getElementsByClassName("storelocator-store");
    const detailsArray = Array.from(details);

    detailsArray.forEach((detail) => {
        detail.addEventListener("click", async () => {
            let storeId = detail.getAttribute("target");

            const marker = markers.find(
                ({ metadata }) => metadata.id === `${storeId}`
            );
            higthLightMarker(map, marker);
            // console.log(marker);
            const response = await fetch(`${dataUrl}?storeID=${storeId}`);
            const detailsJson = await response.json();
            if (detailsJson.store) {
                addDetails(detailsJson.store);
            }
        });
    });
}

function handleClickUserLocation(map, stores, isClick = false) {
    if (currentPositionClient.lat && currentPositionClient.lng) {
        setFilters(map, stores, currentPositionClient);
    } else {
        const userLocationIcon = document.getElementById("userLocationIcon");
        const success = ({ coords }) => {
            userLocationIcon.src = icons.userLocation;
            // console.log(e);
            currentPositionClient = {
                lat: coords.latitude,
                lng: coords.longitude,
            };
        };
        const error = (e) => {
            userLocationIcon.src = icons.userLocationDisabled;
            if (isClick) {
                alert(
                    userLocationIcon.getAttribute("location-disable-message")
                );
            }
        };

        navigator.geolocation.getCurrentPosition(success, error);
    }
}

function createRoute(origin, destination) {
    directionsService.route(
        {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(
                destination.lat,
                destination.lng
            ),
            travelMode: google.maps.TravelMode.DRIVING,
        },
        function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        }
    );
}

function addDetails(detail) {
    const detailImage = document.getElementById("details-image");
    const detailImageDefault = document.getElementById("details-image-default");
    const detailsName = document.getElementById("details-name");
    const detailsAddress = document.getElementById("details-address");
    const detailsPhone = document.getElementById("details-phone");
    const detailsHours = document.getElementById("details-hours");
    const detailsEmail = document.getElementById("details-email");
    const route = document.getElementById("route");
    const goToMaps = document.getElementById("go-to-maps");
    const closeButton = document.getElementById("close-modal-st");
    const popup = document.getElementById("myPopup");

    if (detail.image) {
        detailImage.src = detail.image;
        detailImageDefault.style.display = "none";
    } else {
        detailImage.src = "null";
        detailImageDefault.style.display = "block";
    }

    detailsName.innerHTML = detail.name;
    detailsAddress.innerHTML = `<span class="direction">${detail.address},</span>
                              <span class="city-state">${detail.city}, ${detail.state}</span> <br>
                              <span class="postalCode">${detail.postalCode}</span>`;
    // detailsPhone.innerHTML = detail.phone;
    detailsPhone.innerHTML = `<a href="tel:${detail.phone}">${detail.phone}</a>`;
    detailsEmail.innerHTML = `<a href="#">${detail.email}</a>`;
    detailsEmail.addEventListener("click", (e) => {
        e.preventDefault();
        copyToClipboard(detail.email, detailsEmail);
    });
    detailsHours.innerHTML = detail.hours;
    if (detail.hours) {
        addOpenOrCloseStore(
            detailsHours
            //
        );
    }

    if (!currentPositionClient.lat && !currentPositionClient.lng) {
        route.disabled = true;
        goToMaps.href = `https://www.google.com/maps/search/?api=1&query=${detail.latitude}%2C${detail.longitude}`;
    } else {
        route.disabled = false;
        route.addEventListener("click", () => {
            createRoute(currentPositionClient, {
                lat: detail.latitude,
                lng: detail.longitude,
            });
            closeButton.click();
        });

        goToMaps.href = `https://www.google.com/maps/dir/?api=1&origin=${currentPositionClient.lat},${currentPositionClient.lng}&destination=${detail.latitude},${detail.longitude}`;
    }
}

function copyToClipboard(text, container = null) {
    navigator.clipboard.writeText(text);
    if (container) {
        container.innerHTML = `<a href="#">${text}</a> <span> <b> copied </b></span>`;
    }
}

function addOpenOrCloseStore(detailsHours) {
    const currentDay = new Date();
    const schedule = document.querySelector(
        `#details-hours [day="${currentDay
            .toLocaleDateString("en", {
                weekday: "short",
            })
            .toLowerCase()}"]`
    );
    const openHours = schedule.getAttribute("openhours");
    const openMin = schedule.getAttribute("openmin");
    const closeHours = schedule.getAttribute("closehours");
    const closeMin = schedule.getAttribute("closemin");

    const openTime = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate(),
        openHours,
        openMin
    );
    const closeTime = new Date(
        currentDay.getFullYear(),
        currentDay.getMonth(),
        currentDay.getDate(),
        closeHours,
        closeMin
    );

    const isOpen = currentDay > openTime && currentDay < closeTime;
    schedule.innerHTML += `&ensp;<span class="${
        isOpen ? "isopen" : "isclosed"
    }">${
        isOpen
            ? detailsHours.getAttribute("open-label")
            : detailsHours.getAttribute("close-label")
    }</span>`;
}

function initAutocomplete(map, stores,storesAux) {
    const input = document.getElementById("storelocator-search");
    const options = {
        componentRestrictions: { country: "MX" },
        types: ["geocode"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        currentPositionClient = { lat, lng };

        // const storeWDistance = stores.map((store) => ({
        //   ...store,
        //   distance: calDistance(store.latitude, store.longitude, lat, lng).toFixed(
        //     2
        //   ),
        // }));

        // const filterStores = storeWDistance
        //   .filter(({ distance }) => distance < MAX_DISTANCE)
        //   .sort((a, b) => a.distance - b.distance);

        // updateStores(map, filterStores, true);

        setFilters(map, stores, { lat, lng });
    });

    const clear = document.getElementById("clearInputStoreLocator");
    clear.addEventListener("click", () => {
        input.value = "";
        updateStoresAux(map, storesAux, stores);
    });
}

function setFilters(map, stores, { lat, lng }) {
    const storeWDistance = stores.map((store) => ({
        ...store,
        distance: calDistance(
            store.latitude,
            store.longitude,
            lat,
            lng
        ).toFixed(2),
    }));

    const filterStores = storeWDistance
        .filter(({ distance }) => distance < MAX_DISTANCE)
        .sort((a, b) => {
            if (a.state < b.state) return -1;
        });

    updateStores(map, filterStores, true);
}

function updateList(stores) {
    // console.log(stores);
    const list = document.getElementById("listing");
    list.innerHTML = "";
    // stores.map(item => console.log(item));
    stores.sort((a, b) => {
        if (a.state < b.state) return -1;
    });
    stores.forEach((store) => {
        const li = document.createElement("li");
        li.innerHTML = `<li class="item storelocator-store" 
                      id="store-${store.id}"
                      name="${store.name}" 
                      address="${store.address}"
                      city="${store.city}"
                      state="${store.state}"
                      latitude="${store.latitude}"
                      longitude="${store.longitude}"
                      data-toggle="modal" data-target="#storeDetailModal" target="${
                          store.id
                      }"
                      >
                        <span class="name">${store.name}</span> <br>
                        <div class="d-flex sub-item">
                            <div class="d-flex justify-content-start align-items-center mr-2">
                              <img src="${icons.address}" alt="">
                            </div>
                            <div class="sub-item">
                              <span class="direction">${store.address},</span>
                              <br>
                              <span class="postalCode">${
                                  store.postalCode
                              }</span>
                            </div>
                            
                        </div>
                        
                        <div class="sub-item d-flex">
                            <div class="d-flex justify-content-start align-items-center mr-2">
                              <img src="${icons.phone}" alt="">
                            </div>
                            <div>
                              <span class="phone">${store.phone}</span>
                            </div>
                        </div>

                        ${
                            store.distance
                                ? `<div class="sub-item d-flex">
                                  <div class="d-flex justify-content-start align-items-center mr-2 img-null">
                                  </div>
                                  <div>
                                    <span class="phone">${store.distance} KM</span>
                                  </div>
                              </div>`
                                : ""
                        }   
                  </li>`;
        list.appendChild(li);
    });
}

function toggleAnimationHover(id) {
    const marker = markers.find(({ metadata }) => metadata.id === id);
    marker.getAnimation()
        ? marker.setAnimation(null)
        : marker.setAnimation(google.maps.Animation.BOUNCE);
}

function removeAllMarkers() {
    markers.forEach((marker) => {
        marker.setMap(null);
    });
}
function updateStoresAux(map, stores, allStore) {
  updateList(stores);
  createDetails(map);
  removeAllMarkers();
  if (stores.length > 0) {
      markers = createMarkers(map, allStore);
      centerMap(map);
  }
  if (markerClustered) {
      markerClustered.clearMarkers();
      markerClustered.setMap(null);
  }

  new MarkerClusterer(map, markers, {
      cssClass: "custom-pin",
      styles: [
          {
              url: icons.clusterMarker,
              height: 150 / 3,
              width: 126 / 3,
              textColor: "black",
              textSize: 15,
          },
      ],
  });
}
function updateStores(map, stores) {
    updateList(stores);
    createDetails(map);
    removeAllMarkers();
    if (stores.length > 0) {
        markers = createMarkers(map, stores);
        centerMap(map);
    }
    if (markerClustered) {
        markerClustered.clearMarkers();
        markerClustered.setMap(null);
    }

    new MarkerClusterer(map, markers, {
        cssClass: "custom-pin",
        styles: [
            {
                url: icons.clusterMarker,
                height: 150 / 3,
                width: 126 / 3,
                textColor: "black",
                textSize: 15,
            },
        ],
    });
}

function higthLightMarker(map, marker) {
    map.setZoom(15);
    map.setCenter(marker.getPosition());
}
