// Example vulnerable code for testing the scanner
// WARNING: This contains intentional vulnerabilities for demonstration only

const express = require('express');
const mysql = require('mysql');
const app = express();

// CRITICAL: Exposed secrets (EXAMPLE - DO NOT USE REAL KEYS)
const AWS_ACCESS_KEY = 'AKIA_PLACEHOLDER_PLACEHOLDER_KEYS';
const stripe_key = 'sk_test_placeholder_stripe_key';
const password = 'admin123456';
const jwt_secret = 'my-super-secret-jwt-key-12345';

// Database connection with hardcoded credentials
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'users_db'
});

// CRITICAL: SQL Injection vulnerability
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId; // Vulnerable!
  connection.query(query, (error, results) => {
    res.json(results);
  });
});

// HIGH: XSS vulnerability
app.get('/comment', (req, res) => {
  const comment = req.query.comment;
  res.send('<div>' + comment + '</div>'); // Vulnerable to XSS!
});

// CRITICAL: Command Injection
app.get('/ping', (req, res) => {
  const host = req.query.host;
  const { exec } = require('child_process');
  exec('ping ' + host, (error, stdout) => {
    res.send(stdout);
  });
});

// HIGH: Weak cryptography (MD5)
const crypto = require('crypto');
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// MEDIUM: Insecure random for session tokens
function generateSessionToken() {
  return Math.random().toString(36); // Insecure!
}

// MEDIUM: Logging sensitive data
app.post('/login', (req, res) => {
  console.log('Login attempt with password:', req.body.password);
  // ... login logic
});

// HIGH: Path Traversal vulnerability
const fs = require('fs');
app.get('/file', (req, res) => {
  const filename = req.query.file;
  fs.readFile(filename, 'utf8', (err, data) => {
    res.send(data);
  });
});

// CRITICAL: Eval injection
app.post('/calculate', (req, res) => {
  const expression = req.body.expression;
  const result = eval(expression); // Never use eval with user input!
  res.json({ result });
});

app.listen(3000);
