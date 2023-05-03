function initAutocomplete() {
  const input = document.getElementById("session_search");
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
    console.log(currentPositionClient);
  });
}
