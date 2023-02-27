const base = module.superModule;

function OrderModel(lineItemContainer, options) {
  base.call(this, lineItemContainer, options);

  this.customerName = lineItemContainer.customerName;
  this.usingMultiShipping = false;
}

module.exports = OrderModel;
