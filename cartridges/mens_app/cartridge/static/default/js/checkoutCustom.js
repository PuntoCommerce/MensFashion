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

const stateSelector = document.querySelector(
  "select.form-control.shippingState"
);
stateSelector.replaceWith(stateSelector.cloneNode(true));

const zipCodeField = document.querySelector(
  "input.form-control.shippingZipCode"
);
const checkedShippingMethod = document.querySelector(
  ".shipping-method-list .form-check-input[checked]"
);

const submitButton = document.querySelector("button.submit-shipping");
const postalCodes = document
  .getElementById(`shippingMethod-${checkedShippingMethod.value}`)
  .getAttribute("data-logistic");
const arrPostalCode = postalCodes.split(",");

zipCodeField.addEventListener("change", (e) => {
  e.preventDefault();
  const exist = arrPostalCode.includes(zipCodeField.value);
  if (!exist) {
    submitButton.disabled = true;
    zipCodeField.classList.add("is-invalid");
  } else {
    zipCodeField.classList.remove("is-invalid");
    submitButton.disabled = false;
  }
});

function pickCountry() {
  setTimeout(() => {
    let countrySelect = document.querySelector(
      ".form-control.shippingCountry.custom-select"
    );
    countrySelect.value = "MX";
    if (countrySelect.value === "MX") {
      document.querySelector(
        ".dwfrm_shipping_shippingAddress_addressFields_country"
      ).style.display = "none";
    }
  }, 1000);
}
pickCountry();

function selectShipping(shippingMethod) {
  let shippingSelector = document.querySelectorAll(".form-check-input");
  shippingSelector.forEach((item) => {
    if (shippingMethod === "pickup" && item.value == "pickup") {
      item.click();
    }
    if (shippingMethod === "shipped" && item.value == "MEX001") {
      item.click();
    }
  });
}
function updateSelectedShippingMethod() {
  setTimeout(() => {
    let findActiveShipping = document.querySelectorAll(
      ".shipping.only-visible .form-check input"
    );
    findActiveShipping.forEach((item) => {
      if (item.checked) {
        item.parentElement.style.display = "block";
        item.parentElement.nextElementSibling.style.display = "block";
      } else {
        item.parentElement.style.display = "none";
        item.parentElement.nextElementSibling.style.display = "none";
      }
    });
  }, 1000);
}

const togglePickupForm = (selectPickupBtn) => {
  const pickupForm = document.querySelector(
    ".shipping-form .shipping-address-block"
  );
  const addressField = document.querySelectorAll(
    ".shipping-form .shipping-address-block .hidde-pickup"
  );
  setTimeout(() => {
    pickupForm.classList.remove("d-none");
    if (selectPickupBtn.classList.contains("active")) {
      addressField.forEach((el) => {
        el.classList.add("d-none");
      });
    } else {
      addressField.forEach((el) => {
        el.classList.remove("d-none");
      });
    }
  }, 500);
};

let selectShippingBtn = document.querySelector("#selectShipping");
let selectPickupBtn = document.querySelector("#selectPickup");
selectShippingBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectShippingBtn.classList.add("active");
  selectPickupBtn.classList.remove("active");
  selectShipping("shipped");
  updateSelectedShippingMethod();
  pickCountry();
  togglePickupForm(selectPickupBtn);
});
selectPickupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectPickupBtn.classList.add("active");
  selectShippingBtn.classList.remove("active");
  selectShipping("pickup");
  updateSelectedShippingMethod();
  pickCountry();
  togglePickupForm(selectPickupBtn);
});
