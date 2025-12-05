'use strict';

const Joi = require('joi');

/**
 * Build express middleware for validation using Joi schema.
 * Supports body, params, query keys.
 */
// PUBLIC_INTERFACE
function validate(schemas = {}) {
  /** Validate request payloads with Joi */
  return (req, res, next) => {
    try {
      const targets = ['body', 'params', 'query'];
      for (const key of targets) {
        if (schemas[key]) {
          const { error, value } = schemas[key].validate(req[key], {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
          });
          if (error) {
            return res.status(400).json({
              status: 'error',
              message: 'Validation error',
              details: error.details.map((d) => d.message),
            });
          }
          req[key] = value;
        }
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
}

module.exports = validate;
