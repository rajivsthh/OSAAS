// scanners/patternScanner.js

const VULNERABILITY_PATTERNS = {
  
  SQL_INJECTION: {
    patterns: [
      /query\s*\+\s*req\./gi,
      /query\s*=.*\$\{.*req\./gi,
      /`SELECT.*\$\{/gi,
      /`INSERT.*\$\{/gi,
      /`UPDATE.*\$\{/gi,
      /`DELETE.*\$\{/gi,
      /query\(.*\+.*\)/gi,
    ],
    severity: "Critical",
    issue: "SQL Injection vulnerability",
    fix: "Use parameterized queries or prepared statements",
    owasp: "A03 - Injection",
    exploit: "Attacker sends ' OR 1=1-- to bypass authentication"
  },

  XSS: {
    patterns: [
      /innerHTML\s*=.*req\./gi,
      /innerHTML\s*=.*params\./gi,
      /document\.write\(.*req\./gi,
      /\.html\(.*req\./gi,
      /dangerouslySetInnerHTML/gi,
    ],
    severity: "High",
    issue: "Cross-Site Scripting (XSS) vulnerability",
    fix: "Sanitize and encode all user inputs before rendering",
    owasp: "A03 - Injection",
    exploit: "Attacker injects <script>alert(document.cookie)</script>"
  },

  COMMAND_INJECTION: {
    patterns: [
      /exec\s*\(.*req\./gi,
      /exec\s*\(.*params\./gi,
      /spawn\s*\(.*req\./gi,
      /execSync\s*\(.*req\./gi,
      /child_process.*req\./gi,
    ],
    severity: "Critical",
    issue: "Command Injection vulnerability",
    fix: "Never pass user input to system commands",
    owasp: "A03 - Injection",
    exploit: "Attacker sends ; rm -rf / as input parameter"
  },

  EVAL_INJECTION: {
    patterns: [
      /eval\s*\(.*req\./gi,
      /eval\s*\(.*params\./gi,
      /eval\s*\(.*body\./gi,
      /new\s+Function\s*\(.*req\./gi,
    ],
    severity: "Critical",
    issue: "Code Injection via eval()",
    fix: "Never use eval() with user input",
    owasp: "A03 - Injection",
    exploit: "Attacker executes arbitrary JavaScript on server"
  },

  BROKEN_AUTH: {
    patterns: [
      /md5\s*\(/gi,
      /sha1\s*\(/gi,
      /createHash\s*\(\s*['"]md5['"]/gi,
      /createHash\s*\(\s*['"]sha1['"]/gi,
    ],
    severity: "High",
    issue: "Weak cryptographic algorithm (MD5/SHA1)",
    fix: "Use bcrypt, argon2, or SHA-256 minimum for passwords",
    owasp: "A02 - Cryptographic Failures",
    exploit: "Attacker cracks password hashes using rainbow tables"
  },

  MISSING_AUTH: {
    patterns: [
      /router\.(get|post|put|delete)\s*\([^,]+,\s*async?\s*\(req/gi,
    ],
    severity: "Medium",
    issue: "Possible missing authentication middleware",
    fix: "Ensure all sensitive routes have authentication middleware",
    owasp: "A07 - Authentication Failures",
    exploit: "Attacker accesses protected endpoints without logging in"
  },

  INSECURE_RANDOM: {
    patterns: [
      /Math\.random\(\)/gi,
    ],
    severity: "Medium",
    issue: "Insecure random number generation",
    fix: "Use crypto.randomBytes() for security-sensitive randomness",
    owasp: "A02 - Cryptographic Failures",
    exploit: "Attacker predicts tokens or session IDs"
  },

  SENSITIVE_DATA_LOG: {
    patterns: [
      /console\.log.*password/gi,
      /console\.log.*token/gi,
      /console\.log.*secret/gi,
      /console\.log.*key/gi,
    ],
    severity: "Medium",
    issue: "Sensitive data exposed in console logs",
    fix: "Remove all console.log statements with sensitive data",
    owasp: "A09 - Security Logging Failures",
    exploit: "Anyone with server log access harvests credentials"
  },

  PATH_TRAVERSAL: {
    patterns: [
      /readFile\s*\(.*req\./gi,
      /readFileSync\s*\(.*req\./gi,
      /\.\.\/.*req\./gi,
      /path\.join\(.*req\./gi,
    ],
    severity: "High",
    issue: "Path Traversal vulnerability",
    fix: "Validate and sanitize file paths, use allowlists",
    owasp: "A01 - Broken Access Control",
    exploit: "Attacker reads /etc/passwd by sending ../../../etc/passwd"
  },

  CORS_MISCONFIGURATION: {
    patterns: [
      /cors\(\s*\)/gi,
      /origin:\s*['"\*]/gi,
      /Access-Control-Allow-Origin.*\*/gi,
    ],
    severity: "Medium",
    issue: "Overly permissive CORS configuration",
    fix: "Restrict CORS to specific trusted domains only",
    owasp: "A05 - Security Misconfiguration",
    exploit: "Malicious websites make authenticated requests on user's behalf"
  },

  PROTOTYPE_POLLUTION: {
    patterns: [
      /\.__proto__/gi,
      /Object\.assign\(.*req\./gi,
      /\.constructor\[/gi,
    ],
    severity: "High",
    issue: "Prototype Pollution vulnerability",
    fix: "Validate object inputs, use Object.create(null)",
    owasp: "A03 - Injection",
    exploit: "Attacker modifies JavaScript object prototypes"
  }
}

function scanPatterns(code, filename = "") {
  const findings = []
  const lines = code.split('\n')

  lines.forEach((line, lineIndex) => {
    Object.entries(VULNERABILITY_PATTERNS).forEach(([vulnType, info]) => {
      info.patterns.forEach(pattern => {
        pattern.lastIndex = 0
        if (pattern.test(line)) {
          // Avoid duplicate findings on same line
          const exists = findings.some(
            f => f.type === vulnType && f.line === lineIndex + 1
          )
          
          if (!exists) {
            findings.push({
              type: vulnType,
              severity: info.severity,
              line: lineIndex + 1,
              file: filename,
              evidence: line.trim().substring(0, 150),
              issue: info.issue,
              fix: info.fix,
              owasp: info.owasp,
              exploit: info.exploit
            })
          }
        }
      })
    })
  })

  return findings
}

module.exports = { scanPatterns }
