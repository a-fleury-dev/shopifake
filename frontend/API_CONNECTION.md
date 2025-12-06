# Frontend - Backend Connection (Temporary Auth)

## 🎯 Overview

This implementation connects the frontend to the `main-api` backend using a **temporary authentication system** based on `admin_id`. This allows development to continue without waiting for the auth-service implementation.

## 🔧 Configuration

### Environment Variables

Create a `.env` file at the root of the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5001
```

A `.env.example` file is provided as a template.

## 📁 Architecture

### Files Created

```
frontend/
├── .env                                    # Environment variables (not in git)
├── .env.example                            # Template for env vars
├── app/
│   ├── config/
│   │   └── api.ts                         # Centralized API configuration
│   ├── clients/
│   │   └── shopApiClient.ts               # API client for shops endpoints
│   ├── lib/
│   │   ├── hooks/
│   │   │   └── useAuth.ts                 # Temporary auth hook
│   │   └── shops/
│   │       └── dto.ts                     # DTOs matching backend responses
```

### Key Components

#### 1. **API Configuration** (`app/config/api.ts`)
- Centralizes all API endpoints
- Uses environment variables for base URL
- Easy to extend for new services

#### 2. **Shop API Client** (`app/clients/shopApiClient.ts`)
- Handles all HTTP requests to shop endpoints
- Type-safe with DTOs
- Error handling included
- Functions:
  - `fetchShopsByAdminId(adminId)`
  - `fetchShopById(shopId)`
  - `createShop(data)`
  - `updateShop(shopId, data)`
  - `deleteShop(shopId)`

#### 3. **Auth Hook** (`app/lib/hooks/useAuth.ts`)
- Temporary solution for authentication
- Stores `admin_id` in localStorage
- Functions:
  - `login(adminId)` - Store admin ID
  - `logout()` - Clear auth data
  - `getAdminId()` - Get current admin ID
  - `isAuthenticated()` - Check auth status

#### 4. **DTOs** (`app/lib/shops/dto.ts`)
- `ShopDTO` - Matches backend response structure
- `CreateShopRequestDTO` - For creating shops
- `UpdateShopRequestDTO` - For updating shops

## 🚀 Usage

### 1. Login Flow

On the `/auth` page, you'll see a **temporary Admin ID field** (highlighted with an orange border):

1. Enter any admin ID (default: 1)
2. Fill in email/password (mock validation)
3. Click Login/Signup

The app stores the `admin_id` and redirects to `/shops`.

### 2. Shops Page

The `/shops` page automatically:
1. Checks authentication
2. Fetches shops from `GET /api/v1/shops/admin/{adminId}`
3. Displays shops with real data from backend

### 3. Example API Call

```typescript
import { fetchShopsByAdminId } from '../clients/shopApiClient';

const shops = await fetchShopsByAdminId(1);
// Returns: ShopDTO[]
```

## 🔄 Migration to Real Auth

When the auth-service is ready, you'll need to:

### 1. Remove temporary code marked with TODO comments:
- `/app/routes/auth.tsx` - Remove the Admin ID field
- `/app/lib/hooks/useAuth.ts` - Replace with real auth hook

### 2. Update API client:
```typescript
// Add Authorization header
headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
}
```

### 3. Update endpoints in `api.ts`:
```typescript
auth: {
  login: () => `${API_BASE_URL}/api/v1/auth/login`,
  logout: () => `${API_BASE_URL}/api/v1/auth/logout`,
  refresh: () => `${API_BASE_URL}/api/v1/auth/refresh`,
}
```

## 📝 Backend API Reference

### Get Shops by Admin ID

```bash
curl -X 'GET' \
  'http://localhost:5001/api/v1/shops/admin/1' \
  -H 'accept: */*'
```

**Response:**
```json
[
  {
    "id": 1,
    "adminId": 1,
    "domainName": "sport-elite",
    "name": "Sport Elite",
    "description": "...",
    "bannerUrl": "https://...",
    "createdAt": "2025-12-04T11:51:28.047803",
    "updatedAt": "2025-12-04T11:51:28.047803"
  }
]
```

## 🎨 Design Principles

- **KISS (Keep It Simple, Stupid)**: Minimal complexity, focused solution
- **DRY (Don't Repeat Yourself)**: Centralized configuration and utilities
- **Type Safety**: Full TypeScript types with DTOs
- **Easy Migration**: Clear separation of temporary vs permanent code
- **Environment Variables**: Easy configuration for different environments

## ⚠️ Important Notes

1. The temporary Admin ID field has an **orange border** to make it obvious it's temporary
2. All temporary code has `TODO` comments for easy identification
3. The backend must be running on `http://localhost:5001` (or update `.env`)
4. CORS must be configured on the backend to allow frontend requests

## 🧪 Testing

1. Start the backend: `cd backend/main-api && mvn spring-boot:run`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:5173/auth`
4. Enter admin_id = 1
5. Login and verify shops are loaded from the API

## 🔗 Related Files

- Backend: `/backend/main-api/src/main/java/com/shopifake/mainapi/controller/ShopController.java`
- Swagger: `http://localhost:5001/swagger-ui.html`
