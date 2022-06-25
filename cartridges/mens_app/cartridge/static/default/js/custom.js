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

//Close the search field when the user clicks out of the input and there is not a search words written.
searchFieldDesk.addEventListener("focusout", () => {
  if (!searchFieldDesk.value) {
    searchFieldDesk.classList.add("hidden");
    // searchClose.classList.add("hidden");
    searchButton.type = "button";
  }
});

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

const openCustomMenu = () => {
  customMenuResponsive.classList.remove("hidden");
};

const closeCustomMenu = () => {
  customMenuResponsive.classList.add("hidden");
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

const showMoreButton = $C("#show-more-button");
if (showMoreButton) {
  window.addEventListener("scroll", () => {
    console.log(window.scrollY);
    console.log(document.body.clientHeight);
    console.log(document.body.clientHeight - document.body.clientHeight * 0.8);
    if (
      window.scrollY >=
      document.body.clientHeight - document.body.clientHeight * 0.3
    ) {
      showMoreButton.click();
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
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
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

// /* HOME */
// const mobile2r2c = $C(".mobile-2r-2c");
// const newElement = document.createElement("div");
// newElement.classList.add("mobile-2r-2c-cross");
// mobile2r2c.appendChild(newElement);
