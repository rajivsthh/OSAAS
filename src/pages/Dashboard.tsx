import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { AlertTriangle, Activity, Clock } from "lucide-react";

const mockStats = {
  totalScans: 24,
  criticalIssues: 3,
  avgScanTime: "2.3s",
  filesScanned: 156,
};

const vulnerabilityData = [
  { name: "Critical", value: 3, fill: "#ef4444" },
  { name: "High", value: 7, fill: "#f97316" },
  { name: "Medium", value: 12, fill: "#eab308" },
  { name: "Low", value: 18, fill: "#22c55e" },
];

const recentScans = [
  { id: 1, name: "react-auth-lib", date: "Today", vulnerabilities: 2, status: "Complete" },
  { id: 2, name: "backend-api", date: "Yesterday", vulnerabilities: 5, status: "Complete" },
  { id: 3, name: "mobile-app", date: "2 days ago", vulnerabilities: 1, status: "Complete" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="surface-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
            <p className="text-3xl font-display mt-2">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-2">Here's your security overview</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-500">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      {mockStats.criticalIssues > 0 && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription>
            You have <span className="font-bold text-destructive">{mockStats.criticalIssues} critical vulnerabilities</span> that need immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Scans"
          value={mockStats.totalScans}
          sub="Completed scans"
          accent="primary"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Critical Issues"
          value={mockStats.criticalIssues}
          sub="Require immediate fix"
          accent="destructive"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          label="Avg Scan Time"
          value={mockStats.avgScanTime}
          sub="Per project"
          accent="primary"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Files Scanned"
          value={mockStats.filesScanned}
          sub="Total files analyzed"
          accent="low"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vulnerability Distribution */}
        <Card className="surface-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Vulnerability Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={vulnerabilityData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {vulnerabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity Breakdown */}
        <Card className="surface-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Issues by Severity</h3>
          <div className="space-y-3">
            {vulnerabilityData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm text-muted-foreground flex-1">{item.name}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="surface-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Scans</h3>
        <div className="space-y-3">
          {recentScans.map((scan) => (
            <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition">
              <div>
                <p className="font-medium text-foreground">{scan.name}</p>
                <p className="text-xs text-muted-foreground">{scan.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{scan.vulnerabilities} vulnerabilities</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">{scan.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
