# Backend Firebase Setup Instructions

## Getting Your Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file as `backend/serviceAccountKey.json`

**Important:** Add `serviceAccountKey.json` to `.gitignore` (the file is already listed in the root gitignore - you can verify this)

## Files Created

- `backend/config/firebase.js` - Firebase Admin SDK configuration
- `backend/middleware/auth.js` - Token verification middleware
- `backend/server.js` (updated) - Protected endpoints with auth

## How It Works

1. **Frontend** sends Firebase ID token in `Authorization: Bearer <token>` header
2. **Backend middleware** verifies the token using Firebase Admin SDK
3. **Authenticated endpoints** extract user info from the verified token
4. **User-specific data** is scoped by `userId` (Firebase UID)

## Protected Endpoints

All endpoints requiring authentication now verify Firebase tokens:
- `POST /api/scan` - Run vulnerability scan (requires user)
- `GET /api/history` - Get user's scan history (filtered by userId)
- `GET /api/dashboard/stats` - Get user dashboard stats (filtered by userId)

## Public Endpoints

No authentication required:
- `GET /api/health` - Health check

## Testing with cURL

```bash
# Get your ID token from the frontend (console.log it after login)
TOKEN="your_firebase_id_token"

# Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/dashboard/stats
```
