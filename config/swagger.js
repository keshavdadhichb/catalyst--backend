const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catalyst API',
      version: '1.0.0',
      description: 'API documentation for Catalyst project'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: ['./routes/api/*.js']
};

module.exports = swaggerJsDoc(swaggerOptions); 