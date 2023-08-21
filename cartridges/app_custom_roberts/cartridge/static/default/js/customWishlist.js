const addToWishlist = (e) => {
    const pid = e.dataset.pid;
    const url = e.dataset.url;
  
    fetch(url, {
      method: 'POST',
      body: pid
    }).then(res => res.json())
      .then(data => {
        $('body').append(
          '<div class="add-to-cart-messages"></div>'
        )
  
        $('.add-to-cart-messages').append(
          '<div class="alert ' + 'alert-success' + ' add-to-basket-alert text-center" role="alert">'
          + data.msg
          + '</div>'
        );
        console.log('data ',data);
        if(data.product == 'remove'){
          $('.fa-heart').removeClass('added-fav');
        }
        setTimeout(function () {
          $('.add-to-basket-alert').remove();
        }, 5000);
      })
      .catch(err => console.log(err))
  }
  
  const removeFromWishlist = (e) => {
    const url = e.dataset.url;
    const pid = e.dataset.pid
  
    $('.wishlist-account-card').spinner().start();
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        $(`.account-wishlist-item.${pid}`).remove();
        $('.wishlist-account-card').spinner().stop();
  
        $('body').append(
          '<div class="add-to-cart-messages"></div>'
        )
  
        $('.add-to-cart-messages').append(
          '<div class="alert ' + 'alert-success' + ' add-to-basket-alert text-center" role="alert">'
          + data.msg
          + '</div>'
        );
  
        setTimeout(function () {
          $('.add-to-basket-alert').remove();
        }, 5000);
        location.reload();
      })
      .catch(err => {
        var errorMsg = $('.wishlist-account-card').data('error-msg')
        $('.wishlist-account-card').spinner().stop();
  
        $('body').append(
          '<div class="add-to-cart-messages"></div>'
        )
  
        $('.add-to-cart-messages').append(
          '<div class="alert ' + 'alert-danger' + ' add-to-basket-alert text-center" role="alert">'
          + errorMsg
          + '</div>'
        );
  
        setTimeout(function () {
          $('.add-to-basket-alert').remove();
        }, 5000);
      })
  }