'use strict';

const crypto = require('crypto');

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

function pbkdf2hash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
}

// PUBLIC_INTERFACE
function hashPassword(password) {
  /** Generate salted hash */
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = pbkdf2hash(password, salt);
  return `${salt}:${hash}`;
}

// PUBLIC_INTERFACE
function verifyPassword(password, stored) {
  /** Verify salted hash */
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const check = pbkdf2hash(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(check));
}

module.exports = {
  hashPassword,
  verifyPassword,
};
