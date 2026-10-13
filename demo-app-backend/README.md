# Demo App Backend

A RESTful HTTP API built with **Node.js**, **Express**, **MongoDB**, **Mongoose**, and **JWT Authentication**.

## Features

- RESTful API endpoints for user management
- JWT Authentication middleware (`protect`)
- Test login endpoint with static credentials for easy testing
- MongoDB connection using Mongoose (`demo_app_db`)
- User schema with validation, enums, and timestamps
- CORS and JSON body-parsing middleware enabled
- Modular architecture (Routes, Controllers, Middleware, Models, Config)

## Authentication

All `/api/users` routes are protected by JWT authentication. Any request without a valid bearer token in the `Authorization` header will receive a `401 Unauthorized` response.

### Test Credentials
- **Email**: `test@gmail.com`
- **Password**: `test@123`

---

## API Endpoints

### 1. Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/login` - Test login (returns JWT token)

#### Login Request:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "test@123"
}
```

#### Login Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "test@gmail.com",
    "role": "admin"
  }
}
```

---

### 2. Protected Endpoints (Requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Fetch all users |
| `GET` | `/api/users/:id` | Fetch single user by ID |
| `POST` | `/api/users` | Create a new user |
| `PUT` | `/api/users/:id` | Update user by ID |
| `DELETE` | `/api/users/:id` | Delete user by ID |

#### Example Protected Request:
```http
GET /api/users
Authorization: Bearer <token_here>
```

---

## Database Details

- **Database Name**: `demo_app_db`
- **Default Connection URI**: `mongodb://127.0.0.1:27017/demo_app_db`

### User Model Schema

| Field | Type | Required | Options / Defaults | Description |
|---|---|---|---|---|
| `firstName` | String | Yes | Trimmed | User's first name |
| `lastName` | String | Yes | Trimmed | User's last name |
| `age` | Number | No | Min: 0 | User's age |
| `role` | String | No | Enum: `['user', 'admin', 'manager', 'guest']`, Default: `'user'` | Role assigned |
| `address` | String | No | Default: `""` | User's physical address |
| `status` | String | No | Enum: `['active', 'inactive', 'pending']`, Default: `'active'` | Account status |
| `createdAt` | Date | Auto | Timestamps enabled | Creation date |
| `updatedAt` | Date | Auto | Timestamps enabled | Last update date |

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file (or copy `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/demo_app_db
   JWT_SECRET=super_secret_jwt_key_demo_app_2026
   JWT_EXPIRES_IN=24h
   ```

3. **Start the server**:
   - Development (with hot-reload):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```
