'use strict';

const express = require('express');
const v1Router = require('./v1');

const router = express.Router();

// Only expose versioned sub-router under /v1 when this module is used
router.use('/v1', v1Router);

module.exports = router;
