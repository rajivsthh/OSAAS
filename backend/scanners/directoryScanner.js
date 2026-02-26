// scanners/directoryScanner.js
const axios = require('axios')

const SENSITIVE_PATHS = [
  // Critical
  { path: "/.env",           severity: "Critical", issue: "Environment file exposed — contains secrets" },
  { path: "/.git",           severity: "Critical", issue: "Git repository exposed — source code leaked" },
  { path: "/.git/config",    severity: "Critical", issue: "Git config exposed" },
  { path: "/config.js",      severity: "Critical", issue: "Config file exposed" },
  { path: "/config.php",     severity: "Critical", issue: "PHP config exposed" },
  { path: "/.env.local",     severity: "Critical", issue: "Local env file exposed" },
  { path: "/.env.production",severity: "Critical", issue: "Production env file exposed" },
  
  // Admin panels
  { path: "/admin",          severity: "High", issue: "Admin panel exposed" },
  { path: "/wp-admin",       severity: "High", issue: "WordPress admin exposed" },
  { path: "/phpmyadmin",     severity: "Critical", issue: "Database admin panel exposed" },
  { path: "/administrator",  severity: "High", issue: "Admin panel exposed" },
  
  // API endpoints
  { path: "/api/users",      severity: "High", issue: "User data endpoint exposed" },
  { path: "/api/admin",      severity: "High", issue: "Admin API exposed" },
  { path: "/swagger",        severity: "Medium", issue: "API documentation exposed" },
  { path: "/api-docs",       severity: "Medium", issue: "API documentation exposed" },
  
  // Debug pages
  { path: "/debug",          severity: "High", issue: "Debug page exposed" },
  { path: "/phpinfo.php",    severity: "High", issue: "PHP info page exposed" },
  { path: "/server-status",  severity: "Medium", issue: "Server status exposed" },
  
  // Backups
  { path: "/backup.zip",     severity: "Critical", issue: "Backup file exposed" },
  { path: "/backup.sql",     severity: "Critical", issue: "Database backup exposed" },
  { path: "/db.sql",         severity: "Critical", issue: "Database file exposed" },
  
  // Logs
  { path: "/error.log",      severity: "High", issue: "Error logs exposed" },
  { path: "/access.log",     severity: "High", issue: "Access logs exposed" },
]

async function scanDirectories(target) {
  const findings = []
  const baseUrl = target.startsWith('http') ? target : `https://${target}`

  // Run all checks in parallel for speed
  const checks = SENSITIVE_PATHS.map(async ({ path, severity, issue }) => {
    try {
      const response = await axios.get(`${baseUrl}${path}`, {
        timeout: 5000,
        validateStatus: () => true,
        maxRedirects: 0
      })

      if (response.status === 200) {
        return {
          type: "EXPOSED_PATH",
          severity: severity,
          path: path,
          url: `${baseUrl}${path}`,
          issue: issue,
          fix: `Restrict access to ${path} or remove it completely`,
          owasp: "A05 - Security Misconfiguration"
        }
      }
    } catch (e) {
      return null
    }
  })

  const results = await Promise.all(checks)
  results.forEach(r => r && findings.push(r))

  return findings
}

module.exports = { scanDirectories }
