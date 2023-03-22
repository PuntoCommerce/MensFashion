const base = module.superModule;

/**
 * Loops through all of the product line items and adds the quantities together.
 * @param {dw.util.Collection<dw.order.ProductLineItem>} items - All product
 * line items of the basket
 * @returns {number} a number representing all product line items in the lineItem container.
 */
function getTotalQuantity(items) {
  // TODO add giftCertificateLineItems quantity
  var totalQuantity = 0;
  require('*/cartridge/scripts/util/collections').forEach(items, function (lineItem) {
      totalQuantity += lineItem.quantity.value;
  });

  return totalQuantity;
}

function OrderModel(lineItemContainer, options) {
  base.call(this, lineItemContainer, options);

  this.customerName = lineItemContainer.customerName;
  this.quantityTotal = lineItemContainer.shipments && lineItemContainer.shipments.length > 1 ? getTotalQuantity(lineItemContainer.productLineItems) : 1;
  this.usingMultiShipping = false;
}

module.exports = OrderModel;
