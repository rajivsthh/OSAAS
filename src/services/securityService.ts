import axios from 'axios'
import { SecurityAlert, SystemStatus, VulnerabilityMetrics, NetworkDevice, User } from '@/types'

const API_BASE = 'http://localhost:3000/api'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export const securityService = {
  // Alerts
  getAlerts: (limit: number = 50) =>
    client.get<SecurityAlert[]>('/alerts', { params: { limit } }),
  createAlert: (alert: Omit<SecurityAlert, 'id'>) =>
    client.post<SecurityAlert>('/alerts', alert),
  resolveAlert: (id: string) =>
    client.patch(`/alerts/${id}`, { resolved: true }),

  // System Status
  getSystemStatus: () =>
    client.get<SystemStatus>('/system/status'),
  performSecurityScan: () =>
    client.post<{ scanId: string }>('/system/scan'),

  // Vulnerabilities
  getVulnerabilities: () =>
    client.get<VulnerabilityMetrics>('/vulnerabilities/metrics'),
  getVulnerabilityHistory: (days: number = 30) =>
    client.get<VulnerabilityMetrics[]>('/vulnerabilities/history', { params: { days } }),

  // Network
  getNetworkDevices: () =>
    client.get<NetworkDevice[]>('/network/devices'),
  scanNetwork: () =>
    client.post<{ deviceCount: number }>('/network/scan'),

  // Users
  getUsers: () =>
    client.get<User[]>('/users'),
  getUserActivity: (userId: string) =>
    client.get(`/users/${userId}/activity`),
}

export default securityService
