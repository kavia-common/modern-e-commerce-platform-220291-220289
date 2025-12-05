'use strict';

const User = require('../models/User');

// PUBLIC_INTERFACE
async function getProfile(userId) {
  /** Get user profile by id */
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return { id: user._id, name: user.name, email: user.email, roles: user.roles };
}

module.exports = { getProfile };
