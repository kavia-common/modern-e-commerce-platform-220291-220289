'use strict';

const jwt = require('../utils/jwt');

/**
 * Extract bearer token from Authorization header.
 */
function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1];
  }
  return null;
}

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Require valid access token */
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Missing token' });
  }
  try {
    const payload = jwt.verifyAccessToken(token);
    req.user = { id: payload.sub, roles: payload.roles || ['user'] };
    return next();
  } catch (e) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
}

// PUBLIC_INTERFACE
function requireRole(roles = []) {
  /** Enforce RBAC for required roles */
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    const has = (user.roles || []).some((r) => roles.includes(r));
    if (!has) return res.status(403).json({ status: 'error', message: 'Forbidden' });
    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
