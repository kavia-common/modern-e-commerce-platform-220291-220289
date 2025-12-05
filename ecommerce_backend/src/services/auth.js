'use strict';

const Joi = require('joi');
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/passwords');
const jwtUtil = require('../utils/jwt');

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

// PUBLIC_INTERFACE
async function register(payload) {
  /** Register a new user */
  const { value, error } = registerSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);

  const existing = await User.findOne({ email: value.email });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const user = await User.create({
    name: value.name,
    email: value.email,
    passwordHash: hashPassword(value.password),
    roles: ['user'],
  });

  const accessToken = jwtUtil.signAccessToken(user);
  const refreshToken = jwtUtil.signRefreshToken(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
    tokens: { accessToken, refreshToken },
  };
}

// PUBLIC_INTERFACE
async function login(payload) {
  /** Login with email and password */
  const { value, error } = loginSchema.validate(payload);
  if (error) throw new Error(error.details[0].message);

  const user = await User.findOne({ email: value.email }).select('+passwordHash');
  if (!user || !verifyPassword(value.password, user.passwordHash)) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('User disabled');
    err.status = 403;
    throw err;
  }

  const accessToken = jwtUtil.signAccessToken(user);
  const refreshToken = jwtUtil.signRefreshToken(user);

  return {
    user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
    tokens: { accessToken, refreshToken },
  };
}

// PUBLIC_INTERFACE
async function refresh(refreshToken) {
  /** Issue new access token */
  try {
    const payload = jwtUtil.verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    if ((user.refreshTokenVersion || 0) !== (payload.ver || 0)) {
      const err = new Error('Invalid refresh token');
      err.status = 401;
      throw err;
    }
    return {
      accessToken: jwtUtil.signAccessToken(user),
      refreshToken: jwtUtil.signRefreshToken(user),
    };
  } catch (e) {
    e.status = 401;
    throw e;
  }
}

// PUBLIC_INTERFACE
async function forgotPassword(email) {
  /** Issue password reset token (mock) */
  const user = await User.findOne({ email });
  if (!user) {
    return { ok: true }; // avoid user enumeration
  }
  const token = Math.random().toString(36).slice(2);
  user.passwordResetToken = token;
  user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();
  // integrate notification service here
  return { ok: true };
}

// PUBLIC_INTERFACE
async function resetPassword({ token, password }) {
  /** Reset password using valid token */
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select('+passwordHash');
  if (!user) {
    const err = new Error('Invalid or expired token');
    err.status = 400;
    throw err;
  }
  user.passwordHash = require('../utils/passwords').hashPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1; // invalidate old refresh
  await user.save();
  return { ok: true };
}

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
};
