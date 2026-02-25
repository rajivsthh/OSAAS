import React from 'react'
import { Shield, Activity, Users, Network } from 'lucide-react'
import './StatCard.css'

interface StatCardProps {
  title: string
  value: string | number
  icon: 'shield' | 'activity' | 'users' | 'network'
  trend?: number
  status?: 'healthy' | 'warning' | 'critical'
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, status = 'healthy' }) => {
  const getIcon = () => {
    switch (icon) {
      case 'shield':
        return <Shield size={32} />
      case 'activity':
        return <Activity size={32} />
      case 'users':
        return <Users size={32} />
      case 'network':
        return <Network size={32} />
    }
  }

  return (
    <div className={`stat-card ${status}`}>
      <div className="stat-icon">{getIcon()}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {trend !== undefined && (
          <span className={`stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  )
}
