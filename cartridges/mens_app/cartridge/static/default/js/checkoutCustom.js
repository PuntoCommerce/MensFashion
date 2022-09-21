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
stateSelector ? stateSelector.replaceWith(stateSelector.cloneNode(true)) : null;

const zipCodeField = document.querySelector(
  "input.form-control.shippingZipCode"
);
const checkedShippingMethod = document.querySelector(
  ".shipping-method-list .form-check-input[checked]"
);

const submitButton = document.querySelector("button.submit-shipping");
if (checkedShippingMethod) {
  const postalCodes = document.getElementById(`shippingMethod-${checkedShippingMethod.value}`).getAttribute("data-logistic");
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
}

function pickCountry() {
  setTimeout(() => {
    let countrySelect = document.querySelector(
      ".form-control.shippingCountry.custom-select"
    );
    if (countrySelect) {
      countrySelect.value = "MX";
      if (countrySelect.value === "MX") {
        document.querySelector(
          ".dwfrm_shipping_shippingAddress_addressFields_country"
        ).style.display = "none";
      }
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
if (selectShippingBtn) {
  selectShippingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selectShippingBtn.classList.add("active");
    selectPickupBtn.classList.remove("active");
    selectShipping("shipped");
    updateSelectedShippingMethod();
    pickCountry();
    togglePickupForm(selectPickupBtn);
  });
}
if (selectPickupBtn) {
  selectPickupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selectPickupBtn.classList.add("active");
    selectShippingBtn.classList.remove("active");
    selectShipping("pickup");
    updateSelectedShippingMethod();
    pickCountry();
    togglePickupForm(selectPickupBtn);
  });
}

const step1Btn = document.querySelector("button.submit-shipping");
const step2Btn = document.querySelector("button.submit-payment");

function updateProgressBar() {
  const stepShipping = document.querySelector("#checkout-main");

  const checkoutStep2 = document.querySelector("#checkoutStep2");
  const checkoutStep3 = document.querySelector("#checkoutStep3");
  const checkoutDivider1 = document.querySelector("#checkoutStepDivider1");
  const checkoutDivider2 = document.querySelector("#checkoutStepDivider2");

  let stage;
  if (stepShipping) {
    stage = stepShipping.dataset.checkoutStage;
  };


  if (stage === "shipping") {
    checkoutDivider1.classList.remove("active");
    checkoutStep2.classList.remove("active");
    checkoutDivider2.classList.remove("active");
    checkoutStep3.classList.remove("active");
  }
  if (stage === "payment") {
    checkoutDivider1.classList.add("active");
    checkoutStep2.classList.add("active");
  }
  if (stage === "placeOrder") {
    checkoutDivider1.classList.add("active");
    checkoutStep2.classList.add("active");
    checkoutDivider2.classList.add("active");
    checkoutStep3.classList.add("active");
  }
}
updateProgressBar();
if (step1Btn) {
  step1Btn.addEventListener("click", (e) => {
    setTimeout(() => {
      updateProgressBar();
    }, 1000);
  });
}
if (step2Btn) {
  step2Btn.addEventListener("click", (e) => {
    setTimeout(() => {
      updateProgressBar();
    }, 1000);
  });
}


// Instore pickup selector trigger
window.addEventListener("load", function () {
  let changeStoreBtn = document.querySelector("#dwfrm_shipping > div.shipping-address > button")
  function listenerPickStore() {
    setTimeout(() => {
      let pickupSelectorBtn = document.querySelector('.pickup-in-store button.select-store');
      let storeOptions = document.querySelectorAll(".store-locator-container .results.striped .card-body");
      storeOptions.forEach((item) => {
        item.addEventListener("click", function () {
          setTimeout(function () {
            pickupSelectorBtn.click();
          }, 1000);
        });
      });
    }, 1000);
  }
  listenerPickStore();
  if (changeStoreBtn) {
    changeStoreBtn.addEventListener("click", function () {
      listenerPickStore();
    });
  }
});

function displayMessageAndRemoveFromCart(data) {
  $.spinner().stop();
  var status = data.success ? 'alert-success' : 'alert-danger';

  if ($('.add-to-wishlist-messages').length === 0) {
    $('body').append('<div class="add-to-wishlist-messages "></div>');
  }
  $('.add-to-wishlist-messages')
    .append('<div class="add-to-wishlist-alert text-center ' + status + '">' + data.msg + '</div>');

  setTimeout(function () {
    $('.add-to-wishlist-messages').remove();
  }, 3000);
  var $targetElement = $('a[data-pid="' + data.pid + '"]').closest('.product-info').find('.remove-product');
  var itemToMove = {
    actionUrl: $targetElement.data('action'),
    productID: $targetElement.data('pid'),
    productName: $targetElement.data('name'),
    uuid: $targetElement.data('uuid')
  };
  $('body').trigger('afterRemoveFromCart', itemToMove);
}

$('body').on('click', '.product-move-custom .move', function (e) {
  e.preventDefault();
  var url = $(this).attr('href');
  var pid = $(this).data('pid');
  var optionId = $(this).closest('.product-info').find('.lineItem-options-values').data('option-id');
  var optionVal = $(this).closest('.product-info').find('.lineItem-options-values').data('value-id');
  optionId = optionId || null;
  optionVal = optionVal || null;
  if (!url || !pid) {
    return;
  }

  $.spinner().start();
  $.ajax({
    url: url,
    type: 'post',
    dataType: 'json',
    data: {
      pid: pid,
      optionId: optionId,
      optionVal: optionVal
    },
    success: function (data) {
      displayMessageAndRemoveFromCart(data);
    },
    error: function (err) {
      displayMessageAndRemoveFromCart(err);
    }
  });
});