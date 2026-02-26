// scanner/index.js
const { scanSecrets } = require('../scanners/secretScanner')
const { scanPatterns } = require('../scanners/patternScanner')
const { scanHeaders } = require('../scanners/headerScanner')
const { scanDirectories } = require('../scanners/directoryScanner')
const { checkCVE, detectTechnologies } = require('../scanners/cveScanner')
const { checkRateLimit } = require('../scanners/rateLimitScanner')
const { generateAIReport } = require('../ai/reportGenerator')
const { 
  enhanceFinding, 
  sortByPriority, 
  groupByCategory,
  calculateCVSS 
} = require('../utils/vulnerabilityRanker')

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
  // Enhance all findings with Nikto-style ranking
  const enhancedFindings = findings.map(f => enhanceFinding(f));
  
  // Sort by priority
  const sortedFindings = sortByPriority(enhancedFindings);
  
  // Group by category for better organization
  const categoryGroups = groupByCategory(sortedFindings);
  
  // Calculate severity counts
  const critical = sortedFindings.filter(f => f.severity === "Critical")
  const high = sortedFindings.filter(f => f.severity === "High")
  const medium = sortedFindings.filter(f => f.severity === "Medium")
  const low = sortedFindings.filter(f => f.severity === "Low")

  // Calculate risk score (weighted by both severity and CVSS)
  let score = 0
  critical.forEach(() => score += 25)
  high.forEach(() => score += 15)
  medium.forEach(() => score += 8)
  low.forEach(() => score += 3)
  const riskScore = Math.min(score, 100)
  
  // Calculate average CVSS score
  const avgCVSS = sortedFindings.length > 0
    ? (sortedFindings.reduce((sum, f) => sum + parseFloat(f.cvss || 0), 0) / sortedFindings.length).toFixed(1)
    : 0.0;

  const baseReport = {
    id: generateReportId(),
    target: target || filename,
    scanTime: new Date().toISOString(),
    scanner: {
      name: 'Apricity Security Scanner',
      version: '1.0.0',
      engine: 'Nikto-style v3'
    },
    stages,
    summary: {
      total: sortedFindings.length,
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      riskScore,
      riskLevel: riskScore >= 75 ? "CRITICAL" :
                 riskScore >= 50 ? "HIGH" :
                 riskScore >= 25 ? "MEDIUM" : "LOW",
      avgCVSS, // Average CVSS score across all findings
      priorityBreakdown: {
        p1: sortedFindings.filter(f => f.priority === 1).length,
        p2: sortedFindings.filter(f => f.priority === 2).length,
        p3: sortedFindings.filter(f => f.priority === 3).length,
        p4: sortedFindings.filter(f => f.priority === 4).length,
        p5: sortedFindings.filter(f => f.priority === 5).length
      }
    },
    findings: sortedFindings,
    categories: categoryGroups, // Grouped by category
    // Attacker's easiest path (Priority 1 & 2 only)
    attackPath: sortedFindings
      .filter(f => f.priority <= 2)
      .slice(0, 3)
      .map(f => ({
        step: f.issue,
        exploit: f.exploit,
        timeToExploit: f.timeToExploit,
        cvss: f.cvss,
        priority: f.priority
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
