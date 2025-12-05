'use strict';

const Notification = require('../models/Notification');

// PUBLIC_INTERFACE
async function sendEmail(to, template, payload) {
  /** Email placeholder: log in dev, store record */
  // eslint-disable-next-line no-console
  console.log('[EMAIL]', to, template, payload);
  const n = await Notification.create({ channel: 'email', to, template, payload, status: 'SENT' });
  return n;
}

// PUBLIC_INTERFACE
async function sendSMS(to, template, payload) {
  /** SMS placeholder */
  // eslint-disable-next-line no-console
  console.log('[SMS]', to, template, payload);
  const n = await Notification.create({ channel: 'sms', to, template, payload, status: 'SENT' });
  return n;
}

// PUBLIC_INTERFACE
async function sendWhatsApp(to, template, payload) {
  /** WhatsApp placeholder */
  // eslint-disable-next-line no-console
  console.log('[WHATSAPP]', to, template, payload);
  const n = await Notification.create({ channel: 'whatsapp', to, template, payload, status: 'SENT' });
  return n;
}

module.exports = { sendEmail, sendSMS, sendWhatsApp };
