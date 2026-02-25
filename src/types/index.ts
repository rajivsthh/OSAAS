export interface SecurityAlert {
  id: string
  level: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  timestamp: Date
  resolved: boolean
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical'
  threatLevel: number
  activeSessions: number
  failedLoginAttempts: number
  lastScan: Date
}

export interface VulnerabilityMetrics {
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  trend: number[]
}

export interface NetworkDevice {
  id: string
  name: string
  ip: string
  status: 'online' | 'offline'
  lastSeen: Date
}

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'analyst' | 'viewer'
  lastLogin: Date
  isActive: boolean
}
