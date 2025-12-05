'use strict';

// PUBLIC_INTERFACE
function computeTotals({ items, coupon, gstRate = 0.18, deliveryFlat = 49 }) {
  /** Compute subtotal, discount via coupon, tax and delivery, and grand total */
  const subTotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  let discount = 0;

  if (coupon && coupon.isActive) {
    if (subTotal >= (coupon.minOrder || 0)) {
      if (coupon.type === 'percent') {
        discount = (subTotal * coupon.value) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.type === 'amount') {
        discount = Math.min(coupon.value, subTotal);
      }
    }
  }

  const taxable = Math.max(subTotal - discount, 0);
  const tax = Math.round(taxable * gstRate);
  const delivery = taxable > 999 ? 0 : deliveryFlat;
  const grandTotal = Math.max(taxable + tax + delivery, 0);

  return {
    subTotal,
    discount,
    tax,
    delivery,
    grandTotal,
  };
}

module.exports = {
  computeTotals,
};
