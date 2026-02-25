import React from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react'
import { SecurityAlert } from '@/types'
import './AlertCard.css'

interface AlertCardProps {
  alert: any
  onResolve?: (id: string) => void
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onResolve }: AlertCardProps) => {
  const getIcon = () => {
    switch (alert.level) {
      case 'critical':
        return <AlertOctagon className="alert-icon critical" />
      case 'high':
        return <AlertCircle className="alert-icon high" />
      case 'medium':
        return <AlertTriangle className="alert-icon medium" />
      default:
        return <AlertCircle className="alert-icon low" />
    }
  }

  return (
    <div className={`alert-card ${alert.level} ${alert.resolved ? 'resolved' : ''}`}>
      <div className="alert-header">
        {getIcon()}
        <div className="alert-title-section">
          <h3>{alert.title}</h3>
          <span className={`severity ${alert.level}`}>{alert.level.toUpperCase()}</span>
        </div>
      </div>
      <p className="alert-description">{alert.description}</p>
      <div className="alert-footer">
        <span className="timestamp">
          {alert.timestamp.toLocaleString()}
        </span>
        {!alert.resolved && onResolve && (
          <button
            className="resolve-btn"
            onClick={() => onResolve(alert.id)}
          >
            <CheckCircle size={16} />
            Resolve
          </button>
        )}
        {alert.resolved && <span className="resolved-badge">Resolved</span>}
      </div>
    </div>
  )
}
