// scanners/headerScanner.js
const axios = require('axios')

const REQUIRED_HEADERS = {
  "Strict-Transport-Security": {
    severity: "High",
    risk: "Allows HTTP downgrade attacks",
    fix: "Add: Strict-Transport-Security: max-age=31536000; includeSubDomains"
  },
  "Content-Security-Policy": {
    severity: "High",
    risk: "XSS attacks easier without CSP",
    fix: "Add Content-Security-Policy restricting script sources"
  },
  "X-Frame-Options": {
    severity: "Medium",
    risk: "Clickjacking attacks possible",
    fix: "Add: X-Frame-Options: DENY"
  },
  "X-Content-Type-Options": {
    severity: "Medium",
    risk: "MIME sniffing attacks possible",
    fix: "Add: X-Content-Type-Options: nosniff"
  },
  "Referrer-Policy": {
    severity: "Low",
    risk: "Leaks URLs to third parties",
    fix: "Add: Referrer-Policy: strict-origin-when-cross-origin"
  }
}

const DANGEROUS_HEADERS = {
  "X-Powered-By": {
    severity: "Low",
    risk: "Reveals technology stack",
    fix: "Remove X-Powered-By header"
  },
  "Server": {
    severity: "Low",
    risk: "Reveals server software version",
    fix: "Remove or obscure Server header"
  }
}

async function scanHeaders(target) {
  const findings = []

  try {
    const url = target.startsWith('http') ? target : `https://${target}`
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
      maxRedirects: 5
    })

    const headers = response.headers

    // Check missing security headers
    Object.entries(REQUIRED_HEADERS).forEach(([header, info]) => {
      if (!headers[header.toLowerCase()]) {
        findings.push({
          type: "MISSING_HEADER",
          severity: info.severity,
          header: header,
          issue: `Missing security header: ${header}`,
          risk: info.risk,
          fix: info.fix,
          owasp: "A05 - Security Misconfiguration"
        })
      }
    })

    // Check dangerous headers
    Object.entries(DANGEROUS_HEADERS).forEach(([header, info]) => {
      if (headers[header.toLowerCase()]) {
        findings.push({
          type: "DANGEROUS_HEADER",
          severity: info.severity,
          header: header,
          value: headers[header.toLowerCase()],
          issue: `Information disclosure via ${header} header`,
          risk: info.risk,
          fix: info.fix,
          owasp: "A05 - Security Misconfiguration"
        })
      }
    })

  } catch (error) {
    findings.push({
      type: "SCAN_ERROR",
      severity: "Info",
      issue: `Could not reach target: ${error.message}`
    })
  }

  return findings
}

module.exports = { scanHeaders }
