'use strict';

const paymentUtil = require('../utils/payment');

// PUBLIC_INTERFACE
async function createSession(amount, currency, metadata) {
  /** Delegate to utils */
  return paymentUtil.createPaymentSession({ amount, currency, metadata });
}

// PUBLIC_INTERFACE
async function handleWebhook(payload, headers) {
  /** Payment webhook placeholder */
  return paymentUtil.handleWebhook(payload, headers);
}

module.exports = { createSession, handleWebhook };
