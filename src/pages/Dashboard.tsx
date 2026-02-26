import StatCard from "@/components/StatCard";

const stats = [
  { label: "Files Scanned", value: "5,412", sub: "Last scan: 2 min ago", accent: "primary" as const, progress: 78 },
  { label: "Total Findings", value: "822", sub: "Critical / High Risk", accent: "destructive" as const, progress: 34 },
  { label: "Test Cases", value: "3,218", sub: "Run in last 24h", accent: "primary" as const, progress: 92 },
  { label: "API Endpoints", value: "146", sub: "Across 12 services", accent: "primary" as const, progress: 55 },
  { label: "High Risk", value: "89", sub: "Require immediate action", accent: "destructive" as const, progress: 22 },
  { label: "Resolved", value: "1,045", sub: "Remediated this month", accent: "low" as const, progress: 85 },
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your security posture.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Activity table */}
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Scans</h2>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Scan Date</th>
              <th className="text-left px-5 py-3 font-medium">Source</th>
              <th className="text-left px-5 py-3 font-medium">Findings</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {[
              { date: "Feb 26, 2026", source: "api-gateway/", findings: 12, status: "Complete" },
              { date: "Feb 25, 2026", source: "auth-service/", findings: 7, status: "Complete" },
              { date: "Feb 24, 2026", source: "payment-module/", findings: 23, status: "In Review" },
            ].map((row) => (
              <tr key={row.date} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3">{row.date}</td>
                <td className="px-5 py-3 font-mono text-muted-foreground">{row.source}</td>
                <td className="px-5 py-3">{row.findings}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${row.status === "Complete" ? "bg-severity-low/15 text-severity-low" : "bg-severity-medium/15 text-severity-medium"}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
