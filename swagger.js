// Swagger API Documentation Configuration
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Taskie API Documentation',
      version: '1.0.0',
      description: 'RESTful API documentation for Taskie - A task marketplace platform connecting requesters with taskers',
      contact: {
        name: 'Taskie Support',
        email: 'support@taskie.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://taskie-backend-api.onrender.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and account management endpoints'
      },
      {
        name: 'Profile',
        description: 'User profile management endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task creation, management, and search endpoints'
      },
      {
        name: 'Messages',
        description: 'Messaging system endpoints'
      },
      {
        name: 'Favorites',
        description: 'Favorite tasks management endpoints'
      },
      {
        name: 'Categories',
        description: 'Job categories endpoints'
      },
      {
        name: 'Locations',
        description: 'Location endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin panel endpoints (requires admin role)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '0123456789' },
            role: { type: 'string', enum: ['requester', 'tasker', 'admin'], example: 'requester' },
            avatar: { type: 'string', example: '/uploads/avatars/avatar-123.jpg' },
            dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
            address: { type: 'string', example: '123 Main St, City' },
            proofOfExperience: { type: 'string', example: '/uploads/proofs/proof-123.pdf' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Move furniture to new apartment' },
            description: { type: 'string', example: 'Need help moving furniture from old apartment to new one' },
            category: { type: 'string', example: '507f1f77bcf86cd799439012' },
            location: { type: 'string', example: '507f1f77bcf86cd799439013' },
            price: { type: 'number', example: 500000 },
            deadline: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['open', 'in-progress', 'completed', 'cancelled'], example: 'open' },
            images: { type: 'array', items: { type: 'string' } },
            requester: { type: 'string', example: '507f1f77bcf86cd799439014' },
            tasker: { type: 'string', example: '507f1f77bcf86cd799439015' },
            paymentProof: { type: 'string', example: '/uploads/payments/payment-123.jpg' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            task: { type: 'string', example: '507f1f77bcf86cd799439012' },
            sender: { type: 'string', example: '507f1f77bcf86cd799439013' },
            recipient: { type: 'string', example: '507f1f77bcf86cd799439014' },
            content: { type: 'string', example: 'Hello, I am interested in this task' },
            isRead: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;










