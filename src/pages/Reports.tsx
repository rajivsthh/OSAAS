import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, AlertCircle, Zap, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";

interface ScanSummary {
  id: string;
  target: string;
  scanTime: string;
  demoMode?: boolean;
  demoNotice?: string;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    riskScore: number;
    riskLevel: string;
  };
  hasAISummary?: boolean;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet("/api/history");
      const history = Array.isArray(data) ? data : data.history || [];
      setReports(history);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Failed to load scan history. Please try again.");
      toast.error("Failed to load scan history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const downloadReport = (report: ScanSummary) => {
    // Create a simplified JSON report
    const reportData = {
      id: report.id,
      target: report.target,
      scanTime: report.scanTime,
      summary: report.summary
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-report-${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded");
  };

  const exportAllReports = () => {
    const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-scan-reports-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("All reports exported");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Security analysis reports and findings.</p>
        </div>
        <div className="surface-card p-10 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Unable to load reports</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchReports} className="gap-2" size="sm">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Security analysis reports and findings.</p>
        </div>

        <div className="surface-card p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Reports Yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Run some scans to generate security reports.
          </p>
          <a href="/scanner" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Start Scanning
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {reports.length} security scan{reports.length > 1 ? "s" : ""} completed
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportAllReports}>
          <Download className="h-3.5 w-3.5" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="surface-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium truncate">{report.target}</p>
                  {report.demoMode && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <Zap className="h-3 w-3" />
                      SANDBOX
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(report.scanTime).toLocaleString()}</span>
                </div>
              </div>
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Total findings:</span>{" "}
              <span className="font-semibold">{report.summary.total}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border p-2">
                <p className="text-sm font-semibold text-destructive">{report.summary.critical}</p>
                <p className="text-muted-foreground mt-1">Critical</p>
              </div>
              <div className="rounded-lg border border-border p-2">
                <p className="text-sm font-semibold text-severity-high">{report.summary.high}</p>
                <p className="text-muted-foreground mt-1">High</p>
              </div>
              <div className="rounded-lg border border-border p-2">
                <p className="text-sm font-semibold text-severity-medium">{report.summary.medium}</p>
                <p className="text-muted-foreground mt-1">Medium</p>
              </div>
              <div className="rounded-lg border border-border p-2">
                <p className="text-sm font-semibold text-severity-low">{report.summary.low}</p>
                <p className="text-muted-foreground mt-1">Low</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => downloadReport(report)}
              >
                <Download className="h-3 w-3" />
                Download JSON
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
