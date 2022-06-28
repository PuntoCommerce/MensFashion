document.addEventListener('DOMContentLoaded', function () {

    const wishListUnselected = document.querySelectorAll('.wishlist__Unselected');
    const wishListSelected = document.querySelectorAll('.wishlist__Selected');

    const toggleWishList = (wishList, selected) => {
        let wishListSelectedId = 'wishlistSelected' + wishList;
        let wishListUnselectedId = 'wishlistUnselected' + wishList;
        let wishListSelected = document.querySelector('#' + wishListSelectedId)
        let wishListUnselected = document.querySelector('#' + wishListUnselectedId);

        if (selected) {
            wishListSelected.classList.remove('wishlist__Selected--show');
            wishListUnselected.classList.add('wishlist__Unselected--show');
        } else {
            wishListSelected.classList.add('wishlist__Selected--show');
            wishListUnselected.classList.remove('wishlist__Unselected--show');
        }


    }

    wishListUnselected.forEach(element => {
        element.onclick = () => {
            let selected = false;
            toggleWishList(element.id.substring(18, 30), selected) };
    });

    wishListSelected.forEach(element => {
        element.onclick = () => {
            let selected = true;
            toggleWishList(element.id.substring(16, 30), selected) };
    });

});
