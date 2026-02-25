import React, { useState } from 'react'
import { Navigation, Container, Card } from '@/components'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
  const [items, setItems] = useState<any[]>([])

  return (
    <>
      <Navigation />
      <div className="dashboard">
        <Container className="dashboard-container">
          <h1 className="page-title">Dashboard</h1>

          <div className="stats-grid">
            <div className="stat-simple">
              <h3>Total Items</h3>
              <p className="stat-value">{items.length}</p>
            </div>
            <div className="stat-simple">
              <h3>Active</h3>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-simple">
              <h3>Pending</h3>
              <p className="stat-value">0</p>
            </div>
            <div className="stat-simple">
              <h3>Completed</h3>
              <p className="stat-value">0</p>
            </div>
          </div>

          <div className="dashboard-content">
            <Card className="main-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
              </div>
              <p className="empty-state">No activity yet</p>
            </Card>

            <Card className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn">
                  <span>➕</span>
                  Add New
                </button>
                <button className="action-btn">
                  <span>📋</span>
                  View List
                </button>
                <button className="action-btn">
                  <span>⚙️</span>
                  Settings
                </button>
                <button className="action-btn">
                  <span>📊</span>
                  Reports
                </button>
              </div>
            </Card>
          </div>

          <Card className="info-card">
            <h2 className="section-title">Information</h2>
            <div className="info-details">
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">Active</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Version</span>
                <span className="info-value">0.1.0</span>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    </>
  )
}
