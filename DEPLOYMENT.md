# Deployment Guide

## Backend Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Push your code to GitHub** (already done ✓)

2. **Go to [Render.com](https://render.com/)** and sign up/login

3. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `Apricity` repository
   - Render will auto-detect the `render.yaml` config

4. **Set Environment Variables** in Render Dashboard:
   ```
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   FIREBASE_PROJECT_ID=my-auth-app-ea8ca
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@my-auth-app-ea8ca.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
   ```
   
   Get Firebase values from your `serviceAccountKey.json` file.

5. **Deploy** - Render will automatically deploy your backend

6. **Copy your backend URL** (e.g., `https://apricity-backend.onrender.com`)

7. **Update Frontend** - Add backend URL to your frontend `.env.local`:
   ```
   VITE_API_URL=https://apricity-backend.onrender.com
   ```

### Option 2: Railway.app

1. Go to [Railway.app](https://railway.app/) and login with GitHub

2. **New Project** → **Deploy from GitHub repo**

3. Select `Apricity` → Set **Root Directory** to `backend`

4. **Variables** - Add the same environment variables as above

5. Railway will auto-deploy

### Option 3: Vercel (Serverless)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy backend:
   ```bash
   cd backend
   vercel --prod
   ```

3. Set environment variables:
   ```bash
   vercel env add FIREBASE_PROJECT_ID
   vercel env add FIREBASE_CLIENT_EMAIL
   vercel env add FIREBASE_PRIVATE_KEY
   vercel env add ALLOWED_ORIGINS
   ```

4. Redeploy:
   ```bash
   vercel --prod
   ```

## Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done ✓)

2. Go to [Vercel.com](https://vercel.com/) and import your repository

3. **Configure Project:**
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables** - Add these in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=my-auth-app-ea8ca.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=my-auth-app-ea8ca
   VITE_FIREBASE_STORAGE_BUCKET=my-auth-app-ea8ca.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=584729313277
   VITE_FIREBASE_APP_ID=1:584729313277:web:ee2734934293948f8b2394
   ```

5. **Deploy** - Vercel will automatically build and deploy

6. **Update CORS** - Add your Vercel URL to backend's `ALLOWED_ORIGINS` environment variable

## Post-Deployment Checklist

- [ ] Backend is accessible at `/api/health` endpoint
- [ ] Frontend can connect to backend API
- [ ] Firebase authentication works
- [ ] CORS is properly configured
- [ ] All environment variables are set
- [ ] HTTPS is enabled on both frontend and backend

## Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGINS` includes your frontend URL
- Check that both URLs use HTTPS in production

### Firebase Auth Errors
- Verify all Firebase environment variables are set correctly
- Check that private key includes `\n` (newlines) properly escaped

### API Connection Failed
- Verify `VITE_API_URL` in frontend matches your backend URL
- Check backend logs for errors
- Test backend health endpoint directly in browser
