const $C = (el) => document.querySelector(el);
const $$C = (el) => document.querySelectorAll(el);

const searchCustom = $C(".search-field");
const searchButton = $C("#searcHeader");

//Open the search field when the search button is clicked. Then the search button is used to submit the search.
searchButton.addEventListener("click", () => {
  if (searchButton.type == "button") {
    searchCustom.classList.remove("hidden");
    searchCustom.focus();
    setTimeout(() => {
      //Wait to make the change and not submit the search before the animation is done.
      searchButton.type = "submit";
    }, 500);
  }
});

//Close the search field when the user clicks out of the input and there is not a search words written.
searchCustom.addEventListener("focusout", () => {
  if (searchCustom.value == "") {
    searchCustom.classList.add("hidden");
    searchButton.type = "button";
  }
});
