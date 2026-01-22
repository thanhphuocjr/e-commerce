# 🛒 E-Commerce Platform – Work in Progress

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Một platform thương mại điện tử hiện đại được xây dựng với **MERN Stack** (MongoDB, Express.js, React.js, Node.js), cung cấp trải nghiệm mua sắm hoàn chỉnh cho khách hàng và công cụ quản lý mạnh mẽ cho admin.
---

## ✨ Tính Năng Nổi Bật

### 👤 Tính Năng Khách Hàng
- ✅ **Xác thực người dùng**: Đăng ký, đăng nhập an toàn với JWT
- ✅ **Duyệt sản phẩm**: Xem chi tiết sản phẩm với hình ảnh, mô tả, giá
- ✅ **Tìm kiếm & Lọc**: Theo danh mục, giá, đánh giá
- ✅ **Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- ✅ **Quản lý hồ sơ**: Xem và cập nhật thông tin cá nhân
- ✅ **Đổi mật khẩu**: Đổi mật khẩu an toàn
- ✅ **Giao diện responsive**: Hoạt động tốt trên tất cả thiết bị

### 🛠️ Tính Năng Admin
- ✅ **Quản lý sản phẩm (CRUD)**: Thêm, sửa, xóa, xem sản phẩm
- ✅ **Quản lý người dùng**: Xem danh sách, khóa/mở khóa tài khoản
- ✅ **Thống kê**: Xem số liệu thống kê người dùng (tổng, hoạt động, không hoạt động, bị khóa)
- ✅ **Dashboard**: Hiển thị tổng quan hệ thống
- ✅ **Cài đặt hệ thống**: Quản lý email, thanh toán, cài đặt chung

---

## 🔧 Công Nghệ Sử Dụng

### Frontend
- **React 18**: Thư viện UI
- **React Router v6**: Định tuyến
- **Material-UI (MUI)**: Component UI
- **Axios**: HTTP client
- **Swiper**: Carousel slider
- **Framer Motion**: Animation
- **SCSS**: Styling

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Xác thực
- **Bcryptjs**: Mã hóa mật khẩu
- **Nodemailer**: Gửi email
- **Joi**: Validation

### DevOps
- **Docker & Docker Compose**: Containerization
- **API Gateway**: Microservices communication

---

## 📂 Cấu Trúc Dự Án

```
e-commerce/
├── Client/                          # Frontend React
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── Api/                     # API calls
│   │   ├── Components/              # Reusable components
│   │   │   ├── Admin/               # Admin components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── ...
│   │   ├── Pages/                   # Page components
│   │   │   ├── Home/
│   │   │   ├── ProductDetail/
│   │   │   ├── Cart/
│   │   │   ├── SignIn/
│   │   │   ├── Profile/
│   │   │   ├── Admin/
│   │   │   └── ...
│   │   ├── Helper/                  # Utility functions
│   │   ├── assets/                  # Images & static assets
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
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

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Tiên Quyết
- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0.0
- **Docker & Docker Compose** (optional)
- **npm** hoặc **yarn**

### 1. Clone Repository

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Cài Đặt Backend

```bash
cd Services/user-service
npm install

# Hoặc cho gateway-service
cd Services/gateway-service
npm install
```

### 3. Cài Đặt Frontend

```bash
cd Client
npm install
```

### 4. Cấu Hình Environment

Tạo file `.env` ở thư mục gốc:

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

## 🏃 Hướng Dẫn Chạy

### Sử Dụng Docker Compose (Khuyến Nghị)

```bash
# Từ thư mục gốc
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

### Chạy Local

**Terminal 1 - User Service:**
```bash
cd Services/user-service
npm run dev
# Server chạy tại http://localhost:3001
```

**Terminal 2 - Gateway Service:**
```bash
cd Services/gateway-service
npm run dev
# Gateway chạy tại http://localhost:8000
```

**Terminal 3 - Frontend:**
```bash
cd Client
npm start
# App chạy tại http://localhost:3000
```

---

## 🔐 API Endpoints

### Xác Thực
- `POST /v1/users/register` - Đăng ký tài khoản
- `POST /v1/users/login` - Đăng nhập
- `POST /v1/users/refresh` - Làm mới token
- `POST /v1/users/logout` - Đăng xuất

### Người Dùng
- `GET /v1/users/profile` - Lấy hồ sơ (Protected)
- `PATCH /v1/users/change-password` - Đổi mật khẩu (Protected)
- `POST /v1/users/forgot-password` - Quên mật khẩu
- `POST /v1/users/reset-password` - Đặt lại mật khẩu

### Admin
- `GET /v1/users` - Danh sách người dùng (Protected, Admin)
- `GET /v1/users/:id` - Chi tiết người dùng (Protected, Admin)
- `POST /v1/users` - Tạo người dùng (Protected, Admin)
- `PATCH /v1/users/:id` - Cập nhật người dùng (Protected, Admin)
- `DELETE /v1/users/:id` - Xóa người dùng mềm (Protected, Admin)
- `DELETE /v1/users/permanent/:id` - Xóa vĩnh viễn (Protected, Admin)
- `GET /v1/users/stats` - Thống kê (Protected, Admin)

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
Lỗi: connect ECONNREFUSED 127.0.0.1:27017
Giải pháp: 
1. Đảm bảo MongoDB đang chạy
2. Kiểm tra MONGODB_URI trong .env
```

### Token Expired
```
Lỗi: Token đã hết hạn
Giải pháp: Sử dụng refresh token để lấy token mới
```

### CORS Error
```
Lỗi: Access to XMLHttpRequest blocked by CORS policy
Giải pháp: Kiểm tra CLIENT_URL trong .env
```

---

## 📝 Các Quy Tắc Phát Triển

### Cấu Trúc Code
- Sử dụng ES6+ modules
- Tuân theo ESLint & Prettier
- Viết meaningful commit messages

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

## 🤝 Đóng Góp

Chúng tôi hoan nghênh các pull requests! Vui lòng:

1. Fork repository
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 👨‍💻 Tác Giả

**Nguyễn Thanh Phước**
**Happy Coding! 🚀**