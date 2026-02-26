import StatCard from "@/components/StatCard";
import SeverityBadge from "@/components/SeverityBadge";
import { useEffect, useState } from "react";
import { Activity, TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_URL = "http://localhost:3001/api";

interface DashboardStats {
  totalScans: number;
  criticalFound: number;
  highFound: number;
  avgRiskScore: number;
  recentScans: Array<{
    id: string;
    target: string;
    scanTime: string;
    summary: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
      riskScore: number;
      riskLevel: string;
    };
  }>;
}

const SEVERITY_COLORS = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#f59e0b",
  Low: "#10b981"
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalScans === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your security posture.</p>
        </div>

        <div className="surface-card p-12 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Scans Yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Run your first security scan to see analytics and insights here.
          </p>
          <a href="/scanner" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Start Your First Scan
          </a>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const severityData = stats.recentScans.length > 0 ? [
    { name: "Critical", value: stats.recentScans.reduce((sum, s) => sum + s.summary.critical, 0) },
    { name: "High", value: stats.recentScans.reduce((sum, s) => sum + s.summary.high, 0) },
    { name: "Medium", value: stats.recentScans.reduce((sum, s) => sum + s.summary.medium, 0) },
    { name: "Low", value: stats.recentScans.reduce((sum, s) => sum + s.summary.low, 0) }
  ].filter(d => d.value > 0) : [];

  const trendData = stats.recentScans.slice(0, 10).reverse().map(scan => ({
    name: new Date(scan.scanTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: scan.summary.riskScore,
    critical: scan.summary.critical,
    high: scan.summary.high
  }));

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your security posture.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Scans" 
          value={stats.totalScans.toString()} 
          sub="All time" 
          accent="primary"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard 
          label="Avg Risk Score" 
          value={`${stats.avgRiskScore}/100`} 
          sub="Across all scans" 
          accent={stats.avgRiskScore >= 75 ? "destructive" : stats.avgRiskScore >= 50 ? "high" : "medium"}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard 
          label="Critical Issues" 
          value={stats.criticalFound.toString()} 
          sub="Requires immediate action" 
          accent="destructive"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard 
          label="High Severity" 
          value={stats.highFound.toString()} 
          sub="Fix within 7 days" 
          accent="high"
          icon={<Shield className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        {severityData.length > 0 && (
          <div className="surface-card p-6">
            <h2 className="text-sm font-semibold mb-4">Findings by Severity</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Risk Score Trend */}
        {trendData.length > 1 && (
          <div className="surface-card p-6">
            <h2 className="text-sm font-semibold mb-4">Risk Score Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Scans Table */}
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Scans</h2>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Target</th>
              <th className="text-left px-5 py-3 font-medium">Scan Date</th>
              <th className="text-left px-5 py-3 font-medium">Risk Score</th>
              <th className="text-left px-5 py-3 font-medium">Findings</th>
              <th className="text-left px-5 py-3 font-medium">Severity</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {stats.recentScans.map((scan) => (
              <tr key={scan.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-mono text-xs max-w-xs truncate">{scan.target}</td>
                <td className="px-5 py-3">{new Date(scan.scanTime).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className="font-semibold">{scan.summary.riskScore}/100</span>
                </td>
                <td className="px-5 py-3">{scan.summary.total}</td>
                <td className="px-5 py-3">
                  <SeverityBadge severity={scan.summary.riskLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
