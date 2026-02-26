// Scan history manager
const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '../data/scan-history.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Save scan to history
function saveScanHistory(report) {
  try {
    ensureDataDir();
    
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      history = JSON.parse(data);
    }
    
    // Store simplified version for history
    const historyEntry = {
      id: report.id,
      target: report.target,
      scanTime: report.scanTime,
      summary: report.summary,
      hasAISummary: !!report.aiSummary,
      userId: report.userId,
      userEmail: report.userEmail
    };
    
    history.unshift(historyEntry);
    
    // Keep only last 100 scans
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save scan history:', error.message);
    return false;
  }
}

// Get scan history
function getScanHistory(limit = 20) {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    const history = JSON.parse(data);
    
    return history.slice(0, limit);
  } catch (error) {
    console.error('Failed to read scan history:', error.message);
    return [];
  }
}

// Get stats for dashboard
function getDashboardStats() {
  try {
    const history = getScanHistory(100);
    
    if (history.length === 0) {
      return {
        totalScans: 0,
        criticalFound: 0,
        highFound: 0,
        avgRiskScore: 0,
        recentScans: []
      };
    }
    
    const totalScans = history.length;
    const criticalFound = history.reduce((sum, scan) => sum + scan.summary.critical, 0);
    const highFound = history.reduce((sum, scan) => sum + scan.summary.high, 0);
    const avgRiskScore = Math.round(
      history.reduce((sum, scan) => sum + scan.summary.riskScore, 0) / totalScans
    );
    
    return {
      totalScans,
      criticalFound,
      highFound,
      avgRiskScore,
      recentScans: history.slice(0, 5)
    };
  } catch (error) {
    console.error('Failed to get dashboard stats:', error.message);
    return {
      totalScans: 0,
      criticalFound: 0,
      highFound: 0,
      avgRiskScore: 0,
      recentScans: []
    };
  }
}

module.exports = {
  saveScanHistory,
  getScanHistory,
  getDashboardStats
};
