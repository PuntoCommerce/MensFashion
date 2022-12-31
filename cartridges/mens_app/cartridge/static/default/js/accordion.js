const accordion = document.querySelectorAll('#accordion-content');

accordion.forEach((item, index) =>{

  let button = item.querySelector('button');
  button.addEventListener('click', () =>{
    item.classList.toggle('open');

    let description = item.querySelector('.accordion-description')

    if(item.classList.contains('open')){
      description.style.height = `${description.scrollHeight}px`;
    }else{
      description.style.height = "0px";
    }
    removeOpen(index);
  })
})

function removeOpen(index1) {
  accordion.forEach((item2, index2) =>{
    if(index1 != index2){
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
  
  if (button === true) {
    $('.add-item-pdp-alert').append(`
      <div class='add-item-pdp-alert__card'>
        <span class='add-item-pdp-alert__card__title'>AVISO</span>
        <span class='add-item-pdp-alert__card__text'>Tienes que seleccionar un color y una talla.</span>
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

function showAlertItemBuy(e) {
  var button = e.children[0].childNodes[5].disabled;
  const alertContainer = document.querySelector('.add-item-pdp-alert')
  const body = document.querySelector('#body-scroll');
  
  if (button === true) {
    $('.add-item-pdp-alert').append(`
      <div class='add-item-pdp-alert__card'>
        <span class='add-item-pdp-alert__card__title'>AVISO</span>
        <span class='add-item-pdp-alert__card__text'>Tienes que seleccionar un color y una talla.</span>
        <button onclick='hideAlertItem()' class='add-item-pdp-alert__card__button'>CERRAR</buttom>
      </div>
    `)
  
    alertContainer.style.zIndex = '100'
    alertContainer.style.background = 'rgba(255, 255, 255, 0.7)'
    body.classList.add('scroll-none');
  }
}