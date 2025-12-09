## 🔧 Backend (taskie-backend)

**Tech Stack:** Node.js, Express.js, MongoDB, JWT Authentication

### Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication & authorization
- File upload handling (Multer) for images
- Swagger API documentation
- Role-based access control (Requester, Tasker, Admin)

### API Endpoints
- `/api/auth` - Authentication (login, register)
- `/api/tasks` - Task management (CRUD operations)
- `/api/messages` - Real-time messaging
- `/api/favorites` - Task favorites management
- `/api/profile` - User profile management
- `/api/admin` - Admin dashboard operations
- `/api/categories` - Job categories
- `/api/locations` - Location management

### Setup
cd taskie-backend
npm install
npm run seed      # Seed database with sample data
npm run dev       # Development mode
npm start         # Production mode
### Environment Variables
Create a `.env` file with:
