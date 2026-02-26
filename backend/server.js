// server.js
require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const { runFullScan } = require('./scanner/index')
const { saveScanHistory, getScanHistory, getDashboardStats } = require('./utils/historyManager')
const { getSummary, getRecentAnomalies } = require('./utils/trafficAnomalyStore')
const { verifyFirebaseToken } = require('./middleware/auth')
const { trafficAnomalyMiddleware } = require('./middleware/trafficAnomaly')

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

// Enable CORS for frontend
// allowlist can come from env or default to common dev ports; also accept any localhost port in dev
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://127.0.0.1:8080'];

// helper that returns true for any localhost with a port when in development
function isLocalhost(origin) {
  try {
    const u = new URL(origin);
    return (u.hostname === 'localhost' || u.hostname === '127.0.0.1') && !!u.port;
  } catch { return false; }
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === 'development' ||
      isLocalhost(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(trafficAnomalyMiddleware)

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BountyAI backend is running',
    timestamp: new Date().toISOString()
  })
})

// Main scan endpoint
app.post('/api/scan', verifyFirebaseToken, upload.single('file'), async (req, res) => {
  try {
    const target = req.body.target || ''
    const uploadedCode = req.file ? req.file.buffer.toString('utf-8') : null
    const filename = req.file ? req.file.originalname : ''

    if (!target && !uploadedCode) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either a target URL or upload source code'
      })
    }

    // Run full scan
    const report = await runFullScan(target, uploadedCode, filename)

    // Attach zero-day style anomaly signals from live traffic
    report.zeroDaySignals = {
      enabled: true,
      summary: getSummary(),
      recentAnomalies: getRecentAnomalies(8)
    }

    // Add user info to report
    report.userId = req.user?.uid || 'anonymous'
    report.userEmail = req.user?.email || 'anonymous@example.com'

    // Save to history
    saveScanHistory(report)

    // Return results
    res.json({
      success: true,
      report
    })

  } catch (error) {
    console.error('Scan error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Zero-day anomaly summary
app.get('/api/zero-day/summary', verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    summary: getSummary(),
    recentAnomalies: getRecentAnomalies(10)
  })
})

// Workspace timer endpoint
app.get('/api/workspace/:id/time', (req, res) => {
  // Return time remaining (in seconds)
  res.json({ 
    timeRemaining: 3600,
    workspaceId: req.params.id 
  })
})

// Get scan history
app.get('/api/history', verifyFirebaseToken, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const history = getScanHistory(limit)
    
    // Filter history to only this user's scans
    const userId = req.user?.uid || 'anonymous'
    const userHistory = history.filter(item => !item.userId || item.userId === userId)
    
    res.json({
      success: true,
      history: userHistory
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get dashboard stats
app.get('/api/dashboard/stats', verifyFirebaseToken, (req, res) => {
  try {
    const allStats = getDashboardStats()
    const history = getScanHistory()
    
    // Filter to only this user's scans
    const userId = req.user?.uid || 'anonymous'
    const userScans = history.filter(item => !item.userId || item.userId === userId)
    
    const stats = {
      ...allStats,
      userScans: userScans.length,
      lastScan: userScans[0]?.timestamp || null,
      userEmail: req.user?.email || 'anonymous@example.com'
    }
    
    res.json({
      success: true,
      stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`\n🚀 BountyAI backend running on http://localhost:${PORT}`)
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/scan`)
  console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`)
})
