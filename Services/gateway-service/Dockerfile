# Sử dụng Node 20 Alpine
FROM node:20-alpine

# Thư mục làm việc
WORKDIR /app

# Copy package.json & package-lock.json trước để cache layer install
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Build project (clean + babel)
RUN npm run build

# Expose port
EXPOSE 3000

# Start server (production)
CMD ["npm", "run", "start"]
