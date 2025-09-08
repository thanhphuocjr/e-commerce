🛍️ LengKengStore - Website Thương Mại Điện Tử Fullstack (MERN)

![alt text](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)


![alt text](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)


![alt text](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)


![alt text](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

LengKengStore là một dự án website thương mại điện tử hoàn chỉnh, được xây dựng từ đầu với MERN Stack (MongoDB, Express.js, React.js, Node.js). Dự án mang đến một giải pháp e-commerce toàn diện, bao gồm giao diện cửa hàng cho người dùng và một trang quản trị mạnh mẽ dành cho admin.

(Link Demo Trực Tuyến - nếu có) | (Link đến Video Giới Thiệu - nếu có)

✨ Tính năng nổi bật
👤 Dành cho Người dùng (Client)

✅ Xác thực người dùng: Đăng ký, đăng nhập an toàn bằng JWT.

✅ Trải nghiệm mua sắm: Xem danh sách sản phẩm với hình ảnh và thông tin chi tiết.

✅ Tìm kiếm & Lọc: Dễ dàng tìm kiếm sản phẩm theo tên, danh mục hoặc bộ lọc khác.

✅ Giỏ hàng thông minh: Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng.

✅ Thanh toán: Quy trình thanh toán đơn giản (mô phỏng).

✅ Giao diện hiện đại: Thiết kế thân thiện, dễ sử dụng.

🛠️ Dành cho Quản trị viên (Admin Panel)

✅ Đăng nhập bảo mật: Trang đăng nhập riêng cho quản trị viên.

✅ Quản lý sản phẩm (CRUD): Thêm mới, xem, cập nhật và xóa sản phẩm một cách trực quan.

✅ Upload hình ảnh: Tải lên hình ảnh sản phẩm dễ dàng.

✅ (Tùy chọn) Quản lý đơn hàng: Xem và cập nhật trạng thái các đơn hàng từ người dùng.

🔧 Công nghệ sử dụng
Phần	Công nghệ
Frontend	⚛️ React.js, 🌐 React Router, 💾 Redux Toolkit, 💅 SCSS/Styled Components, 📡 Axios
Backend	🚀 Node.js, ⚙️ Express.js, 🍃 MongoDB, 🗂️ Mongoose
Xác thực	🔑 JSON Web Token (JWT), 🔒 Bcrypt.js
Công cụ khác	📤 Multer (Upload file), 🤫 Dotenv (Biến môi trường)
📁 Cấu trúc thư mục

Dự án được tổ chức theo cấu trúc monorepo với hai thư mục chính là client và server.

🚀 Hướng dẫn cài đặt & Chạy dự án
Yêu cầu

Node.js (phiên bản 14.x trở lên)

MongoDB hoặc một tài khoản MongoDB Atlas

Các bước cài đặt

Clone repository về máy:

Generated bash
git clone https://github.com/your-username/LengkengStore.git
cd LengkengStore
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Cài đặt cho Backend:

Generated bash
cd server
npm install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Cài đặt cho Frontend:

Generated bash
cd ../client
npm install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Cấu hình biến môi trường:

Trong thư mục server, tạo một file tên là .env.

Copy toàn bộ nội dung từ file server/.env.example (nếu có) hoặc sử dụng mẫu dưới đây và dán vào file .env vừa tạo:

Generated env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lengkengstore
JWT_SECRET=your_super_secret_jwt_key_123!@#
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Env
IGNORE_WHEN_COPYING_END

Lưu ý: Thay <username>, <password> và thông tin cluster bằng chuỗi kết nối MongoDB Atlas của bạn. JWT_SECRET là một chuỗi bí mật bất kỳ.

Khởi chạy dự án:

Chạy Backend Server:

Generated bash
# Từ thư mục gốc LengkengStore
cd server
npm start
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Server sẽ chạy tại http://localhost:5000

Chạy Frontend Client (mở một terminal mới):

Generated bash
# Từ thư mục gốc LengkengStore
cd client
npm start
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

Giao diện người dùng sẽ chạy tại http://localhost:3000

🗺️ Lộ trình phát triển (Roadmap)

Đây là những tính năng dự kiến sẽ được phát triển trong tương lai để hoàn thiện dự án:

💳 Tích hợp thanh toán online: VNPay, Momo, PayPal.

🚚 Quản lý đơn hàng & vận chuyển: Theo dõi trạng thái đơn hàng, tích hợp API giao hàng.

⭐ Đánh giá và bình luận sản phẩm: Cho phép người dùng đã mua hàng để lại review.

📱 Responsive Design: Tối ưu hóa giao diện cho mọi thiết bị (mobile, tablet).

⚡ Tối ưu hiệu năng: Cải thiện tốc độ tải trang (Code-splitting, lazy loading).

📈 Tối ưu SEO: Cải thiện thứ hạng tìm kiếm cho website.

🤝 Đóng góp

Mọi sự đóng góp đều được chào đón! Nếu bạn có ý tưởng cải thiện dự án, vui lòng tạo một Issue để thảo luận hoặc một Pull Request với những thay đổi của bạn.

📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem chi tiết tại file LICENSE.
