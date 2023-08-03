const server = require("server");
server.extend(module.superModule);
const Transaction = require("dw/system/Transaction");
var BasketMgr = require("dw/order/BasketMgr");
const COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const CustomerMgr = require("dw/customer/CustomerMgr");


server.append("SubmitShipping", (req, res, next) => {
  const coCustomerForm = server.forms.getForm("coCustomer");
  const viewData = res.getViewData();
  const shippingInfo = server.forms.getForm("shipping").shippingAddress.addressFields;
  const currentBasket = BasketMgr.getCurrentBasket();


  Transaction.wrap(function () {
    currentBasket.setCustomerEmail(coCustomerForm.email.value);
    if (viewData.shippingMethod == "pickup") {
      currentBasket.setCustomerName(
        shippingInfo.firstName.value + " " + shippingInfo.lastName.value
      );
    }
  });

  next();
});

server.append('SubmitShipping', (req, res, next) => {
  const currentBasket = BasketMgr.getCurrentBasket();

  const customerForm = server.forms.getForm("coCustomer");
  const customerErrors = COHelpers.validateShippingForm(customerForm);

  if (Object.keys(customerErrors).length > 0) {
    req.session.privacyCache.set(currentBasket.defaultShipment.UUID, 'invalid');

    res.json({
      form: customerForm,
      fieldErrors: [customerErrors],
      serverErrors: [],
      error: true
    });
  }

  next();
})

server.append('SubmitShipping', (req, res, next) => {
  const form = server.forms.getForm('shipping');
  const formErrors = COHelpers.validateShippingForm(form);

  const viewData = res.getViewData()

  if (viewData.shippingMethod !== 'pickup') {
    if (Object.keys(formErrors).length > 0) {

      res.json({
        form: form,
        fieldErrors: [formErrors],
        serverErrors: [],
        error: true
      });

      return next();
    }

    viewData.address.numExt = form.shippingAddress.addressFields.numExt.value;
    viewData.address.numInt = form.shippingAddress.addressFields.numInt.value;
    viewData.address.reference = form.shippingAddress.addressFields.reference.value;

    return next();
  }

  next();
})

module.exports = server.exports();
