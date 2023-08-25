async function setStores(lat, long, search) {
  const url = search.getAttribute("data-url");
  const results = document.getElementById("custom-pickup-results");
  const formData = new FormData();
  formData.append("lat", lat);
  formData.append("long", long);
  formData.append("products", []);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!json.error) {
    results.innerHTML = json.renderedStores;
  }
}

function useUserLocation(search) {
  const success = ({ coords }) => {
    setStores(coords.latitude, coords.longitude, search);
    search.value = coords.latitude + ", " + coords.longitude;
  };

  const error = () => {
    alert("Imposible obtener la ubicacion");
    setStores(undefined, undefined, search);
  };

  navigator.geolocation.getCurrentPosition(success, error);
}

function initAutocomplete() {
  const search = document.getElementById("search-store-custom");
  const clearSearch = document.getElementById("clear-search-store");
  const userLocationSearch = document.getElementById(
    "user-location-search-store"
  );

  const options = {
    componentRestrictions: { country: "MX" },
    types: ["geocode"],
  };
  clearSearch.addEventListener("click", (e) => {
    e.preventDefault();
    search.value = "";
    setStores(undefined, undefined, search);
  });

  userLocationSearch.addEventListener("click", (e) => {
    e.preventDefault();
    useUserLocation(search);
  });

  const autocomplete = new google.maps.places.Autocomplete(search, options);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    // console.log(place);
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    // currentPositionClient = { lat, lng };
    setStores(lat, lng, search);
  });
}

function toggle() {
  const form = document.getElementById("custom-pickup-form");
  const summary = document.getElementById("custom-pickup-summary");
  form.classList.toggle("d-none");
  summary.classList.toggle("d-none");
}

function getSummary(store) {
  let inner = `
    <input type="hidden" name="store" value="${store.ID}">
    <p>${store.name}</p>
    <p>${store.address1}</p>
    <button onclick="clearStore()" type="button" id="custom-pickup-clear-store">&times;</button>
  `;
  return inner;
}

function setSummaryStore(storeJson) {
  try {
    console.log('storeJson', storeJson);
    let store = JSON.parse(storeJson);
    const summaryStore = document.getElementById("custom-pickup-summary-store");
    summaryStore.innerHTML = getSummary(store);
    toggle();
  } catch (error) {
    console.log('catch storeJson', storeJson);
    let store = storeJson;
    const summaryStore = document.getElementById("custom-pickup-summary-store");
    summaryStore.innerHTML = getSummary(store);
    toggle();
  }
  
}

function clearStore() {
  const summaryStore = document.getElementById("custom-pickup-summary-store");
  summaryStore.innerHTML = "";
  toggle();
}

window.addEventListener("load", () => {
  const clearButton = document.getElementById("custom-pickup-clear-store");
  clearButton.addEventListener("click", clearStore);
  const summary = document.getElementById("custom-pickup-summary");
  let defaultStore = summary.getAttribute("default-store");
  if (defaultStore != "null") {
    setSummaryStore(defaultStore);
  }

  // console.log(defaultStoreSelected);
});
