# Deploy E-Commerce bằng Docker Compose

Hướng dẫn này deploy toàn bộ app trên một VPS: React client, Nginx proxy, API gateway, auth-service, user-service, product-service và 3 MySQL database.

## 1. Chuẩn bị server

Cài Docker và Docker Compose plugin trên VPS, sau đó clone project:

```bash
git clone <repository-url>
cd e-commerce
```

Nếu chưa có domain, dùng IP server cho `CLIENT_PUBLIC_URL`.

## 2. Tạo env production

```bash
cp .env.production.example .env.production
```

Sửa `.env.production`:

```env
CLIENT_PUBLIC_URL=http://your-domain.com
JWT_SECRET_KEY=replace_with_a_long_random_jwt_secret
INTERNAL_SERVICE_TOKEN=replace_with_a_long_random_internal_token
AUTH_MYSQL_ROOT_PASSWORD=replace_with_auth_mysql_password
USER_MYSQL_ROOT_PASSWORD=replace_with_user_mysql_password
PRODUCT_MYSQL_ROOT_PASSWORD=replace_with_product_mysql_password
```

Tạo secret nhanh:

```bash
openssl rand -hex 32
```

Nếu muốn có dữ liệu sản phẩm mẫu ở lần deploy đầu, set:

```env
PRODUCT_SEED_MODE=empty
```

`empty` chỉ seed khi bảng `products` đang rỗng. Không dùng `reseed` trên production trừ khi bạn muốn xóa và tạo lại dữ liệu sản phẩm mỗi lần product-service khởi động.

## 3. Build và chạy

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Xem trạng thái:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

Xem log:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

## 4. Kiểm tra

Frontend:

```bash
curl http://your-domain.com/health
```

Gateway qua Nginx proxy:

```bash
curl http://your-domain.com/api/products
```

Nếu chưa trỏ domain, thay `your-domain.com` bằng IP server.

## 5. Update phiên bản mới

```bash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## 6. Dừng app

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

Lệnh trên không xóa database vì dữ liệu nằm trong Docker volumes. Chỉ dùng `docker compose down -v` khi bạn thật sự muốn xóa toàn bộ dữ liệu MySQL.
