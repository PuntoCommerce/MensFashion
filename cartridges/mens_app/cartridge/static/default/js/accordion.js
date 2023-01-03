const accordion = document.querySelectorAll('#accordion-content');

accordion.forEach((item, index) => {
  let button = item.querySelector('button');
  if (button) {
    button.addEventListener('click', () => {
      item.classList.toggle('open');

      let description = item.querySelector('.accordion-description')

      if (item.classList.contains('open')) {
        description.style.height = `${description.scrollHeight}px`;
      } else {
        description.style.height = "0px";
      }
      removeOpen(index);
    })
  }
})

function removeOpen(index1) {
  accordion.forEach((item2, index2) => {
    if (index1 != index2) {
      console.log(item2);
      item2.classList.remove('open');

      let desc = item2.querySelector('.accordion-description');

      desc.style.height = "0px";

    }
  })
}

function showAlertItemCart(e) {
  var button = e.children[0].childNodes[3].disabled;
  const alertContainer = document.querySelector('.add-item-pdp-alert')
  const body = document.querySelector('#body-scroll');
  const colors = document.querySelectorAll('#colorsSelecteable');
  const selectSize = document.querySelector('#talla-1');
  var messages = {};
  var message;
  var select = selectSize.value;

  colors.forEach((item, index) => {
    const colorSwatch = item.querySelector('span');
    colorSwatch.classList.contains('selected') ? 
    messages.success = 'seleccionado' : 
    messages.error = 'color';
  })

  if (select === 'talla' && messages.error) {
    message = 'Tienes que seleccionar un color y una talla.'
  }else if(select = 'talla' && messages.success){
    message = 'Tienes que seleccionar una talla'
  }else if(!select && !messages.success){
    message = 'Tienes que seleccionar un color'
  }
  
  if (button === true) {
    $('.add-item-pdp-alert').append(`
      <div class='add-item-pdp-alert__card'>
        <span class='add-item-pdp-alert__card__title'>AVISO</span>
        <span class='add-item-pdp-alert__card__text'>${message}</span>
        <button onclick='hideAlertItem()' class='add-item-pdp-alert__card__button'>CERRAR</buttom>
      </div>
    `)

    alertContainer.style.zIndex = '100'
    alertContainer.style.background = 'rgba(255, 255, 255, 0.7)'
    body.classList.add('scroll-none');
  }
}

function showAlertItemBuy(e) {
  var button = e.children[0].childNodes[5].disabled;
  const alertContainer = document.querySelector('.add-item-pdp-alert')
  const body = document.querySelector('#body-scroll');
  const colors = document.querySelectorAll('#colorsSelecteable');
  const selectSize = document.querySelector('#talla-1');
  var messages = {};
  var message;
  var select = selectSize.value;

  colors.forEach((item, index) => {
    const colorSwatch = item.querySelector('span');
    colorSwatch.classList.contains('selected') ? 
    messages.success = 'seleccionado' : 
    messages.error = 'color';
  })

  if (select === 'talla' && messages.error) {
    message = 'Tienes que seleccionar un color y una talla.'
  }else if(select = 'talla' && messages.success){
    message = 'Tienes que seleccionar una talla'
  }else if(!select && !messages.success){
    message = 'Tienes que seleccionar un color'
  }
  
  if (button === true) {
    $('.add-item-pdp-alert').append(`
      <div class='add-item-pdp-alert__card'>
        <span class='add-item-pdp-alert__card__title'>AVISO</span>
        <span class='add-item-pdp-alert__card__text'>${message}</span>
        <button onclick='hideAlertItem()' class='add-item-pdp-alert__card__button'>CERRAR</buttom>
      </div>
    `)

    alertContainer.style.zIndex = '100'
    alertContainer.style.background = 'rgba(255, 255, 255, 0.7)'
    body.classList.add('scroll-none');
  }
}

function hideAlertItem() {
  const alertContainer = document.querySelector('.add-item-pdp-alert')
  const body = document.querySelector('#body-scroll');

  $('.add-item-pdp-alert .add-item-pdp-alert__card').remove();

  alertContainer.style.zIndex = '-1'
  alertContainer.style.background = 'none'
  body.classList.remove('scroll-none');
}

const paymentOptions = document.querySelectorAll('.payment-options .nav-item');

paymentOptions.forEach((item, index) => {
  console.log(item);
  const buttonPayment = document.querySelector('.submit-payment');

  item.addEventListener('click', (e) => {

    setTimeout(() => {
      e.path[0].classList.contains('active') && e.path[0].classList.contains('openpay-tab')? buttonPayment.classList.remove('d-none') : '';
    }, 200);
  })
})
