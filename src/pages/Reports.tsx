import SeverityBadge from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

type Report = {
  id: string;
  title: string;
  date: string;
  severity: "critical" | "high" | "medium" | "low";
  findings: number;
};

const reports: Report[] = [
  { id: "RPT-001", title: "SQL Injection in Login Form", date: "Feb 26, 2026", severity: "critical", findings: 3 },
  { id: "RPT-002", title: "XSS in User Profile Endpoint", date: "Feb 25, 2026", severity: "high", findings: 5 },
  { id: "RPT-003", title: "Hardcoded API Key in Config", date: "Feb 25, 2026", severity: "critical", findings: 1 },
  { id: "RPT-004", title: "Insecure Deserialization", date: "Feb 24, 2026", severity: "high", findings: 2 },
  { id: "RPT-005", title: "Open Redirect in OAuth Flow", date: "Feb 24, 2026", severity: "medium", findings: 1 },
  { id: "RPT-006", title: "Missing Rate Limiting on API", date: "Feb 23, 2026", severity: "medium", findings: 4 },
];

export default function ReportsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Security analysis reports and findings.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-3.5 w-3.5" />
          Export All
        </Button>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="surface-card p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-colors animate-fade-in">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.id} · {r.date} · {r.findings} finding{r.findings > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <SeverityBadge severity={r.severity} />
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <Download className="h-3 w-3" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
