# Security Fixes Guide - test-vulnerable.ts → test-vulnerable-FIXED.ts

## Summary of All Fixes

| Issue | Severity | Problem | Fix |
|-------|----------|---------|-----|
| **Exposed API Keys** | CRITICAL | Hardcoded in code | Load from `process.env` |
| **SQL Injection** | CRITICAL | String concatenation | Use parameterized queries |
| **Command Injection** | CRITICAL | `exec()` with user input | Use `execFile()` with array args |
| **EVAL Injection** | CRITICAL | `eval()` with user input | Use safe parser library |
| **XSS** | HIGH | Direct HTML rendering | Escape/sanitize output |
| **Path Traversal** | HIGH | No path validation | Normalize & validate paths |
| **Prototype Pollution** | HIGH | Direct object merge | Whitelist keys or deep clone |
| **Missing Auth** | HIGH | No authentication check | Add auth middleware |
| **Weak Cryptography** | HIGH | MD5 for passwords | Use bcrypt (12 rounds) |
| **Insecure Random** | MEDIUM | `Math.random()` | Use `crypto.randomBytes()` |
| **Logging Secrets** | MEDIUM | Log passwords | Never log sensitive data |
| **Insecure CORS** | MEDIUM | Allow all origins | Restrict to specific origins |

---

## Detailed Fix Examples

### 1. ❌ EXPOSED API KEYS → ✅ ENVIRONMENT VARIABLES

**Vulnerable:**
```typescript
const STRIPE_API_KEY = 'sk_live_51234567890abcdefghijk';
const GITHUB_TOKEN = 'ghp_1234567890123456789012345678901234567';
const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE';
```

**Fixed:**
```typescript
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AWS_KEY = process.env.AWS_KEY;

// Validate on startup
if (!STRIPE_API_KEY) {
  throw new Error('Missing STRIPE_API_KEY environment variable');
}
```

**Why:** Keeps secrets out of source code; can rotate without redeploying.

---

### 2. ❌ SQL INJECTION → ✅ PARAMETERIZED QUERIES

**Vulnerable:**
```typescript
const userId = req.params.id;
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query); // Attacker can inject: 1 OR 1=1 --
```

**Fixed:**
```typescript
const userId = req.params.id;
db.query('SELECT * FROM users WHERE id = ?', [userId]); // Safe
// Attack payload "1 OR 1=1 --" is treated as literal string
```

**Why:** Parameterized queries treat user input as data, not code.

---

### 3. ❌ COMMAND INJECTION → ✅ SAFE execFile

**Vulnerable:**
```typescript
const host = req.body.target;
exec(`ping -c 4 ${host}`, (error, stdout) => {
  // Attacker can inject: "8.8.8.8; rm -rf /"
});
```

**Fixed:**
```typescript
const host = req.body.target;
// Validate input
if (!host || !/^[a-zA-Z0-9.-]+$/.test(host)) {
  return res.status(400).json({ error: 'Invalid host' });
}
// Use execFile with array args (no shell interpretation)
execFile('ping', ['-c', '4', host], (error, stdout) => {
  // Host is passed as argument, not shell command
});
```

**Why:** `execFile()` doesn't spawn a shell; arguments are safe from injection.

---

### 4. ❌ XSS → ✅ ESCAPE HTML

**Vulnerable:**
```typescript
const userName = req.query.name;
res.send(`<h1>Welcome ${userName}</h1>`);
// Attacker sends: <img src=x onerror="alert('XSS')">
```

**Fixed:**
```typescript
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const safeName = escapeHtml(userName);
res.send(`<h1>Welcome ${safeName}</h1>`);
// <img> is rendered as text: &lt;img src=x...
```

**Why:** HTML entities prevent browser from interpreting user input as code.

---

### 5. ❌ WEAK CRYPTO (MD5) → ✅ BCRYPT

**Vulnerable:**
```typescript
function hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
  // MD5 is fast to compute → fast to brute-force (billions/sec)
}
```

**Fixed:**
```typescript
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Configurable difficulty
  return await bcrypt.hash(password, saltRounds);
  // bcrypt: ~100ms per hash → slows brute-force attacks
}
```

**Why:** Bcrypt is intentionally slow; salt randomizes output even for same input.

---

### 6. ❌ INSECURE RANDOM → ✅ crypto.randomBytes()

**Vulnerable:**
```typescript
function generateToken(): string {
  return Math.random().toString(36).substring(2);
  // Predictable; low entropy
}
```

**Fixed:**
```typescript
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
  // Strong cryptographic randomness (256 bits)
}
```

**Why:** `Math.random()` is for UI; use crypto randomness for security tokens.

---

### 7. ❌ EVAL INJECTION → ✅ SAFE EXPRESSION PARSER

**Vulnerable:**
```typescript
const expression = req.body.expr;
const result = eval(expression);
// Attacker sends: "process.exit()" or file system access
```

**Fixed:**
```typescript
import { Parser } from 'expr-eval'; // Safe library

try {
  const parser = new Parser();
  const expr = parser.parse(expression);
  const result = expr.evaluate({}); // Only evaluates math expressions
} catch (error) {
  res.status(400).json({ error: 'Invalid expression' });
}
// Supports: "2 + 2", "sin(3.14)", but NOT "process.exit()"
```

**Why:** Never use `eval()`. Use parsers designed for specific languages/formats.

---

### 8. ❌ PATH TRAVERSAL → ✅ PATH VALIDATION

**Vulnerable:**
```typescript
const filePath = req.query.path as string;
fs.readFile(filePath, 'utf8', (err, data) => {
  res.send(data);
  // Attacker sends: "../../../etc/passwd"
});
```

**Fixed:**
```typescript
import path from 'path';

const baseDir = '/safe/files/directory';
const resolvedPath = path.resolve(baseDir, filePath);

// Ensure path stays within base directory
if (!resolvedPath.startsWith(baseDir)) {
  return res.status(403).json({ error: 'Access denied' });
}

fs.readFile(resolvedPath, 'utf8', (err, data) => {
  res.send(data);
  // "../../../etc/passwd" resolved to "/etc/passwd" → blocked
});
```

**Why:** `path.resolve()` normalizes; prefix check prevents escaping base dir.

---

### 9. ❌ PROTOTYPE POLLUTION → ✅ WHITELIST MERGE

**Vulnerable:**
```typescript
const obj = {};
Object.assign(obj, req.body);
// Attacker sends: { "__proto__": { "admin": true } }
// Pollutes all objects' prototype
```

**Fixed:**
```typescript
const safeObj = Object.create(null);
const allowedKeys = ['name', 'email', 'age'];

for (const key of allowedKeys) {
  if (key in req.body) {
    safeObj[key] = req.body[key];
  }
}
// Only whitelisted properties are merged
```

**Why:** Whitelist approach ensures only safe properties are added.

---

### 10. ❌ MISSING AUTH → ✅ AUTH MIDDLEWARE

**Vulnerable:**
```typescript
app.get('/admin', (req, res) => {
  res.json({ admin: 'Panel' });
  // Anyone can access
});
```

**Fixed:**
```typescript
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Verify token...
  next();
};

app.get('/admin', requireAuth, (req, res) => {
  res.json({ admin: 'Panel' });
  // Only authenticated users can access
});
```

**Why:** Authentication middleware protects sensitive endpoints.

---

### 11. ❌ INSECURE CORS → ✅ RESTRICTED CORS

**Vulnerable:**
```typescript
app.use(cors()); // Allow all origins
// Any website can make requests to this API
```

**Fixed:**
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
// Only whitelisted origins can make requests
```

**Why:** Restricts cross-origin requests to trusted domains.

---

### 12. ❌ LOG SECRETS → ✅ LOG SAFELY

**Vulnerable:**
```typescript
const { email, password } = req.body;
console.log(`User login: ${email}, Password: ${password}`);
// Passwords exposed in logs
```

**Fixed:**
```typescript
const { email, password } = req.body;
console.log(`User login attempt: ${email}`);
// Only log non-sensitive info
```

**Why:** Logs are often visible to multiple people; never log secrets.

---

## How to Use This Guide

1. **For Learning:** Compare vulnerable vs fixed side-by-side
2. **For Code Review:** Check if your code follows these patterns
3. **For Testing:** Use `test-vulnerable.ts` as scanner input, expect findings for each issue
4. **For Demos:** Show teams how to fix each vulnerability

---

## Key Takeaways

✅ **Never trust user input** - always validate/sanitize/parameterize  
✅ **Use libraries for security** - bcrypt, expr-eval, path validation, etc.  
✅ **Defense in depth** - multiple layers (auth, validation, escaping, CSP, etc.)  
✅ **Secrets in environment** - rotate without code changes  
✅ **Log safely** - never expose passwords, keys, tokens  
✅ **Framework defaults** - modern frameworks have XSS/CSRF protection built-in  

---

Generated: 2026-02-27
For: Apricity Security Scanner Demo
