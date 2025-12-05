'use strict';

const config = require('../config/env');

// PUBLIC_INTERFACE
async function createPaymentSession({ amount, currency = 'INR', provider = 'mock', metadata = {} }) {
  /** Create payment session placeholder; returns mock when no keys present */
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  const hasRazorpay = !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

  if (!hasStripe && !hasRazorpay) {
    return {
      provider: 'mock',
      id: `mock_${Date.now()}`,
      amount,
      currency,
      url: `${process.env.SITE_URL || `http://localhost:${config.PORT}`}/mock/checkout`,
      metadata,
    };
  }

  // Placeholder branches for real integrations
  if (hasStripe) {
    // Integrate Stripe here if keys available (omitted)
    return {
      provider: 'stripe',
      id: `stripe_${Date.now()}`,
      amount,
      currency,
      url: `${process.env.SITE_URL || `http://localhost:${config.PORT}`}/mock/stripe`,
      metadata,
    };
  }

  if (hasRazorpay) {
    // Integrate Razorpay here if keys available (omitted)
    return {
      provider: 'razorpay',
      id: `rzp_${Date.now()}`,
      amount,
      currency,
      url: `${process.env.SITE_URL || `http://localhost:${config.PORT}`}/mock/razorpay`,
      metadata,
    };
  }

  return null;
}

// PUBLIC_INTERFACE
async function handleWebhook(payload, headers) {
  /** Payment webhook placeholder; returns ok for now */
  return { ok: true, payload, headers };
}

module.exports = {
  createPaymentSession,
  handleWebhook,
};
