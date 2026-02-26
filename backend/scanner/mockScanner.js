// backend/scanner/mockScanner.js
// Safe static demo/sandbox mode - shows realistic vulnerabilities without actually scanning

const mockVulnerabilities = {
  secrets: [
    {
      type: 'AWS Access Key',
      severity: 'Critical',
      issue: 'AWS API key exposed in code',
      evidence: 'AKIA2...',
      file: 'config.js',
      line: 42,
      fix: 'Move to environment variables or AWS Secrets Manager',
      owasp: 'A02 - Cryptographic Failures',
      exploit: 'Attacker gains AWS account access'
    },
    {
      type: 'Database Password',
      severity: 'Critical',
      issue: 'Hardcoded database password found',
      evidence: 'password123',
      file: '.env.example',
      line: 8,
      fix: 'Use environment variables and .env in .gitignore',
      owasp: 'A02 - Cryptographic Failures',
      exploit: 'Direct database compromise'
    },
    {
      type: 'Private API Key',
      severity: 'Critical',
      issue: 'Stripe API secret key exposed',
      evidence: 'sk_live_...',
      file: 'payment.js',
      line: 15,
      fix: 'Rotate key immediately, use backend environment variables',
      owasp: 'A02 - Cryptographic Failures',
      exploit: 'Attacker processes fraudulent charges'
    }
  ],
  
  injections: [
    {
      type: 'SQL Injection',
      severity: 'Critical',
      issue: 'User input directly in SQL query',
      evidence: 'query = "SELECT * FROM users WHERE id=" + req.params.id',
      file: 'database.js',
      line: 54,
      fix: 'Use parameterized queries or prepared statements',
      owasp: 'A03 - Injection',
      exploit: "Attacker sends ' OR 1=1-- to bypass authentication",
      payloads: ["' OR 1=1--", "' UNION SELECT NULL--", "' AND SLEEP(2)--"]
    },
    {
      type: 'Command Injection',
      severity: 'Critical',
      issue: 'Unsanitized command execution',
      evidence: 'exec("ping " + userInput)',
      file: 'utils.js',
      line: 28,
      fix: 'Use safe libraries like child_process with array args',
      owasp: 'A03 - Injection',
      exploit: 'Attacker executes arbitrary system commands',
      payloads: ['; id', '&& whoami', '| cat /etc/passwd']
    },
    {
      type: 'XSS Vulnerability',
      severity: 'High',
      issue: 'User input rendered without sanitization',
      evidence: 'innerHTML = userComment',
      file: 'ui.js',
      line: 92,
      fix: 'Use textContent or sanitize HTML with DOMPurify',
      owasp: 'A03 - Injection',
      exploit: 'Attacker steals session cookies via <script>alert()</script>',
      payloads: ["<img src=x onerror=alert('xss')>", '<svg/onload=alert(1)>']
    }
  ],
  
  headers: [
    {
      type: 'Missing Security Header',
      severity: 'High',
      issue: 'X-Frame-Options header not set',
      evidence: 'Header not found in response',
      fix: 'Add X-Frame-Options: DENY or SAMEORIGIN',
      owasp: 'A05 - Security Misconfiguration',
      exploit: 'Attacker frames your site for clickjacking attacks'
    },
    {
      type: 'Missing CORS Protection',
      severity: 'High',
      issue: 'CORS allows any origin',
      evidence: 'Access-Control-Allow-Origin: *',
      fix: 'Restrict to specific domains: Access-Control-Allow-Origin: https://yourdomain.com',
      owasp: 'A05 - Security Misconfiguration',
      exploit: "Attacker's malicious site can access your API"
    },
    {
      type: 'Missing CSP Header',
      severity: 'Medium',
      issue: 'Content-Security-Policy not configured',
      evidence: 'Header not found in response',
      fix: 'Add CSP header to restrict resource loading',
      owasp: 'A05 - Security Misconfiguration',
      exploit: 'XSS attacks can load external scripts'
    }
  ],
  
  exposed: [
    {
      type: 'Exposed .git Folder',
      severity: 'High',
      issue: '.git directory accessible via web',
      evidence: '/.git/config responds with 200',
      fix: 'Configure web server to block .git access',
      owasp: 'A01 - Broken Access Control',
      exploit: 'Attacker can download your entire source code'
    },
    {
      type: 'Exposed Admin Panel',
      severity: 'High',
      issue: 'Admin panel accessible without authentication',
      evidence: '/admin/ directory found',
      fix: 'Require authentication and IP whitelisting',
      owasp: 'A01 - Broken Access Control',
      exploit: 'Attacker gains administrative access'
    }
  ],
  
  crypto: [
    {
      type: 'Weak Hashing',
      severity: 'High',
      issue: 'MD5 used for password hashing',
      evidence: "createHash('md5')",
      file: 'auth.js',
      line: 45,
      fix: 'Use bcrypt, argon2, or scrypt instead',
      owasp: 'A02 - Cryptographic Failures',
      exploit: 'Attacker cracks passwords using rainbow tables'
    },
    {
      type: 'Insecure Random',
      severity: 'Medium',
      issue: 'Math.random() used for token generation',
      evidence: 'Math.random().toString(36)',
      file: 'token.js',
      line: 12,
      fix: 'Use crypto.randomBytes() for cryptographic randomness',
      owasp: 'A02 - Cryptographic Failures',
      exploit: 'Attacker predicts session/reset tokens'
    }
  ],

  logic: [
    {
      type: 'IDOR + Logic Flaw',
      severity: 'High',
      issue: 'Object access without authorization check',
      evidence: 'GET /api/accounts/:id with trusted x-user-id',
      file: 'routes/accounts.js',
      line: 21,
      fix: 'Verify ownership server-side and avoid trusting client headers',
      owasp: 'A01 - Broken Access Control',
      exploit: 'Attacker reads another user account by changing ID',
      payloads: ['GET /api/accounts/1002', 'x-user-id: u-999']
    }
  ],

  redos: [
    {
      type: 'Regex ReDoS',
      severity: 'High',
      issue: 'Catastrophic backtracking on user input',
      evidence: 'const re = /^(a+)+$/',
      file: 'search.js',
      line: 33,
      fix: 'Use safe regex, timeouts, or linear-time validation',
      owasp: 'A05 - Security Misconfiguration',
      exploit: 'Attacker sends long strings to spike CPU usage',
      payloads: ['a'.repeat(50000) + '!', 'aaaaa!']
    }
  ]
};

/**
 * Generate realistic mock scan results
 * Safe to run on any input - no actual scanning happens
 */
function generateMockScan(target = 'example.com', uploadedCode = null) {
  const findings = [];
  
  // Always include some secrets (static)
  findings.push(...mockVulnerabilities.secrets.slice(0, 3));
  
  // For code uploads, include injection vulns
  if (uploadedCode) {
    findings.push(...mockVulnerabilities.injections.slice(0, 3));
    findings.push(...mockVulnerabilities.crypto.slice(0, 1));
    findings.push(...mockVulnerabilities.logic.slice(0, 1));
    findings.push(...mockVulnerabilities.redos.slice(0, 1));
  } else {
    // For URL scans, include web-based issues
    findings.push(...mockVulnerabilities.headers.slice(0, 2));
    findings.push(...mockVulnerabilities.exposed.slice(0, 1));
  }
  
  return findings;
}

/**
 * Generate mock scan stages
 */
function generateMockStages(target, uploadedCode) {
  const stages = [];
  
  if (uploadedCode) {
    stages.push(
      { stage: 1, name: "Secret Scanning", status: "complete", found: 3 },
      { stage: 2, name: "Vulnerability Patterns", status: "complete", found: 2 },
      { stage: 3, name: "Cryptographic Analysis", status: "complete", found: 1 },
      { stage: 4, name: "Payload Probes (Simulated)", status: "complete", found: 2 }
    );
  } else {
    stages.push(
      { stage: 1, name: "Header Analysis", status: "complete", found: 2 },
      { stage: 2, name: "Directory Scanner", status: "complete", found: 1 },
      { stage: 3, name: "Security Configuration", status: "complete", found: 2 }
    );
  }
  
  return stages;
}

module.exports = {
  generateMockScan,
  generateMockStages,
  mockVulnerabilities
};
