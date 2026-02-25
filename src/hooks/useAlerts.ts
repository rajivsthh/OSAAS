import { useState, useEffect } from 'react'

export const useSecurityAlerts = () => {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        // Mock data - replace with actual API call
        const mockAlerts = [
          {
            id: '1',
            level: 'critical',
            title: 'Suspicious Login Attempt',
            description: 'Multiple failed login attempts from unknown IP',
            timestamp: new Date(),
            resolved: false,
          },
        ]
        setAlerts(mockAlerts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  return { alerts, loading, error, setAlerts }
}

export const useSystemStatus = () => {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Mock data - replace with actual API call
        const mockStatus = {
          status: 'healthy',
          threatLevel: 24,
          activeSessions: 12,
          failedLoginAttempts: 3,
          lastScan: new Date(),
        }
        setStatus(mockStatus)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  return { status, loading }
}
