// scanner/index.js
const { scanSecrets } = require('../scanners/secretScanner')
const { scanPatterns } = require('../scanners/patternScanner')
const { scanHeaders } = require('../scanners/headerScanner')
const { scanDirectories } = require('../scanners/directoryScanner')
const { checkCVE, detectTechnologies } = require('../scanners/cveScanner')
const { checkRateLimit } = require('../scanners/rateLimitScanner')
const { generateAIReport } = require('../ai/reportGenerator')

async function runFullScan(target, uploadedCode = null, filename = "") {
  console.log(`\n🔍 BountyAI scanning: ${target || 'uploaded code'}\n`)
  
  const allFindings = []
  const stages = []

  // Stage 1: Secret scan (if code uploaded)
  if (uploadedCode) {
    console.log('[1/6] Scanning for secrets...')
    stages.push({ stage: 1, name: "Secret Scanning", status: "running" })
    const secrets = scanSecrets(uploadedCode, filename)
    allFindings.push(...secrets)
    stages[0].status = "complete"
    stages[0].found = secrets.length
  }

  // Stage 2: Pattern scan (if code uploaded)
  if (uploadedCode) {
    console.log('[2/6] Scanning vulnerability patterns...')
    stages.push({ stage: 2, name: "Vulnerability Patterns", status: "running" })
    const patterns = scanPatterns(uploadedCode, filename)
    allFindings.push(...patterns)
    stages[stages.length-1].status = "complete"
    stages[stages.length-1].found = patterns.length
  }

  // Stage 3: Header scan (if target URL given)
  if (target) {
    console.log('[3/6] Analyzing security headers...')
    stages.push({ stage: 3, name: "Header Analysis", status: "running" })
    const headers = await scanHeaders(target)
    allFindings.push(...headers)
    stages[stages.length-1].status = "complete"
    stages[stages.length-1].found = headers.length
  }

  // Stage 4: Directory scan
  if (target) {
    console.log('[4/6] Scanning exposed directories...')
    stages.push({ stage: 4, name: "Directory Scanner", status: "running" })
    const dirs = await scanDirectories(target)
    allFindings.push(...dirs)
    stages[stages.length-1].status = "complete"
    stages[stages.length-1].found = dirs.length
  }

  // Stage 5: Rate limit check
  if (target) {
    console.log('[5/6] Checking rate limiting...')
    stages.push({ stage: 5, name: "Rate Limit Check", status: "running" })
    const rateLimits = await checkRateLimit(target)
    allFindings.push(...rateLimits)
    stages[stages.length-1].status = "complete"
    stages[stages.length-1].found = rateLimits.length
  }

  // Stage 6: Generate report
  console.log('[6/6] Generating report...')

  return generateReport(target, allFindings, stages, filename)
}

async function generateReport(target, findings, stages, filename = "") {
  const critical = findings.filter(f => f.severity === "Critical")
  const high = findings.filter(f => f.severity === "High")
  const medium = findings.filter(f => f.severity === "Medium")
  const low = findings.filter(f => f.severity === "Low")

  // Calculate risk score
  let score = 0
  critical.forEach(() => score += 25)
  high.forEach(() => score += 15)
  medium.forEach(() => score += 8)
  low.forEach(() => score += 3)
  const riskScore = Math.min(score, 100)

  const baseReport = {
    id: generateReportId(),
    target: target || filename,
    scanTime: new Date().toISOString(),
    stages,
    summary: {
      total: findings.length,
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      riskScore,
      riskLevel: riskScore >= 75 ? "CRITICAL" :
                 riskScore >= 50 ? "HIGH" :
                 riskScore >= 25 ? "MEDIUM" : "LOW"
    },
    findings,
    // Attacker's easiest path
    attackPath: critical.concat(high).slice(0, 3).map(f => ({
      step: f.issue,
      exploit: f.exploit,
      timeToExploit: f.severity === "Critical" ? "< 5 mins" : "< 30 mins"
    }))
  }

  // Generate AI summary
  try {
    console.log('[7/7] Generating AI summary...')
    const aiReport = await generateAIReport(baseReport)
    baseReport.aiSummary = aiReport
  } catch (error) {
    console.log('AI summary generation skipped:', error.message)
  }

  return baseReport
}

function generateReportId() {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

module.exports = { runFullScan }
