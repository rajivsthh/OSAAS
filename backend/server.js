// server.js
require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const { runFullScan } = require('./scanner/index')
const { saveScanHistory, getScanHistory, getDashboardStats } = require('./utils/historyManager')
const { verifyFirebaseToken } = require('./middleware/auth')

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

// Enable CORS for frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://127.0.0.1:8080'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))
app.use(express.json())

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

    // Add user info to report
    report.userId = req.user.uid
    report.userEmail = req.user.email

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
    const userHistory = history.filter(item => item.userId === req.user.uid)
    
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
    const userScans = history.filter(item => item.userId === req.user.uid)
    
    const stats = {
      ...allStats,
      userScans: userScans.length,
      lastScan: userScans[0]?.timestamp || null,
      userEmail: req.user.email
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
