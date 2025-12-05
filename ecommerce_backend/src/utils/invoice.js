'use strict';

// PUBLIC_INTERFACE
async function generateInvoicePdf(order) {
  /** Placeholder that returns a simple string buffer */
  const content = `Invoice for Order ${order._id}\nTotal: ${order.totals.grandTotal}\n`;
  return Buffer.from(content, 'utf-8');
}

module.exports = { generateInvoicePdf };
