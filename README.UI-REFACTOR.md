# UI Refactor & Backend Integration Log

## Thời gian thực hiện
- Date: 2026-05-21
- Scope: Frontend `Client` (product flow) + mapping API Gateway hiện có

## Mục tiêu đã hoàn thành
- Rà soát lại flow sản phẩm trong UI và loại bỏ dữ liệu hiển thị hard-code ở các màn:
  - Home
  - Listing
  - Product Detail
  - Product modal / tabs / reviews
- Kết nối hiển thị sản phẩm thật từ backend qua Gateway API.
- Giảm lặp JSX và đơn giản hóa code để dễ đọc, dễ bảo trì.

## Những thay đổi chính

### 1) Chuẩn hóa gọi API sản phẩm
- Đã implement đầy đủ `Client/src/Api/products.js`.
- Hỗ trợ các hàm:
  - `getProducts`
  - `getProductById`
  - `getSimilarProducts`
  - `getTopRatedProducts`
  - `getNewArrivals`
  - `getProductsOnSale`
  - `getProductsByCategory`
  - `getCategories`
  - `getProductReviews`
  - `searchProducts`
- Có normalize response chung (`items`, `pagination`, `summary`) để UI dùng thống nhất.
- Base URL lấy từ env (fallback `http://localhost:5001/api`), tự xử lý trường hợp env đang là `/v1`.
- Bổ sung retry tự động cho các request product/category/review/search khi gặp lỗi tạm thời (`502/503/504` hoặc network), giúp UI không bị fail cứng khi service backend vừa khởi động.

### 1.1) Ổn định thứ tự khởi động services (Docker)
- Cập nhật `Services/Docker-compose.yml`:
  - Thêm `healthcheck` cho `product-service` (`/v1/products/health`).
  - Cho `gateway-service` phụ thuộc `product-service` ở trạng thái `service_healthy`.
- Mục tiêu: tránh tình trạng frontend gọi qua gateway ngay khi product-service chưa sẵn sàng dẫn tới `503 Service unavailable`.

### 2) Refactor Product UI components
- `ProductItem`:
  - Nhận `product` prop, bỏ hoàn toàn dữ liệu giả.
  - Hiển thị ảnh/giá/rating/tồn kho theo dữ liệu API.
  - Quick view modal dùng đúng dữ liệu sản phẩm đang chọn.
- `ProductModal`:
  - Render động theo `product`.
  - Slider ảnh từ `images`/`thumbnail`.
  - Giá sale + trạng thái tồn kho thật.
- `ProductImageSlider`:
  - Hỗ trợ dữ liệu ảnh động.
  - Có trạng thái fallback khi không có ảnh.
  - Badge giảm giá lấy theo `discount_percentage`.

### 3) Refactor Product Tabs
- `ProductTabs` nhận `product` + `reviewsData` từ page.
- `TabDescription` hiển thị mô tả thật.
- `TabDetails` hiển thị thông số thật (category, brand, sku, stock, dimension, warranty, shipping...).
- `TabReviews` hiển thị review thật từ API (`reviewer`, `rating`, `comment`, `date`, summary).

### 4) Home page dùng dữ liệu backend
- `Home` gọi API:
  - Top-rated products
  - New-arrivals products
- Thay toàn bộ `<ProductItem />` hard-code bằng map dữ liệu API.
- Nút `View All` điều hướng sang `/products`.

### 5) Listing page dùng dữ liệu backend + filter thật
- `Listing`:
  - Gọi API products với pagination + filter + search.
  - Gọi API categories để hiển thị category thật ở sidebar.
  - Hỗ trợ:
    - đổi layout (1/2/3/4 cột)
    - đổi số lượng hiển thị/trang
    - filter theo category
    - filter price range
    - filter in-stock
    - filter min rating
    - pagination thật
- Bỏ toàn bộ render lặp thủ công 20 item.

### 6) Product Detail page dùng dữ liệu backend
- `ProductDetail` gọi API theo `:id` để lấy chi tiết sản phẩm thật.
- Gọi thêm:
  - similar products
  - product reviews
  - top-rated (làm recommended)
- Phần related/recommended hiển thị bằng dữ liệu API.

### 7) Cải thiện route và search flow
- Thêm route `/products` trong `App.js` cho listing tổng.
- Giữ `/cat/:id` cho listing theo category.
- `SearchBox` đã điều hướng tới `/products?search=...` để search theo backend.
- Sửa link menu đang để mẫu `/cat/:id` thành `/products`.

### 8) Dọn cấu trúc code thừa
- Rút gọn `App.js` và `Header.jsx` (bỏ context/state không còn dùng trong flow hiện tại).
- Dọn import thừa ở file đã đụng tới.

## Danh sách file đã thay đổi
- `Client/src/Api/products.js`
- `Services/Docker-compose.yml`
- `Client/src/App.js`
- `Client/src/Components/Header/Header.jsx`
- `Client/src/Components/Header/Navigation/Navigation.jsx`
- `Client/src/Components/Header/SearchBox/SearchBox.jsx`
- `Client/src/Components/ProductImageSlider/ProductImageSlider.jsx`
- `Client/src/Components/ProductImageSlider/ProductImageSlider.scss`
- `Client/src/Components/ProductItem/ProductItem.jsx`
- `Client/src/Components/ProductItem/ProductItem.scss`
- `Client/src/Components/ProductModal/ProductModal.jsx`
- `Client/src/Components/ProductTabs/ProductTabs.jsx`
- `Client/src/Components/Sidebar/Sidebar.jsx`
- `Client/src/Components/Sidebar/Sidebar.scss`
- `Client/src/Components/Tab_Description/TabDescription.jsx`
- `Client/src/Components/Tab_Details/TabDetails.jsx`
- `Client/src/Components/Tab_Reviews/TabReviews.jsx`
- `Client/src/Components/Tab_Reviews/TabReviews.scss`
- `Client/src/Pages/Home/Home.jsx`
- `Client/src/Pages/Listing/Listing.jsx`
- `Client/src/Pages/Listing/Listing.scss`
- `Client/src/Pages/ProductDetail/ProductDetail.jsx`

## API backend đang dùng (qua Gateway)
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/:id/similar`
- `GET /api/products/top-rated`
- `GET /api/products/new-arrivals`
- `GET /api/products/on-sale`
- `GET /api/categories`
- `GET /api/categories/:id/products`
- `GET /api/reviews/product/:productId`
- `GET /api/search`

## Kiểm tra build
- Đã chạy: `npm run build` tại `Client`.
- Kết quả: build thành công.
- Có warning lint cũ ở các module admin/auth/cart không nằm trong phạm vi refactor lần này.

## Ghi chú môi trường
- Frontend hiện đọc base API từ env theo thứ tự:
  - `REACT_APP_GATEWAY_API_URL`
  - `REACT_APP_API_BASE_URL`
  - `REACT_APP_API_URL`
  - fallback: `http://localhost:5001/api`
- Nếu backend chạy ở host/port khác, cập nhật env tương ứng để frontend gọi đúng.
