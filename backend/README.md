# BountyAI Backend

Automated vulnerability scanner with OWASP Top 10 detection, secret scanning, and penetration testing capabilities.

## Features

✅ **Secret Scanner** - Detects exposed API keys, passwords, tokens
✅ **Pattern Scanner** - Finds SQL injection, XSS, command injection, and more
✅ **Header Scanner** - Analyzes HTTP security headers
✅ **Directory Scanner** - Discovers exposed files and admin panels  
✅ **CVE Scanner** - Checks for known vulnerabilities
✅ **Rate Limit Checker** - Tests brute force protections

## Installation

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Root Dependencies (for concurrently)

```bash
cd ..
npm install concurrently nodemon --save-dev
```

## Running the Application

### Option 1: Run Both Frontend + Backend Together

```bash
npm run start
```

This starts:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**  
```bash
npm run dev
```

## API Endpoints

### POST `/api/scan`
Main scanning endpoint

**Request:**
- `target` (string, optional) - URL to scan
- `file` (file upload, optional) - Source code file to analyze

**Response:**
```json
{
  "success": true,
  "report": {
    "target": "example.com",
    "scanTime": "2026-02-26T10:30:00.000Z",
    "summary": {
      "total": 15,
      "critical": 3,
      "high": 5,
      "medium": 4,
      "low": 3,
      "riskScore": 85,
      "riskLevel": "HIGH"
    },
    "findings": [...],
    "stages": [...]
  }
}
```

### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "BountyAI backend is running",
  "timestamp": "2026-02-26T10:30:00.000Z"
}
```

## Scanner Modules

### 1. Secret Scanner (`scanners/secretScanner.js`)
Detects hardcoded secrets using regex patterns:
- AWS Access Keys
- GitHub Tokens
- Stripe Keys
- Google API Keys
- Private Keys
- Database URLs
- JWT Secrets

### 2. Pattern Scanner (`scanners/patternScanner.js`)
Finds OWASP Top 10 vulnerabilities:
- SQL Injection
- XSS (Cross-Site Scripting)
- Command Injection
- EVAL Injection
- Weak Cryptography
- Path Traversal
- CORS Misconfiguration
- Prototype Pollution

### 3. Header Scanner (`scanners/headerScanner.js`)
Checks HTTP security headers:
- Strict-Transport-Security
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### 4. Directory Scanner (`scanners/directoryScanner.js`)
Tests for exposed paths:
- `.env` files
- `.git` repositories
- Admin panels
- Database backups
- Log files

### 5. CVE Scanner (`scanners/cveScanner.js`)
Queries NVD database for known vulnerabilities

### 6. Rate Limit Scanner (`scanners/rateLimitScanner.js`)
Tests brute force protection

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
```

## Security Notes

⚠️ **Important:** This tool is for authorized security testing only. Always:
- Get written permission before scanning any system
- Only scan systems you own or have authorization to test
- Follow responsible disclosure practices
- Comply with local laws and regulations

## Project Structure

```
backend/
├── server.js              # Express server
├── package.json           # Backend dependencies
├── scanner/
│   └── index.js           # Main scanner orchestrator
└── scanners/
    ├── secretScanner.js   # Secret detection
    ├── patternScanner.js  # Vulnerability patterns
    ├── headerScanner.js   # HTTP header analysis
    ├── directoryScanner.js# Path enumeration
    ├── cveScanner.js      # CVE matching
    └── rateLimitScanner.js# Rate limit testing
```

## Example Usage

### Scan a URL:
```bash
curl -X POST http://localhost:3001/api/scan \
  -F "target=https://example.com"
```

### Scan Source Code:
```bash
curl -X POST http://localhost:3001/api/scan \
  -F "file=@app.js"
```

### Scan Both:
```bash
curl -X POST http://localhost:3001/api/scan \
  -F "target=https://example.com" \
  -F "file=@server.js"
```

## License

MIT
