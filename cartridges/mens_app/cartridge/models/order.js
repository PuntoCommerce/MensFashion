const base = module.superModule;

function OrderModel(lineItemContainer, options) {
  base.call(this, lineItemContainer, options);

  this.customerName = lineItemContainer.customerName;
}

module.exports = OrderModel;
