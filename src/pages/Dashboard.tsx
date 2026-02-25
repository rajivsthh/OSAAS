import React from 'react'
import { useSecurityAlerts, useSystemStatus } from '@/hooks/useAlerts'
import { AlertCard, StatCard, Navigation, Container, Card } from '@/components'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
  const { alerts, loading: alertsLoading } = useSecurityAlerts()
  const { status } = useSystemStatus()

  const criticalAlerts = alerts.filter((a: any) => a.level === 'critical' && !a.resolved).length
  const highAlerts = alerts.filter((a: any) => a.level === 'high' && !a.resolved).length

  return (
    <>
      <Navigation />
      <div className="dashboard">
        <Container className="dashboard-container">
          <h1 className="page-title">Security Dashboard</h1>

          <div className="stats-grid">
            <StatCard
              title="Threat Level"
              value={`${status?.threatLevel || 0}%`}
              icon="shield"
              status={status?.status || 'healthy'}
            />
            <StatCard
              title="Critical Alerts"
              value={criticalAlerts}
              icon="activity"
              status={criticalAlerts > 0 ? 'critical' : 'healthy'}
            />
            <StatCard
              title="Active Sessions"
              value={status?.activeSessions || 0}
              icon="users"
            />
            <StatCard
              title="Failed Logins"
              value={status?.failedLoginAttempts || 0}
              icon="network"
              status={status?.failedLoginAttempts > 5 ? 'warning' : 'healthy'}
            />
          </div>

          <div className="dashboard-content">
            <Card className="alerts-section">
              <div className="section-header">
                <h2 className="section-title">Recent Alerts</h2>
                <span className="alert-count">{alerts.length} Total</span>
              </div>
              {alertsLoading ? (
                <p className="loading">Loading alerts...</p>
              ) : alerts.length === 0 ? (
                <p className="empty-state">No alerts</p>
              ) : (
                <div className="alerts-list">
                  {alerts.slice(0, 5).map((alert: any) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </Card>

            <Card className="quick-actions">
              <h2 className="section-title">Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn">
                  <span>🔒</span>
                  Security Scan
                </button>
                <button className="action-btn">
                  <span>🔍</span>
                  Network Audit
                </button>
                <button className="action-btn">
                  <span>👥</span>
                  User Activity
                </button>
                <button className="action-btn">
                  <span>📊</span>
                  Generate Report
                </button>
              </div>
            </Card>
          </div>

          <Card className="status-card">
            <h2 className="section-title">System Status</h2>
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Overall Status</span>
                <span className={`status-badge ${status?.status || 'healthy'}`}>
                  {status?.status?.toUpperCase() || 'HEALTHY'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Last Scan</span>
                <span>{status?.lastScan?.toLocaleString() || 'Never'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">High Alerts</span>
                <span>{highAlerts}</span>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    </>
  )
}
