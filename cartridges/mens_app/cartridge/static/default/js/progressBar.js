// ============================= Progress Bar =============================

const editBtn = document.querySelectorAll('.edit-button');
const submitAddress = document.querySelector('.submit-shipping');
const submitCustomer = document.querySelector('.submit-customer');
const submitCustomerLogin = document.querySelector('submit-customer-login');
const btnsTriggerChange = [submitAddress, submitCustomer, submitCustomerLogin];
const stepBarLines = document.querySelectorAll('.checkout__stepper--divider');
const stepBarCircles = document.querySelectorAll('.checkout__stepper--item-circle');

const stepBar = (step) => {
    switch (step) {
        case 1:
            stepBarLines[0].style.opacity = '.75';
            stepBarLines[1].style.opacity = '.75';
            stepBarCircles[0].style.opacity = '1';
            stepBarCircles[1].style.opacity = '.75';
            stepBarCircles[2].style.opacity = '.75';
            break;
        case 2:
            stepBarLines[0].style.opacity = '1';
            stepBarLines[1].style.opacity = '.75';
            stepBarCircles[0].style.opacity = '1';
            stepBarCircles[1].style.opacity = '1';
            stepBarCircles[2].style.opacity = '.75';
            break;
        case 2:
            stepBarLines[0].style.opacity = '1';
            stepBarLines[1].style.opacity = '1';
            stepBarCircles[0].style.opacity = '1';
            stepBarCircles[1].style.opacity = '1';
            stepBarCircles[2].style.opacity = '1';
            break;
    }
}

function hashController(newUrl) {
    if (newUrl) {
        parametersURL(newUrl);
    } else {
        let url = window.location.href;
        parametersURL(url);
    }
}

const parametersURL = (url) => {

    if (url.includes('customer')) {
        stepBar(1);
    }
    if (url.includes('shipping')) {
        stepBar(1);
        reloadPaymentPage(1)
    }
    if (url.includes('payment')) {
        stepBar(2);
        reloadPaymentPage(2)
    }
    if (url.includes('placeOrder')) {
        stepBar(3);
    }
}

function reloadPaymentPage(step) {
    if (step === 1) return sessionStorage.setItem('isLoaded', 'false');

    if (step === 2 && sessionStorage.getItem('isLoaded') === 'false') {
        window.location.reload()
        sessionStorage.setItem('isLoaded', 'true');
    }
}

// launch progress bar on page load
document.addEventListener('DOMContentLoaded', (e) => {
    hashController();
});
// managage browser back button click (and backspace)
var count = 0; // needed for safari
window.onload = function () {
    if (typeof history.pushState === "function") {
        history.pushState("back", null, null);
        window.onpopstate = function () {
            history.pushState('back', null, null);
            if (count == 1) { hashController(); }
        };
    }
}
setTimeout(function () { count = 1; }, 200);
// update progress bar based on url stage change
let lastUrl = location.href;
new MutationObserver(() => {
    const mutUrl = location.href;
    if (mutUrl !== lastUrl) {
        lastUrl = mutUrl;
        hashController()
    }
}).observe(document, { subtree: true, childList: true });
// update progress bar based on change stage btns
editBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(function () {
            newUrl = window.location.href;
            hashController(newUrl);
        }, 1000);
    });
});
// update progress bar based on change stage btns
btnsTriggerChange.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            setTimeout(function () {
                newUrl = window.location.href;
                hashController(newUrl);
            }, 500);
        });
    }
});