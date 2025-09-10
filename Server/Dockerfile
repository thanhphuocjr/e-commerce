# Stage 1: Build code bằng Babel
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  

# Stage 2: Run server (production only)
FROM node:18-alpine

WORKDIR /app

# Copy package.json để cài dependencies production
COPY package*.json ./
RUN npm install --omit=dev

# Copy code đã build từ stage 1
COPY --from=build /app/build ./build

EXPOSE 8000

CMD ["npm", "start"]
