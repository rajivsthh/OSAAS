// test-vulnerable.ts - Intentionally vulnerable TypeScript for testing
// WARNING: Contains intentional vulnerabilities for scanner demonstration only

import express from 'express';
import { exec } from 'child_process';
import * as crypto from 'crypto';

const app = express();

// CRITICAL: Exposed API Keys
const STRIPE_API_KEY = 'sk_test_placeholder';
const GITHUB_TOKEN = 'ghp_placeholder';
const AWS_KEY = 'AKIA_PLACEHOLDER';
const jwt_secret = 'my-super-secret-jwt-key-12345';

// CRITICAL: Hardcoded Database Credentials
const dbConnection = {
  host: 'localhost',
  user: 'admin',
  password: 'admin123456',
  database: 'production_db'
};

// CRITICAL: SQL Injection
app.get('/user/:id', (req: express.Request, res: express.Response) => {
  const userId = req.params.id;
  // Vulnerable: directly concatenating user input
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  // db.query(query, (err, results) => {
  //   res.json(results);
  // });
});

// HIGH: XSS Vulnerability
app.get('/profile', (req: express.Request, res: express.Response) => {
  const userName = req.query.name;
  // Vulnerable: directly rendering user input
  res.send(`<h1>Welcome ${userName}</h1>`);
});

// CRITICAL: Command Injection
app.post('/ping', (req: express.Request, res: express.Response) => {
  const host = req.body.target;
  // Vulnerable: passing user input to system commands
  exec(`ping -c 4 ${host}`, (error, stdout) => {
    res.json({ output: stdout });
  });
});

// HIGH: Weak Cryptography (MD5)
function hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}

// MEDIUM: Insecure Random
function generateToken(): string {
  return Math.random().toString(36).substring(2);
}

// MEDIUM: Logging Sensitive Data
app.post('/login', (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  console.log(`User login: ${email}, Password: ${password}`);
  // authenticate(email, password);
});

// CRITICAL: EVAL Injection
app.post('/calculate', (req: express.Request, res: express.Response) => {
  const expression = req.body.expr;
  // Vulnerable: using eval with user input
  const result = eval(expression);
  res.json({ result });
});

// HIGH: Path Traversal
app.get('/file', (req: express.Request, res: express.Response) => {
  const filePath = req.query.path as string;
  // Vulnerable: no path validation
  // fs.readFile(filePath, 'utf8', (err, data) => {
  //   res.send(data);
  // });
});

// HIGH: Prototype Pollution
app.post('/merge', (req: express.Request, res: express.Response) => {
  const obj = {};
  // Vulnerable: Object.assign with user input
  Object.assign(obj, req.body);
  res.json({ success: true });
});

// MEDIUM: Insecure CORS
app.use(require('cors')());

// HIGH: Missing Authentication
app.get('/admin', (req: express.Request, res: express.Response) => {
  // No authentication check!
  res.json({ admin: 'Panel' });
});

// Export
export default app;
