// AI Report Generator using Claude
const axios = require('axios');

async function generateAIReport(scanReport) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  // If no API key, return a basic summary
  if (!apiKey) {
    return generateBasicSummary(scanReport);
  }

  try {
    const prompt = buildPrompt(scanReport);
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: prompt
        }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      summary: response.data.content[0].text,
      generatedBy: 'Claude 3.5 Sonnet',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI report generation failed:', error.message);
    return generateBasicSummary(scanReport);
  }
}

function buildPrompt(report) {
  const criticalIssues = report.findings.filter(f => f.severity === 'Critical');
  const highIssues = report.findings.filter(f => f.severity === 'High');
  
  return `You are a cybersecurity expert analyzing a vulnerability scan report. Generate a clear, professional executive summary.

SCAN RESULTS:
- Target: ${report.target || 'Source code analysis'}
- Total Issues: ${report.summary.total}
- Risk Score: ${report.summary.riskScore}/100 (${report.summary.riskLevel})
- Critical: ${report.summary.critical}
- High: ${report.summary.high}
- Medium: ${report.summary.medium}
- Low: ${report.summary.low}

TOP CRITICAL FINDINGS:
${criticalIssues.slice(0, 3).map(f => `- ${f.issue} (${f.owasp})`).join('\n')}

TOP HIGH FINDINGS:
${highIssues.slice(0, 3).map(f => `- ${f.issue} (${f.owasp})`).join('\n')}

Please provide:
1. **Executive Summary** (2-3 sentences on overall security posture)
2. **Critical Priorities** (top 3 issues to fix immediately with brief rationale)
3. **Attack Scenario** (realistic 2-3 step attack path an adversary would take)
4. **Recommended Actions** (prioritized list of fixes)
5. **Timeline** (estimated fixing effort: Critical=hours, High=days, Medium=week)

Keep it concise, actionable, and assume the reader is technical. Use plain English, no jargon.`;
}

function generateBasicSummary(report) {
  const riskLevel = report.summary.riskLevel;
  const total = report.summary.total;
  const critical = report.summary.critical;
  const high = report.summary.high;
  
  let summary = '';
  
  if (riskLevel === 'CRITICAL') {
    summary = `⚠️ CRITICAL SECURITY RISK\n\nThis application has ${critical} critical vulnerabilities that require immediate attention. `;
  } else if (riskLevel === 'HIGH') {
    summary = `🔴 HIGH SECURITY RISK\n\nThis application has significant security weaknesses with ${critical} critical and ${high} high-severity issues. `;
  } else if (riskLevel === 'MEDIUM') {
    summary = `🟡 MEDIUM SECURITY RISK\n\nThis application has moderate security concerns that should be addressed. `;
  } else {
    summary = `🟢 LOW SECURITY RISK\n\nThis application has relatively few security issues detected. `;
  }
  
  if (critical > 0) {
    summary += `Focus immediately on exposed secrets, injection vulnerabilities, and authentication issues.\n\n`;
  } else if (high > 0) {
    summary += `Priority should be given to fixing high-severity vulnerabilities like XSS and weak cryptography.\n\n`;
  }
  
  summary += `**Total Issues Found:** ${total}\n`;
  summary += `**Risk Score:** ${report.summary.riskScore}/100\n\n`;
  summary += `**Recommended Actions:**\n`;
  summary += `1. Address all critical vulnerabilities within 24 hours\n`;
  summary += `2. Fix high-severity issues within 1 week\n`;
  summary += `3. Implement security headers and rate limiting\n`;
  summary += `4. Regular security audits and dependency updates\n`;
  
  return {
    summary,
    generatedBy: 'Basic Summary Generator',
    timestamp: new Date().toISOString()
  };
}

module.exports = { generateAIReport };
