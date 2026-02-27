# Quick Start Guide

## Problem: "Failed to fetch" or Backend Offline Error

### Solution:

The backend server needs to be running for the scanner to work. Here's how to start it:

## Option 1: Start Everything (Recommended)

Open your terminal in the project root and run:

```bash
npm run start
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## Option 2: Start Separately

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

Wait until you see:
```
🚀 OSAAS backend running on http://localhost:3001
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

## Verify Backend is Running

Test the backend health endpoint:

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "OSAAS backend is running",
  "timestamp": "..."
}
```

## Common Issues

### Issue: "npm: command not found" in VS Code terminal

**Cause**: VS Code is running in Flatpak and doesn't have access to system npm.

**Solution**: Run commands in your system terminal (outside VS Code), or install Node.js in the Flatpak:
```bash
flatpak install flathub org.freedesktop.Sdk.Extension.node18
```

### Issue: Port 3001 already in use

**Solution**: Kill the process using the port:
```bash
# Find the process
lsof -i :3001

# Kill it (replace PID with actual process ID)
kill -9 PID
```

Or use a different port in `backend/.env`:
```env
PORT=3002
```

Then update `src/pages/Scanner.tsx` line 8:
```typescript
const API_URL = "http://localhost:3002/api";
```

### Issue: CORS errors

**Cause**: Frontend and backend are running on different ports/domains than configured.

**Solution**: The backend is configured for `localhost:5173` by default. If you're using a different port, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:YOUR_PORT', 'http://127.0.0.1:YOUR_PORT'],
  credentials: true
}))
```

## Testing the Scanner

### 1. Test with Vulnerable Code

Upload the test file:
```bash
backend/test-vulnerable.js
```

Expected results: 9+ vulnerabilities (SQL injection, exposed secrets, XSS, etc.)

### 2. Test with URL

Try scanning a public site:
```
https://example.com
```

Expected results: Security header analysis, exposed directories check, etc.

## Dependencies

Make sure all dependencies are installed:

```bash
# Root (frontend)
npm install

# Backend
cd backend
npm install
```

## Still Having Issues?

1. Check if Node.js is installed:
   ```bash
   node --version
   npm --version
   ```

2. Check the backend console for errors

3. Check browser console (F12) for errors

4. Verify the frontend is trying to connect to the right URL:
   - Look for `http://localhost:3001` in network tab

5. Try restarting both servers
