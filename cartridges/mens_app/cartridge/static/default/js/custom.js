const $C = (el) => document.querySelector(el);
const $$C = (el) => document.querySelectorAll(el);

const searchFieldDesk = $C("#searchFieldDesk");
const searchButton = $C("#searcHeader");
// const searchClose = $C(".search-desk-reset-button");

const searchFieldResponsive = $C(".search-field-responsive");
const searchButtonResponsive = $C("#searcHeaderResponsive");
const searchContainer = $C("#searchContainer");

const header = $C("#headerContainer");

//Open the search field when the search button is clicked. Then the search button is used to submit the search.
if (searchButton) {
  searchButton.addEventListener("click", () => {
    if (searchButton.type == "button") {
      searchFieldDesk.classList.remove("hidden");
      // searchClose.classList.remove("hidden");
      searchFieldDesk.focus();

      setTimeout(() => {
        //Wait to make the change and not submit the search before the animation is done.
        searchButton.type = "submit";
      }, 100);
    }
  });
}

//Close the search field when the user clicks out of the input and there is not a search words written.
if (searchFieldDesk) {
  searchFieldDesk.addEventListener("focusout", () => {
    if (!searchFieldDesk.value) {
      searchFieldDesk.classList.add("hidden");
      // searchClose.classList.add("hidden");
      searchButton.type = "button";
    }
  });
}

//Open the search field when the search button is clicked. Then the search button is used to submit the search.
searchButtonResponsive.addEventListener("click", () => {
  if (searchButtonResponsive.type == "button") {
    searchContainer.classList.remove("hidden");
    header.classList.add("hidden");

    searchFieldResponsive.focus();

    setTimeout(() => {
      //Wait to make the change and not submit the search before the animation is done.
      searchButtonResponsive.type = "submit";
    }, 100);
  }
});

//Close the search field when the user clicks out of the input and there is not a search words written.
searchFieldResponsive.addEventListener("focusout", () => {
  if (!searchFieldResponsive.value) {
    searchContainer.classList.add("hidden");
    header.classList.remove("hidden");

    searchButtonResponsive.type = "button";
  }
});

/* ########################################## Manu ########################################## */

const toggleSubCategories = $$C(".toggle-subcategories");

toggleSubCategories.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    const idAttribute = toggle.getAttribute("item-target");
    const subCategory = $C(`#submenu-${idAttribute}`);
    if (subCategory) {
      subCategory.classList.toggle("hidden");
    }
  });
});

const customMenuResponsive = $C("#customMenuResponsive");
const page = $C(".page");

const openCustomMenu = () => {
  const body = document.getElementById('body-scroll');

  customMenuResponsive.classList.remove("closeMenu");
  customMenuResponsive.classList.remove("hidden");
  customMenuResponsive.classList.add("viewMenu");
  page.classList.add("filter-blur");
  body.classList.add('scroll-none')
};

const closeCustomMenu = () => {
  const body = document.getElementById('body-scroll');

  customMenuResponsive.classList.add("closeMenu");
  setTimeout(() => {
    customMenuResponsive.classList.add("hidden");
  }, 180);
  customMenuResponsive.classList.remove("viewMenu");
  page.classList.remove("filter-blur");
  body.classList.remove('scroll-none')
};

const toggleSubMenu = (category, back = false) => {
  $C(`#submenu-${category}`).classList.toggle("viewMenu");
  $C(`#submenu-${category}`).classList.toggle("viewMenuOut");
  if (back) {
    setTimeout(() => {
      $C(`#submenu-${category}`).classList.toggle("hidden");
    }, 180);
  } else {
    $C(`#submenu-${category}`).classList.toggle("hidden");
  }
};

/* ########################################## ⬆️ Btn Back to top & Sticky Nav Bar⬆️ ####################################################### */
// Listen on scroll event to show/hide btn back to top & add sticky nav
const backToTopBtn = $C(".goToUp");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.remove("hidden");
  } else {
    backToTopBtn.classList.add("hidden");
  }
  changeSubMenuItem();
});

window.addEventListener("load", () => {
  changeSubMenuItem();
});

const changeSubMenuItem = () => {
  const menu = $C(".menu-group");
  const subMenu = $$C(".dropdown-menu");
  const menuHeight = 45;
  let rectMenu = menu.getBoundingClientRect();

  subMenu.forEach((sub) => {
    sub.style.top = rectMenu.y + menuHeight + "px";
  });
};

/* Product Grid Component */
const pgcSelect = $C("#mobile-select-navTabs");
const pgcTabs = Array.from($$C(".tab-pane-customNav"));

if (pgcSelect) {
  pgcSelect.addEventListener("change", (e) => {
    e.preventDefault();
    pgcTabs.forEach((t) => t.classList.remove("active"));
    $C(`#pills-${e.target.value}`).classList.add("active");
  });
}

/* PLP */
// SHOW MORE BUTTON

let showMoreButton = $C(".grid-footer .show-more button");

let changeSize = false;
if (showMoreButton) {
  window.addEventListener("scroll", () => {
    if (
      window.scrollY >=
      document.body.clientHeight - document.body.clientHeight * 0.3 &&
      !changeSize
    ) {
      if (showMoreButton) showMoreButton.click();
      changeSize = true;
      setTimeout(() => {
        changeSize = false;
        showMoreButton = $C(".grid-footer .show-more button");
        console.log(showMoreButton);
      }, 3000);
    }
  });
}

/* HOME */
// Promotion Carousel

const formatDateItem = (item) => {
  let currentNumber = item.number;
  if (currentNumber < 10) {
    currentNumber = `0${currentNumber}`;
  }
  return `<div class="item">
            <span class="number">${currentNumber}</span>
            <span class="type">${item.type}</span>
          </div>`;
};

const promoCountDown = $C("#countdown-carousel");

if (promoCountDown) {
  const finalDate = new Date(promoCountDown.getAttribute("data"));
  var x = setInterval(() => {
    var now = new Date().getTime();
    var distance = finalDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    promoCountDown.innerHTML = `${formatDateItem({
      number: days,
      type: "dias",
    })} ${formatDateItem({ number: hours, type: "horas" })} ${formatDateItem({
      number: minutes,
      type: "minutos",
    })} ${formatDateItem({ number: seconds, type: "segundos" })}`;
    // days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    if (distance < 0) {
      clearInterval(x);
      promoCountDown.innerHTML = "EXPIRED";
    }
  }, 1000);
}

// PLP - price range

function changeRange(e, type) {
  const rangePrice = document.getElementById("range-price-button");
  const pmin = document.getElementById("price-range-min");
  const pmax = document.getElementById("price-range-max");
  const rangeInputs = document.querySelectorAll('.range-input')


  let url = new URL(location.origin + rangePrice.getAttribute("data-href"));
  url.searchParams.set(type, e.value);
  rangePrice.setAttribute("data-href", url.pathname + url.search);

  if (type == "pmin") {
    pmin.value = e.value;
    sessionStorage.setItem("min", pmin.value);
  } else {
    pmax.value = e.value;
    sessionStorage.setItem("max", pmax.value);
  }
  rangePrice.addEventListener("click", () => {
    setTimeout(() => {
      localValues();
    }, 1000);
  });
}

function localValues() {
  const pmin = document.getElementById("price-range-min");
  const rangeMin = document.getElementById("range-min");
  const pmax = document.getElementById("price-range-max");
  const rangeMax = document.getElementById("range-max");

  let minValue = sessionStorage.getItem("min");
  let maxValue = sessionStorage.getItem("max");

  if (minValue === null) {
    sessionStorage.setItem("min", 0);
    minValue = 0;
  }
  if (maxValue === null) {
    sessionStorage.setItem("max", 5000);
    maxValue = 5000;
  }
  if (pmin) {
    pmin.value = sessionStorage.getItem("min");
    rangeMin.value = sessionStorage.getItem("min");
  }
  if (pmax) {
    pmax.value = sessionStorage.getItem("max");
    rangeMax.value = sessionStorage.getItem("max");
  }
}

const rangeInputs = document.querySelectorAll('.range-input')
let priceGap = 500

rangeInputs.forEach(input => {
  input.addEventListener('input', (e) => {
    let minVal = parseInt(rangeInputs[0].value),
      maxVal = parseInt(rangeInputs[1].value);

    var coin = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })

    console.log(coin.format(minVal));

    if (maxVal - minVal < priceGap) {
      if (e.target.classList[0] === 'min') {
        rangeInputs[0].value = maxVal - priceGap;
      } else {
        rangeInputs[1].value = minVal + priceGap;
      }
    }
  })
})

// =================================== Show and hide password ===================================

function showPassword() {
  const inputPassword = document.querySelectorAll(".show-password");

  inputPassword.forEach((e) => {
    if (e.type === "password") {
      e.type = "text";
    } else {
      e.type = "password";
    }
  });
}

// =================================== Promotion Text ===================================

const highligt = document.getElementById("highlight-price");
if (highligt) {
  const highligtPromotion = highligt.innerText.replace("de descuento", "");
  highligt.innerText = highligtPromotion;
}

function showFilter() {
  const filterContainer = document.querySelector("#refinement-bar");
  const body = document.querySelector('#body-scroll');

  if (filterContainer) {
    filterContainer.style.display = "block";
    body.classList.add('scroll-none')
  }
}

// =================================== Filter ===================================

function hideFilter() {
  const filterContainer = document.querySelector("#refinement-bar");
  const body = document.querySelector('#body-scroll');

  if (filterContainer) {
    filterContainer.style.display = "none";
    body.classList.remove('scroll-none')
  }
}

/* Inidcation to slide  */
/* 
function showAlertOnce() {
 localStorage.setItem("showAlertOnce", true);
}

const showAlert = localStorage.getItem("showAlertOnce");
showAlert
 ? ""
 : $("#alert-scroll-images").append(`
<div class="alert alert-warning alert-dismissible fade show"  role="alert">
<span>Desliza para ver el resto de las imagenes</span>

<button type="button" onclick="showAlertOnce()" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
</button>
</div>
`); */

/* PLP Change Carrousel or Slide Acording Width */

const imagesCarrouselContainer = document.querySelector(
  "#carrousel-slide-images-container"
);

const imagesCarrousel = document.querySelector(".carrousel-slide-images");

if (imagesCarrouselContainer) {
  const widthScreen = window.innerWidth;

  imagesCarrouselContainer.addEventListener("click", () => {
    document
      .querySelector(".carousel.slide.events")
      .classList.add("pointer-event");
  });

  addEventListener("resize", () => {
    const widthScreen = window.innerWidth;

    if (widthScreen < 769) {
      imagesCarrouselContainer.classList.remove("image-details-container");
      imagesCarrousel.setAttribute("data-ride", "carousel");
    } else {
      imagesCarrouselContainer.classList.add("image-details-container");
      imagesCarrousel.setAttribute("data-ride", "");
    }
  });

  if (widthScreen < 769) {
    imagesCarrouselContainer.classList.remove("image-details-container");
    imagesCarrousel.setAttribute("data-ride", "carousel");
  }
}

// ============================= Filter Collapse PLP =============================

const filterCollapse = document.querySelectorAll(".filter-collapse");
const arrowFilter = document.querySelectorAll("#filter_open_close");
const plpFilterContainer = document.querySelector("#refinement-bar");
const collapseFilterPLP = document.querySelectorAll('.collapse-filter-plp');

if (filterCollapse) {
  const widthScreen = window.innerWidth;

  addEventListener("resize", () => {
    const widthScreen = window.innerWidth;

    if (widthScreen < 769) {
      filterCollapse.forEach((i) => {
        i.classList.remove("show");
      });

      collapseFilterPLP.forEach((i) => {
        i.classList.add('collapsed');
      })
    } else {
      filterCollapse.forEach((i) => {
        i.classList.add("show");
      });
    }
  });

  if (widthScreen < 769) {
    filterCollapse.forEach((i) => {
      i.classList.remove("show");
    });
    collapseFilterPLP.forEach((i) => {
      i.classList.add('collapsed');
    })
  } else {
    filterCollapse.forEach((i) => {
      i.classList.add("show");
    });
  }
}

// ================================= Wishlist =================================

function hideAlert() {
  $(".add-to-wishlist-messages").remove();
}

const plpItemContainer = document.getElementById("plp-products");

if (plpItemContainer) {
  plpItemContainer.addEventListener("click", (e) => {
    e.target.classList.contains("wishlist_unselected")
      ? e.target.classList.add("wishlist_selected")
      : "";
    e.target.classList.contains('reload-plp') ? sessionStorage.setItem("plpLocation", windowLocation) : ''
  });
}

const pdpContainerItems = document.getElementById("pdp-items-container");

if (pdpContainerItems) {
  pdpContainerItems.addEventListener("click", (e) => {

    if (e.target.children[0].classList.contains("wishlist_unselected")) {
      var url = e.target.dataset.href;
      const itemID = e.target.id;

      fetch(url).then(res => res)
        .catch(error => console.log(error))

      e.target.children[0].classList.add("wishlist_selected");
      e.target.children[0].classList.remove("wishlist_unselected");

      e.target.setAttribute('data-href', '/on/demandware.store/Sites-MensFashion-Site/es/Wishlist-RemoveProduct?pid=' + itemID);
      e.target.classList.remove('add-to-wish-list')
      e.target.classList.add('remove-btn')
      return;
    }
    if (e.target.children[0].classList.contains("wishlist_selected")) {
      var url = e.target.dataset.href;

      fetch(url).then(res => res)
        .catch(error => console.log(error))

      e.target.children[0].classList.remove("wishlist_selected");
      e.target.children[0].classList.add("wishlist_unselected");

      e.target.setAttribute('data-href', '/Wishlist-AddProduct')
      e.target.classList.add('add-to-wish-list')
      e.target.classList.remove('remove-btn')
      return;
    }
  });
}

// ============================= Show Quantity Items in Cart =============================

// const quantityCart = document.querySelector('.minicart-quantity');
// const minicartQuantityContainer = document.querySelector('.minicart-quantity-container');

// if (quantityCart.innerText === '0') {
//   minicartQuantityContainer.classList.add('d-none')
// }

// function showQuantityCart() {
//   const minicartQuantityContainer = document.querySelector('.minicart-quantity-container');
//   minicartQuantityContainer.classList.remove('d-none');
// }

// ============================= Add item in wishlist QuickView =============================

function addToWishlistButton(e, type) {
  var url = e.dataset.href
  var pid = e.id
  const textSucccess = 'Producto agregado a Mis Favoritos, ahora pudes localizar este producto iniciando sesión en tu cuenta.'
  const textDeleted = 'Producto eliminado de mis favoritos'
  
  if (e.children[0].classList.contains('wishlist_unselected')) {
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      data: {
        pid: pid
      }
    });
    
    $('.add-to-wishlist-messages').append('<div class="add-to-wishlist-alert text-center alert-success alert-dismissible fade show" role="alert">'
    +
    textSucccess
    +
    `<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    +
    '</div>');
    
    setTimeout(() => {
      $('.add-to-wishlist-messages .alert-success').remove();
    }, 3000);
    
    
    e.children[0].classList.add("wishlist_selected");
    e.children[0].classList.remove("wishlist_unselected");
    e.classList.remove('add-to-wish-list')
    e.classList.add('remove-btn')
    
    e.setAttribute('data-href', '/on/demandware.store/Sites-MensFashion-Site/es/Wishlist-RemoveProduct?pid=' + pid);
    
    return;
  }
  
  if (e.children[0].classList.contains("wishlist_selected")) {
    var url = e.dataset.href;
    
    fetch(url).then(res => console.log(res))
    .catch(error => console.log(error))
    
    e.children[0].classList.remove("wishlist_selected");
    e.children[0].classList.add("wishlist_unselected");
    
    e.setAttribute('data-href', '/Wishlist-AddProduct')
    e.classList.add('add-to-wish-list')
    e.classList.remove('remove-btn')
    
    $('.add-to-wishlist-messages').append('<div class="add-to-wishlist-alert text-center alert-success alert-dismissible fade show" role="alert">'
    +
    textDeleted
    +
    `<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
    +
    '</div>');
    
    setTimeout(() => {
      $('.add-to-wishlist-messages .alert-success').remove();
    }, 3000);
    return;
  }
}

window.addEventListener('scroll', () =>{
  const valueScroll = 4*window.scrollY/-12;
  if($('.photo-tile-image')){
      $('.photo-tile-image').css({"transform": "translate3d(0px,"+ valueScroll+"px, 0px)"});
  }    
});

localValues();