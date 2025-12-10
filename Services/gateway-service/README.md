# API Gateway Service

API Gateway Service cho hệ thống E-Commerce, đóng vai trò trung gian giữa Client và các Microservices.

## Features

- ✅ Route management cho User, Product, Order services
- ✅ JWT Authentication
- ✅ Rate Limiting
- ✅ CORS Configuration
- ✅ Error Handling
- ✅ Request Logging
- ✅ Service Discovery
- ✅ Helmet Security

## Installation

```bash
npm install
```

## Environment Setup

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
NODE_ENV=dev
PORT=5000
CLIENT_URL=http://localhost:3000

USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004

JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_EXPIRE_TIME=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

LOG_LEVEL=debug
```

## Running

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

### User Routes (`/api/v1/users`)

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh JWT token
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `POST /change-password` - Change password (Protected)

### Product Routes (`/api/v1/products`)

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /categories` - Get all categories
- `POST /products` - Create product (Protected)
- `PUT /products/:id` - Update product (Protected)
- `DELETE /products/:id` - Delete product (Protected)

### Order Routes (`/api/v1/orders`)

- `GET /orders` - Get user orders (Protected)
- `GET /orders/:id` - Get order by ID (Protected)
- `POST /orders` - Create order (Protected)
- `PUT /orders/:id` - Update order (Protected)
- `DELETE /orders/:id` - Cancel order (Protected)

## Project Structure

```
gateway-service/
├── src/
│   ├── config/
│   │   └── environment.js       # Environment configuration
│   ├── constants/
│   │   └── httpStatus.js        # HTTP status & messages
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── requestLogger.js     # Request logging
│   ├── routes/
│   │   ├── userRoutes.js        # User service routes
│   │   ├── productRoutes.js     # Product service routes
│   │   └── orderRoutes.js       # Order service routes
│   ├── utils/
│   │   ├── ApiError.js          # Custom API error
│   │   └── serviceClient.js     # Service communication client
│   └── server.js                # Express app setup
├── package.json
├── .babelrc
├── .eslintrc.json
├── .env.example
└── README.md
```

## Architecture

Gateway Service hoạt động như một proxy thông minh:

1. **Request từ Client** → Gateway
2. **Gateway** → Route đến Service phù hợp
3. **Service xử lý** → Trả kết quả
4. **Gateway** → Trả response cho Client

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────┐
│  API Gateway        │
│ - Auth              │
│ - Rate Limit        │
│ - CORS              │
└──────┬──────────────┘
       │
       ├──────────────────┬──────────────────┬──────────────────┐
       ▼                  ▼                  ▼                  ▼
    ┌──────┐          ┌──────┐          ┌──────┐          ┌──────┐
    │ User │          │Product│         │Order │          │Payment│
    │Service│         │Service│         │Service│         │Service│
    └──────┘          └──────┘          └──────┘          └──────┘
```

## Security Features

- **Helmet**: Bảo vệ HTTP headers
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: Giới hạn số request từ một IP
- **JWT Authentication**: Xác thực người dùng
- **Error Handling**: Che giấu thông tin lỗi từ client

## Development

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

## License

MIT
