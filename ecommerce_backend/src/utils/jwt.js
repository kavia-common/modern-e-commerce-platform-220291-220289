'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env');

// PUBLIC_INTERFACE
function signAccessToken(user) {
  /** Issue access token for user */
  const payload = {
    sub: String(user._id),
    roles: user.roles || ['user'],
    typ: 'access',
  };
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

// PUBLIC_INTERFACE
function signRefreshToken(user) {
  /** Issue refresh token for user */
  const payload = {
    sub: String(user._id),
    ver: user.refreshTokenVersion || 0,
    typ: 'refresh',
  };
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
}

// PUBLIC_INTERFACE
function verifyAccessToken(token) {
  /** Verify access token */
  return jwt.verify(token, config.JWT_ACCESS_SECRET);
}

// PUBLIC_INTERFACE
function verifyRefreshToken(token) {
  /** Verify refresh token */
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
