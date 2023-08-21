document.addEventListener('DOMContentLoaded', () => {
  const pickupInput = document.querySelector('input[value="pickup"]');
  const standartInput = document.querySelector('input[value="homedelivery"]');
  const autofillDivs = document.querySelectorAll('.row.method-select');
  const selectStore = document.querySelector('.row.show-custompickup')

  // Verificar el estado del input "pickup" al cargar la página
  if (pickupInput.checked) {
    autofillDivs.forEach((div) => {
      div.classList.add('hideFirefox');
      div.classList.add('d-none')
      selectStore.classList.remove('d-none')
    });

    updateDeliveryMethod()
  }

  pickupInput.addEventListener('change', (event) => {
    if (event.target.checked) {
      autofillDivs.forEach((div) => {
        div.classList.add('hideFirefox');
        div.classList.add('d-none')
        selectStore.classList.remove('d-none')
      });

      updateDeliveryMethod('pickup')
    }

  });

  standartInput.addEventListener('change', (event) => {
    if (event.target.checked) {
      autofillDivs.forEach((div) => {
        div.classList.remove('hideFirefox');
        div.classList.remove('d-none')
        selectStore.classList.add('d-none')
      });

      updateDeliveryMethod('homedelivery')
    }

  });

  function updateDeliveryMethod(delivery) {
    const form = document.querySelector('div.shipping-method-list');
    const url = form.dataset.selectShippingMethodUrl;

    fetch(url, {
      method: 'POST',
      body: delivery
    }).then(res => res.json()).then(console.log).catch(console.log)
  }
});