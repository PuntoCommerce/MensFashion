function setStores(lat, lng, search, data) {
  const url = search.getAttribute("data-url");

  fetch(`${url}${lat && lng ? `&lat=${lat}&long=${lng}` : ""}`)
    .then((res) => res.json())
    .then((json) => (data.innerHTML = json.storesResultsHtml));
}

function useUserLocation(search, data) {
  const success = ({ coords }) => {
    setStores(coords.latitude, coords.longitude, search, data);
    search.value = coords.latitude + ", " + coords.longitude;
  };

  const error = () => {
    alert("Imposible obtener la ubicacion");
    setStores(undefined, undefined, search, data);
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
  const data = document.querySelector(
    ".store-locator-container div.results.striped"
  );

  clearSearch.addEventListener("click", (e) => {
    e.preventDefault();
    search.value = "";
    setStores(undefined, undefined, search, data);
  });

  userLocationSearch.addEventListener("click", (e) => {
    e.preventDefault();
    useUserLocation(search, data);
  });

  const autocomplete = new google.maps.places.Autocomplete(search, options);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    // currentPositionClient = { lat, lng };
    setStores(lat, lng, search, data);
  });
}
