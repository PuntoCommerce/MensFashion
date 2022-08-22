"use strict";

function isValidFieldPickUpInStore(fieldName) {
  if (
    fieldName == "address1" ||
    fieldName == "city" ||
    fieldName == "country" ||
    fieldName == "postalCode" ||
    fieldName == "stateCode"
  ) {
    return true;
  }
  return false;
}

/**
 * get form errors and add them to an object
 * @param {Object} form - the target product line item
 * @returns {Object} - an object that contain the error in the form
 */
function getFormErrors(form) {
  const BasketMgr = require("dw/order/BasketMgr");
  const currentBasket = BasketMgr.getCurrentBasket();

  let handlePickUpInStore = false;

  if (currentBasket.shipments[0]) {
    if (currentBasket.shipments[0].shippingMethodID == "pickup") {
      handlePickUpInStore = true;
    }
  }

  var results = {};

  if (form === null) {
    return {};
  }
  Object.keys(form).forEach(function (key) {
    if (
      form[key] &&
      Object.prototype.hasOwnProperty.call(form[key], "formType")
    ) {
      if (form[key].formType === "formField" && !form[key].valid) {
        if (handlePickUpInStore) {
          if (!isValidFieldPickUpInStore(key)) {
            results[form[key].htmlName] = form[key].error;
          }
        } else {
          results[form[key].htmlName] = form[key].error;
        }
      }
      if (form[key].formType === "formGroup") {
        var innerFormResult = getFormErrors(form[key]);
        Object.keys(innerFormResult).forEach(function (innerKey) {
          results[innerKey] = innerFormResult[innerKey];
        });
      }
    }
  });
  return results;
}

/**
 * Removes the htmlValue and value properties of a form
 * @param {Object} form - the target product line item
 * @returns {void}
 */
function removeFormValues(form) {
  if (form === null) {
    return;
  }

  Object.keys(form).forEach(function (key) {
    if (form[key]) {
      if (form[key].formType === "formField") {
        delete form[key].htmlValue; // eslint-disable-line no-param-reassign
        delete form[key].value; // eslint-disable-line no-param-reassign
      }

      if (form[key].formType === "formGroup") {
        removeFormValues(form[key]);
      }
    }
  });

  return;
}

module.exports = {
  getFormErrors: getFormErrors,
  removeFormValues: removeFormValues,
};
