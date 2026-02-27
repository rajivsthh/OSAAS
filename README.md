# OSAAS - Offensive Security as a Service

A modern, professional security scanner built with React + Vite frontend and Node.js backend. Detects OWASP Top 10 vulnerabilities, exposed secrets, and security misconfigurations.

## 🚀 Features

- **Google OAuth & Email Authentication** - Secure Firebase-based login
- **Secret Detection** - Find exposed API keys, tokens, and credentials
- **Vulnerability Scanning** - Detect SQL injection, XSS, command injection, and more
- **Security Header Analysis** - Check HTTP security headers
- **Directory Enumeration** - Discover exposed files and admin panels
- **CVE Matching** - Check against known vulnerabilities
- **Real-time Scanning** - Live progress updates
- **Scan Reports & History** - Track and manage all scans
- **Professional UI** - Clean, minimal interface with Inter typography

## 📋 Prerequisites

- Node.js 18+
- npm or bun
- Firebase project (for authentication)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone https://github.com/Sandbox-3-0/Apricity.git
cd Apricity

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Setup Firebase Authentication

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with Google and Email/Password providers
3. Copy your Web app config from Project Settings → Your apps
4. Create `.env.local` in the root directory:

```dotenv
# Backend API URL
VITE_API_URL=http://localhost:3001

# Firebase Web Config
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

## 🏃 Running the Application

### Option 1: Run Both Frontend & Backend Together (Recommended)

```bash
npm run start
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### First Time Setup (Linux/Flatpak Users)

If you're using Flatpak VS Code, run the backend in a **system terminal** instead of the VS Code terminal:

```bash
# In your system terminal (not VS Code)
cd /home/rarch/Documents/Apricity
npm run backend
```

## 🧪 Testing the Scanner

### Authenticate First

1. Open http://localhost:5173
2. Click **"Sign in to Apricity"**
3. Login with Google or create an account with email/password

### Test with Uploaded Code

1. Navigate to the **Scanner** page
2. Upload `backend/test-vulnerable.js` or select a code file
3. Click **"Start Scan"**
4. View real-time scan results

### Test with a URL

1. Enter a target URL (e.g., `https://example.com`)
2. Click **"Start Scan"**
3. View security analysis results

### View Your Scan History

1. Go to **Reports** page
2. See all past scans with severity breakdowns
3. Download scan reports as JSON

## 🎭 Sandbox Mode (Demo Environment)

Sandbox Mode allows you to demo the scanner without performing real security scans. Perfect for hackathons, presentations, or safety testing on potentially malicious files.

### What is Sandbox Mode?

When enabled, the scanner returns **pre-defined static vulnerabilities** instead of actually scanning your code/URLs. This means:

✅ **No real network requests** - Won't actually scan external URLs  
✅ **No file system access** - Won't analyze uploaded files  
✅ **Safe demonstrations** - Shows realistic vulnerabilities without risk  
✅ **Instant results** - Static findings return immediately  
✅ **Visual indicators** - UI clearly shows "SANDBOX MODE" status  

### Enabling Sandbox Mode

1. Open `backend/.env`:
```bash
# Set to 'true' for sandbox mode
DEMO_MODE=true
```

2. Restart the backend:
```bash
npm run backend
```

### What You'll See in Sandbox Mode

**Scanner Results Include:**
- 🎭 Prominent "SANDBOX MODE" banner
- 16 pre-loaded realistic vulnerabilities (secrets, injections, headers, etc.)
- Professional Nikto-style ranking (CVSS scores, Priority P1-P5)
- Instant scan completion (no delays)

**Reports Page Shows:**
- 🎭 "SANDBOX" badge on each demo scan
- Categorized findings (Sensitive Data, Injection, XSS, Auth, etc.)
- Risk scores and severity breakdowns
- Downloadable JSON reports

### Example Sandbox Vulnerabilities

The demo includes:
- **Secrets**: AWS keys, database passwords, Stripe API keys
- **Injections**: SQL injection, Command injection, XSS patterns
- **Headers**: Missing security headers, CORS misconfiguration
- **Exposed Files**: .git folders, admin panels
- **Crypto Issues**: MD5 hashing, insecure random functions

### Disabling Sandbox Mode

To perform **real scans** again:

```bash
# In backend/.env
DEMO_MODE=false

# Restart backend
npm run backend
```

## 📁 Project Structure

```
Apricity/
├── src/                         # Frontend React TypeScript
│   ├── components/              # UI components (buttons, cards, etc)
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── ProtectedRoute.tsx   # Auth-protected pages
│   │   ├── TopNav.tsx           # Navigation bar
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Login.tsx            # Firebase login/signup
│   │   ├── Home.tsx             # Landing page
│   │   ├── Scanner.tsx          # Main scanning interface
│   │   ├── Dashboard.tsx        # Statistics dashboard
│   │   ├── Reports.tsx          # Scan history view
│   │   ├── Exploits.tsx         # Exploit database
│   │   └── NotFound.tsx         # 404 page
│   ├── contexts/
│   │   └── AuthContext.tsx      # Firebase auth state management
│   ├── lib/
│   │   ├── firebase.ts          # Firebase initialization
│   │   └── api.ts               # API client with auth tokens
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── backend/                      # Node.js Express backend
│   ├── server.js                # Main API server
│   ├── config/
│   │   └── firebase.js          # Firebase Admin SDK setup
│   ├── middleware/
│   │   └── auth.js              # Firebase token verification
│   ├── scanner/
│   │   └── index.js             # Main scanner orchestrator
│   ├── scanners/                # Individual scanner modules
│   │   ├── secretScanner.js
│   │   ├── patternScanner.js
│   │   ├── headerScanner.js
│   │   ├── directoryScanner.js
│   │   ├── cveScanner.js
│   │   └── rateLimitScanner.js
│   ├── utils/
│   │   └── historyManager.js    # Local scan history storage
│   ├── data/
│   │   └── scan-history.json    # Scan results cache
│   ├── package.json
│   └── .env.example             # Backend environment template
│
├── DEPLOYMENT.md                # Deployment guide (Render, Railway, Vercel)
├── TROUBLESHOOTING.md           # Common issues & fixes
├── package.json                 # Root dependencies
├── tailwind.config.ts           # Tailwind CSS configuration
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
└── index.html                   # Entry HTML file
```

## 🔌 API Endpoints

All endpoints require Firebase authentication token in the `Authorization: Bearer <token>` header.

### `POST /api/scan`
Main scanning endpoint

**Request:**
- `target` (string, optional) - URL to scan
- `file` (file, optional) - Source code file to analyze

**Response:**
```json
{
  "success": true,
  "report": {
    "target": "https://example.com",
    "timestamp": "2026-02-26T10:30:00Z",
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
Health check endpoint (no auth required)

**Response:**
```json
{
  "status": "ok",
  "message": "Backend running",
  "timestamp": "2026-02-26T10:30:00Z"
}
```

### `GET /api/history`
Get user's scan history

**Response:**
```json
{
  "success": true,
  "history": [
    { "id": "scan1", "target": "example.com", "summary": {...}, "timestamp": "..." },
    ...
  ]
}
```

### `GET /api/dashboard/stats`
Get dashboard statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalScans": 42,
    "criticalFindings": 15,
    "highFindings": 28,
    "userScans": 12,
    "lastScan": "2026-02-26T10:30:00Z"
  }
}
```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guides:

- **Render.com** (Recommended - Free tier)
- **Railway.app**
- **Vercel** (Frontend) + Backend
- **Docker** (Full stack)

Quick start:
```bash
# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Render/Railway
# Push to GitHub, connect repo, auto-deploys
```

## 🔒 Security Notice (Important)

⚠️ **This tool is for authorized security testing only.**

**Do's:**
- ✅ Only scan systems you own or have **explicit written permission** to test
- ✅ Follow **responsible disclosure** practices  
- ✅ Comply with all applicable **laws and regulations** in your jurisdiction
- ✅ Report findings to affected organizations securely
- ✅ Allow reasonable time for fixes (typically 30-90 days)

**Don'ts:**
- ❌ Do not use for malicious purposes, hacking, or unauthorized access
- ❌ Do not use for DDoS or performance attacks
- ❌ Do not bypass authentication or security mechanisms
- ❌ Do not publicly disclose vulnerabilities before patched

**If you find vulnerabilities:**
1. Document them clearly with reproduction steps
2. Contact the organization's security team
3. Do not share publicly until they confirm the fix

## 🔒 Security Notice

⚠️ **Important:** This tool is for authorized security testing only.

- Only scan systems you own or have explicit permission to test
- Follow responsible disclosure practices
- Comply with all applicable laws and regulations
- Do not use for malicious purposes

## 🛠️ Development Scripts

```bash
npm run dev              # Start frontend only (port 5173)
npm run backend          # Start backend only (port 3001)
npm run start            # Start both frontend & backend
npm run build            # Build frontend for production
npm run lint             # Check code with ESLint
npm run test             # Run tests
npm run test:watch      # Run tests in watch mode
```

## 🔐 Authentication

The app uses **Firebase Authentication** for secure access:

### Login Methods
- **Google OAuth** - One-click Google login
- **Email/Password** - Create account with email

### Protected Routes
- Scanner page requires authentication
- Reports page requires authentication
- Dashboard requires authentication
- Home/Exploits pages are public

### Auth Context
The `useAuth()` hook provides:
```typescript
{
  isAuthenticated: boolean,
  user: { name, email, avatar, uid },
  logout: () => Promise<void>,
  loading: boolean
}
```

## 📚 Scanner Capabilities

### Secret Detection
- AWS Access Keys & Secrets
- GitHub/GitLab Tokens
- Stripe/PayPal API Keys
- Google/Azure API Keys
- Private Keys (RSA, EC, DSA)
- Database Connection Strings
- JWT Secrets & Tokens
- Hardcoded Passwords & Credentials
- Auth tokens (Bearer, Basic)

### Vulnerability Patterns (OWASP Top 10)
- **Injection**: SQL, Command, Code (eval), NoSQL
- **XSS**: Stored, Reflected, DOM-based
- **Weak Cryptography**: MD5, SHA1, DES
- **Security Issues**: CORS misconfiguration, prototype pollution
- **Auth**: Missing authentication, weak session management
- **Path Traversal**: Directory traversal, arbitrary file access
- **Random Generation**: Insecure randomness, weak seeds

### Security Headers
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Exposed Assets
- `.env` files
- `.git` repositories
- Admin/management panels
- Database backups & dumps
- Debug/test pages
- Sensitive log files
- API documentation
- Config files (web.config, .htaccess)

## 👥 Team Development

### Sharing with Teammates (Hackathon Mode)

1. Share the Firebase credentials (web config only):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

2. Each teammate clones the repo and adds `.env.local`:
```bash
git clone https://github.com/Sandbox-3-0/Apricity.git
cd Apricity
echo "VITE_API_URL=http://localhost:3001" > .env.local
echo "VITE_FIREBASE_API_KEY=..." >> .env.local
# (add remaining Firebase vars)
```

3. Run locally:
```bash
npm install && cd backend && npm install && cd ..
npm run start
```

**Note:** Each teammate must run their own backend locally. For a shared server setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

## 📄 License

MIT - See LICENSE file for details

## 🙏 Acknowledgments

Built with:
- **React 18 + Vite** - Fast frontend development
- **TypeScript** - Type-safe code
- **Express.js** - Lightweight backend framework
- **Firebase** - Authentication & real-time services
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Modern icon set

## 📞 Support

- 📖 Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 📘 See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting guides
- 🐛 Report issues on GitHub Issues
- 💬 Discussions welcome!

---

**Made with ❤️ for the security community**
