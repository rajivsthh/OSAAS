// scanners/cveScanner.js
const axios = require('axios')

async function checkCVE(technology, version) {
  const findings = []

  try {
    // Query NVD free API
    const response = await axios.get(
      'https://services.nvd.nist.gov/rest/json/cves/2.0',
      {
        params: {
          keywordSearch: `${technology} ${version}`,
          cvssV3SeverityMin: 'HIGH'
        },
        timeout: 10000
      }
    )

    const cves = response.data.vulnerabilities || []

    cves.slice(0, 3).forEach(vuln => {
      const cve = vuln.cve
      const metrics = cve.metrics?.cvssMetricV31?.[0]
      const cvssScore = metrics?.cvssData?.baseScore

      findings.push({
        type: "KNOWN_CVE",
        severity: cvssScore >= 9.0 ? "Critical" : "High",
        cveId: cve.id,
        technology: technology,
        version: version,
        cvssScore: cvssScore,
        description: cve.descriptions[0]?.value?.substring(0, 200),
        fix: `Update ${technology} to latest stable version`,
        owasp: "A06 - Vulnerable and Outdated Components"
      })
    })

  } catch (error) {
    console.log(`CVE check failed for ${technology}: ${error.message}`)
  }

  return findings
}

async function checkCISAKev(cveId) {
  try {
    const response = await axios.get(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      { timeout: 10000 }
    )
    const vulns = response.data.vulnerabilities
    return vulns.some(v => v.cveID === cveId)
  } catch {
    return false
  }
}

// Detect technologies from HTML/headers
function detectTechnologies(html, headers) {
  const detected = []

  const signatures = {
    "WordPress": {
      pattern: /wp-content|wp-includes/i,
      versionPattern: /WordPress\s+([\d.]+)/i
    },
    "jQuery": {
      pattern: /jquery[.-]([\d.]+)/i,
      versionPattern: /jquery[.-]([\d.]+)/i
    },
    "React": {
      pattern: /react[.-]([\d.]+)/i,
      versionPattern: /react[.-]([\d.]+)/i
    },
    "Express": {
      pattern: /Express/i,
      versionPattern: /Express\/([\d.]+)/i
    }
  }

  Object.entries(signatures).forEach(([tech, info]) => {
    const match = html.match(info.versionPattern)
    if (match) {
      detected.push({
        technology: tech,
        version: match[1]
      })
    }
  })

  return detected
}

module.exports = { checkCVE, checkCISAKev, detectTechnologies }
