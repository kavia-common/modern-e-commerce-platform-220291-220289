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
      { name: 'Auth', description: 'Authentication routes' },
      { name: 'Categories', description: 'Category routes' },
      { name: 'Products', description: 'Product catalog routes' },
      { name: 'Cart', description: 'Shopping cart routes' },
      { name: 'Coupons', description: 'Coupon management' },
      { name: 'Orders', description: 'Order routes' },
      { name: 'Webhooks', description: 'Webhook endpoints' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Include all route files for JSDoc annotations
  apis: ['./src/routes/*.js', './src/routes/v1/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
