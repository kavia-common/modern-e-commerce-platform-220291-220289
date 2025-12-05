const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce Backend API',
      version: '1.0.0',
      description:
        'REST API for the modern e-commerce platform (user and admin features).',
    },
    tags: [
      { name: 'Health', description: 'Service health and readiness' },
      { name: 'v1', description: 'Version 1 API endpoints' },
    ],
  },
  // Include all route files for JSDoc annotations
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
