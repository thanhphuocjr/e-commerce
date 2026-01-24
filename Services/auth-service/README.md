# Auth Service

Authentication service handling JWT tokens and refresh tokens with MySQL storage.

## Features

- Access Token (JWT)
- Refresh Token Management
- MySQL Persistence
- Token Validation
- Token Refresh

## Setup

```bash
npm install
npm run migrate  # Run database migrations
npm run dev      # Start development server
```

## API Endpoints

### Public

- `POST /v1/auth/verify-token` - Verify access token
- `POST /v1/auth/refresh-token` - Refresh access token using refresh token
- `POST /v1/auth/revoke-token` - Revoke refresh token (logout)

### Protected

- `GET /v1/auth/tokens/:userId` - Get all tokens for user
- `DELETE /v1/auth/tokens/:tokenId` - Delete specific token
