// server.js
require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const { runFullScan } = require('./scanner/index')
const { saveScanHistory, getScanHistory, getDashboardStats } = require('./utils/historyManager')

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://127.0.0.1:8080'],
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
app.post('/api/scan', upload.single('file'), async (req, res) => {
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
app.get('/api/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const history = getScanHistory(limit)
    res.json({
      success: true,
      history
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = getDashboardStats()
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
