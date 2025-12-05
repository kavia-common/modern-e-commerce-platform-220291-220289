'use strict';

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ['email', 'sms', 'whatsapp'], required: true },
    to: { type: String, required: true },
    template: { type: String },
    payload: { type: Object },
    status: { type: String, enum: ['QUEUED', 'SENT', 'FAILED'], default: 'QUEUED' },
    error: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
