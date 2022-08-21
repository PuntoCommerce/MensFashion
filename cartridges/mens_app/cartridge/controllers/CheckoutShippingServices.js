const server = require("server");
server.extend(module.superModule);
const Transaction = require("dw/system/Transaction");
var BasketMgr = require("dw/order/BasketMgr");

server.append("SubmitShipping", (req, res, next) => {
  const coCustomerForm = server.forms.getForm("coCustomer");
  const viewData = res.getViewData();
  const shippingInfo =
    server.forms.getForm("shipping").shippingAddress.addressFields;
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

module.exports = server.exports();
