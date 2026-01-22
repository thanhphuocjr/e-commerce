# 🛒 E-Commerce Platform – Work in Progress

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

A modern e-commerce platform built with **MERN Stack** (MongoDB, Express.js, React.js, Node.js), providing a complete shopping experience for customers and powerful management tools for administrators.

---

## ✨ Key Features

### 👤 Customer Features

- **User Authentication**: Secure registration and login with JWT
- **Browse Products**: View detailed product information with images, descriptions, and prices
- **Search & Filter**: Filter by category, price, and ratings
- **Shopping Cart**: Add, remove, and update product quantities
- **Profile Management**: View and update personal information
- **Change Password**: Securely change your password
- **Responsive Design**: Works seamlessly on all devices

### 🛠️ Admin Features

- **Product Management (CRUD)**: Add, edit, delete, and view products
- **User Management**: View user list, lock/unlock accounts
- **Analytics**: View user statistics (total, active, inactive, locked)
- **Dashboard**: System overview display
- **System Settings**: Manage email, payment, and general settings

---

## 🔧 Technology Stack

### Frontend

- **React 18**: UI library
- **React Router v6**: Routing
- **Material-UI (MUI)**: UI components
- **Axios**: HTTP client
- **Swiper**: Carousel slider
- **Framer Motion**: Animations
- **SCSS**: Styling

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Nodemailer**: Email service
- **Joi**: Validation

### DevOps

- **Docker & Docker Compose**: Containerization
- **API Gateway**: Microservices communication

---

## 📂 Microservices Architecture

```
e-commerce/
├── Client/                          # Frontend React
│
├── Services/                        # Backend services
│   ├── gateway-service/             # API Gateway
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   └── server.js
│   │   └── package.json
│   │
│   └── user-service/                # User microservice
│       ├── src/
│       │   ├── config/              # Configuration files
│       │   ├── controllers/          # Request handlers
│       │   ├── services/             # Business logic
│       │   ├── repositories/         # Database operations
│       │   ├── models/               # Data models
│       │   ├── validations/          # Input validation
│       │   ├── middlewares/          # Express middlewares
│       │   ├── routes/               # API routes
│       │   ├── dto/                  # Data Transfer Objects
│       │   ├── utils/                # Helper functions
│       │   └── server.js
│       └── package.json
│
├── docker-compose.yml               # Docker services orchestration
├── .env                             # Environment variables
└── README.md

```

---

## 🚀 Installation Guide

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0.0
- **Docker & Docker Compose** (optional)
- **npm** or **yarn**

### 1. Clone Repository

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Install Backend

```bash
cd Services/user-service
npm install

# Or for gateway-service
cd Services/gateway-service
npm install
```

### 3. Install Frontend

```bash
cd Client
npm install
```

### 4. Configure Environment

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce
DATABASE_NAME=ecommerce
DATABASE_TYPE=mongodb

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Application
APP_HOST=localhost
APP_PORT=3001
CLIENT_URL=http://localhost:3000

# Gateway
GATEWAY_PORT=8000
GATEWAY_NODE_ENV=development

# Services
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🏃 Running the Application

### Using Docker Compose (Recommended)

```bash
# From root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Running Locally

**Terminal 1 - User Service:**

```bash
cd Services/user-service
npm run dev
# Server runs at http://localhost:3001
```

**Terminal 2 - Gateway Service:**

```bash
cd Services/gateway-service
npm run dev
# Gateway runs at http://localhost:8000
```

**Terminal 3 - Frontend:**

```bash
cd Client
npm start
# App runs at http://localhost:3000
```

---

## 🔐 API Endpoints

### Authentication

- `POST /v1/users/register` - User registration
- `POST /v1/users/login` - User login
- `POST /v1/users/refresh` - Refresh token
- `POST /v1/users/logout` - User logout

### Users

- `GET /v1/users/profile` - Get user profile (Protected)
- `PATCH /v1/users/change-password` - Change password (Protected)
- `POST /v1/users/forgot-password` - Forgot password
- `POST /v1/users/reset-password` - Reset password

### Admin

- `GET /v1/users` - List users (Protected, Admin)
- `GET /v1/users/:id` - User details (Protected, Admin)
- `POST /v1/users` - Create user (Protected, Admin)
- `PATCH /v1/users/:id` - Update user (Protected, Admin)
- `DELETE /v1/users/:id` - Soft delete user (Protected, Admin)
- `DELETE /v1/users/permanent/:id` - Permanently delete user (Protected, Admin)
- `GET /v1/users/stats` - User statistics (Protected, Admin)

---

## 🧪 Testing

### Backend

```bash
cd Services/user-service
npm test
```

### Frontend

```bash
cd Client
npm test
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution:
1. Ensure MongoDB is running
2. Check MONGODB_URI in .env
```

### Token Expired

```
Error: Token has expired
Solution: Use refresh token to get a new token
```

### CORS Error

```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Check CLIENT_URL in .env
```

---

## 📝 Development Guidelines

### Code Structure

- Use ES6+ modules
- Follow ESLint & Prettier standards
- Write meaningful commit messages

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create Pull Request
```

### Commit Message Format

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

---

## 🤝 Contributing

We welcome pull requests! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Nguyễn Thanh Phước**

**Happy Coding! 🚀**
