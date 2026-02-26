// scanners/secretScanner.js

const SECRET_PATTERNS = {
  AWS_ACCESS_KEY: {
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: "Critical",
    fix: "Rotate AWS key immediately, use environment variables"
  },
  GITHUB_TOKEN: {
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    severity: "Critical",
    fix: "Revoke GitHub token immediately"
  },
  STRIPE_KEY: {
    pattern: /sk_live_[0-9a-zA-Z]{24}/g,
    severity: "Critical",
    fix: "Rotate Stripe key immediately"
  },
  GOOGLE_API_KEY: {
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
    severity: "Critical",
    fix: "Rotate Google API key immediately"
  },
  PRIVATE_KEY: {
    pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/g,
    severity: "Critical",
    fix: "Remove private key from code immediately"
  },
  HARDCODED_PASSWORD: {
    pattern: /password\s*=\s*["'][^"']{4,}["']/gi,
    severity: "High",
    fix: "Move passwords to environment variables"
  },
  HARDCODED_API_KEY: {
    pattern: /api[_-]?key\s*=\s*["'][^"']{8,}["']/gi,
    severity: "High",
    fix: "Move API keys to environment variables"
  },
  DATABASE_URL: {
    pattern: /(mysql|postgres|mongodb):\/\/[^:]+:[^@]+@/gi,
    severity: "Critical",
    fix: "Never hardcode database URLs with credentials"
  },
  JWT_SECRET: {
    pattern: /jwt[_-]?secret\s*=\s*["'][^"']{8,}["']/gi,
    severity: "Critical",
    fix: "Move JWT secret to environment variables"
  }
}

function scanSecrets(code, filename = "") {
  const findings = []
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    Object.entries(SECRET_PATTERNS).forEach(([type, info]) => {
      // Reset regex lastIndex
      info.pattern.lastIndex = 0
      
      if (info.pattern.test(line)) {
        findings.push({
          type: "EXPOSED_SECRET",
          secretType: type,
          severity: info.severity,
          line: index + 1,
          file: filename,
          evidence: line.trim().substring(0, 100),
          issue: `Hardcoded ${type} found in code`,
          fix: info.fix,
          owasp: "A02 - Cryptographic Failures"
        })
      }
    })
  })

  return findings
}

module.exports = { scanSecrets }
