# Apricity - BountyAI Security Scanner

A modern, automated vulnerability scanner built with React + Vite frontend and Node.js backend. Detects OWASP Top 10 vulnerabilities, exposed secrets, and security misconfigurations.

## 🚀 Features

- **Secret Detection** - Find exposed API keys, tokens, and credentials
- **Vulnerability Scanning** - Detect SQL injection, XSS, command injection, and more
- **Security Header Analysis** - Check HTTP security headers
- **Directory Enumeration** - Discover exposed files and admin panels
- **CVE Matching** - Check against known vulnerabilities
- **Rate Limit Testing** - Test brute force protections
- **Real-time Scanning** - Live progress updates
- **Detailed Reports** - Comprehensive vulnerability reports with fixes

## 📋 Prerequisites

- Node.js 18+ (for backend)
- npm or bun

## 🛠️ Installation

### 1. Install Dependencies

```bash
# Install root dependencies (frontend)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Backend (Optional)

```bash
cd backend
cp .env.example .env
# Edit .env if needed (default port is 3001)
```

## 🏃 Running the Application

### Option 1: Run Both Frontend & Backend Together (Recommended)

```bash
npm run start
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

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

## 🧪 Testing the Scanner

### Test with Example Vulnerable Code

The backend includes a test file with intentional vulnerabilities:

1. Start the application
2. Go to the Scanner page
3. Upload `backend/test-vulnerable.js`
4. Click "Start Scan"

The scanner should detect:
- 4 Critical vulnerabilities (exposed secrets, SQL injection, command injection, eval injection)
- 3 High vulnerabilities (XSS, weak crypto, path traversal)
- 2 Medium vulnerabilities (insecure random, sensitive logging)

### Test with a URL

1. Enter a target URL (e.g., `https://example.com`)
2. Click "Start Scan"
3. View security header analysis, exposed directories, and more

## 📁 Project Structure

```
apricity/
├── src/                    # Frontend React code
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   │   ├── Scanner.tsx    # Main scanner interface
│   │   ├── Dashboard.tsx
│   │   └── Reports.tsx
│   └── main.tsx
├── backend/               # Node.js backend
│   ├── server.js          # Express API server
│   ├── scanner/
│   │   └── index.js       # Main scanner orchestrator
│   └── scanners/          # Individual scanner modules
│       ├── secretScanner.js
│       ├── patternScanner.js
│       ├── headerScanner.js
│       ├── directoryScanner.js
│       ├── cveScanner.js
│       └── rateLimitScanner.js
└── package.json
```

## 🔌 API Endpoints

### `POST /api/scan`
Main scanning endpoint

**Parameters:**
- `target` (optional) - URL to scan
- `file` (optional) - Source code file to analyze

**Response:**
```json
{
  "success": true,
  "report": {
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

### `GET /api/health`
Health check endpoint

## 🔒 Security Notice

⚠️ **Important:** This tool is for authorized security testing only.

- Only scan systems you own or have explicit permission to test
- Follow responsible disclosure practices
- Comply with all applicable laws and regulations
- Do not use for malicious purposes

## 🛠️ Development Scripts

```bash
npm run dev          # Start frontend only
npm run backend      # Start backend only
npm run start        # Start both frontend & backend
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 📚 Scanner Capabilities

### Secret Detection
- AWS Access Keys
- GitHub Tokens
- Stripe API Keys
- Google API Keys
- Private Keys (RSA, EC)
- Database Connection Strings
- JWT Secrets
- Hardcoded Passwords

### Vulnerability Patterns (OWASP Top 10)
- SQL Injection
- Cross-Site Scripting (XSS)
- Command Injection
- Code Injection (eval)
- Weak Cryptography (MD5, SHA1)
- Path Traversal
- CORS Misconfiguration
- Prototype Pollution
- Missing Authentication
- Insecure Randomness

### Security Headers
- Strict-Transport-Security
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Exposed Files/Directories
- `.env` files
- `.git` repositories
- Admin panels
- Database backups
- Debug pages
- Log files
- API documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- React + Vite
- Express.js
- shadcn/ui
- Tailwind CSS
- Lucide Icons
