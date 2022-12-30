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