FROM node:20-alpine

# Tạo thư mục app
WORKDIR /app

# Copy package trước để cache layer
COPY package*.json ./

# Cài dependency
RUN npm install

# Copy toàn bộ source
COPY . .

# Expose port gateway
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
