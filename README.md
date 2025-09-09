# Fourth Platform

A comprehensive multi-platform application with web frontend, mobile app, and backend API built with modern technologies.

## 🏗️ Architecture

- **Backend**: Node.js + Express + MongoDB + JWT Authentication
- **Frontend Web**: React + TypeScript + Material-UI
- **Mobile**: React Native + TypeScript + Expo
- **Database**: MongoDB
- **Deployment**: Docker + Docker Compose

## 📁 Project Structure

```
fourth/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── middleware/     # Authentication and error handling
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   ├── Dockerfile          # Production Docker image
│   ├── Dockerfile.dev      # Development Docker image
│   └── package.json
├── frontend-web/           # React web application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── Dockerfile          # Production Docker image
│   ├── nginx.conf          # Nginx configuration
│   └── package.json
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── contexts/       # React contexts
│   │   ├── navigation/     # Navigation setup
│   │   ├── screens/        # Screen components
│   │   ├── services/       # API services
│   │   └── i18n/          # Internationalization
│   └── package.json
├── shared-types/           # Shared TypeScript types
│   ├── src/
│   │   ├── auth.ts         # Authentication types
│   │   ├── common.ts       # Common types
│   │   └── index.ts        # Main export file
│   └── package.json
├── scripts/                # Deployment and setup scripts
│   ├── deploy.sh          # Production deployment
│   └── setup.sh           # Development setup
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development Docker Compose
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fourth
   ```

2. **Run the setup script**
   ```bash
   ./scripts/setup.sh
   ```

3. **Start development servers**

   **Option A: Using Docker (Recommended)**
   ```bash
   ./scripts/deploy.sh --env development
   ```

   **Option B: Manual setup**
   ```bash
   # Start MongoDB
   docker-compose -f docker-compose.dev.yml up -d mongodb
   
   # Start Backend
   cd backend
   npm run dev
   
   # Start Frontend Web (in new terminal)
   cd frontend-web
   npm start
   
   # Start Mobile (in new terminal)
   cd mobile
   npm start
   ```

### Production Deployment

1. **Update environment variables**
   - Copy `backend/env.example` to `backend/.env`
   - Update production values in `.env` files

2. **Deploy with Docker**
   ```bash
   ./scripts/deploy.sh --env production
   ```

3. **Access the application**
   - Backend API: http://localhost:3000
   - Frontend Web: http://localhost:3001
   - MongoDB: localhost:27017

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fourth_app
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

#### Frontend Web (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_APP_NAME=Fourth Platform
```

## 📱 Features

### Backend API
- ✅ JWT Authentication with refresh tokens
- ✅ User management with role-based access
- ✅ Rate limiting and security middleware
- ✅ Input validation and error handling
- ✅ MongoDB integration with Mongoose
- ✅ Health check endpoints
- ✅ CORS configuration

### Frontend Web
- ✅ React 18 with TypeScript
- ✅ Material-UI components
- ✅ React Router for navigation
- ✅ React Query for data fetching
- ✅ Authentication context
- ✅ Responsive design
- ✅ Toast notifications

### Mobile App
- ✅ React Native with TypeScript
- ✅ React Navigation
- ✅ Secure credential storage with Keychain
- ✅ Internationalization (i18n)
- ✅ Biometric authentication support
- ✅ Offline capabilities
- ✅ Push notifications ready

### Shared Components
- ✅ TypeScript types package
- ✅ Consistent API responses
- ✅ Reusable interfaces

## 🛠️ Development

### Available Scripts

#### Backend
```bash
cd backend
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

#### Frontend Web
```bash
cd frontend-web
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run ESLint
```

#### Mobile
```bash
cd mobile
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm test             # Run tests
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🐳 Docker

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
docker-compose up -d
```

### Services
- **mongodb**: MongoDB database
- **backend**: Node.js API server
- **frontend-web**: React web application (Nginx)

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /health`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend-web
```

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- Security headers
- Account lockout after failed attempts

## 🌐 Internationalization

The mobile app supports multiple languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- And more...

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Endpoints
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Updates

### Recent Changes
- ✅ Added Docker configuration for easy deployment
- ✅ Created shared TypeScript types package
- ✅ Improved error handling across all applications
- ✅ Added comprehensive deployment scripts
- ✅ Enhanced security with proper authentication
- ✅ Added internationalization support for mobile
- ✅ Improved code reusability and maintainability

---

**Fourth Platform** - Built with ❤️ using modern web technologies