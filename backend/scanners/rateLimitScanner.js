// scanners/rateLimitScanner.js
const axios = require('axios')

async function checkRateLimit(target) {
  const findings = []
  const url = target.startsWith('http') ? target : `https://${target}`

  try {
    // Send 15 rapid requests
    const requests = Array(15).fill(null).map(() =>
      axios.get(url, {
        timeout: 5000,
        validateStatus: () => true
      })
    )

    const responses = await Promise.all(requests)
    const successCount = responses.filter(r => r.status === 200).length
    const blockedCount = responses.filter(r => r.status === 429).length

    if (successCount === 15 && blockedCount === 0) {
      findings.push({
        type: "NO_RATE_LIMITING",
        severity: "High",
        issue: "No rate limiting detected",
        detail: "15 rapid requests all succeeded — brute force attacks possible",
        fix: "Implement rate limiting — max 5-10 requests per second per IP",
        owasp: "A07 - Authentication Failures"
      })
    }

  } catch (error) {
    console.log(`Rate limit check failed: ${error.message}`)
  }

  return findings
}

module.exports = { checkRateLimit }
