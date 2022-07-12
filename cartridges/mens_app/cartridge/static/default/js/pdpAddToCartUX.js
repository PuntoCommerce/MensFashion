/* Buy Now Button */

const checkoutUrl = document.querySelector('#buy-now-url').value;
const buyNowBtn = document.querySelectorAll('#buy-now-btn');

buyNowBtn.forEach(e => e.addEventListener('click', function () { location.href = checkoutUrl })) 
