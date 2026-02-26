import SeverityBadge from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText, Eye, Calendar, Target, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ScanSummary {
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
  hasAISummary?: boolean;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ScanSummary | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await apiGet("/api/history");
      if (data.success) {
        setReports(data.history);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to load scan history");
    } finally {
      setLoading(false);
    }
  };

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
            {reports.length} security scan{reports.length > 1 ? 's' : ''} completed
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={exportAllReports}>
          <Download className="h-3.5 w-3.5" />
          Export All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-card p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Critical</span>
          </div>
          <div className="text-2xl font-bold">
            {reports.reduce((sum, r) => sum + r.summary.critical, 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Issues found</p>
        </div>

        <div className="surface-card p-4">
          <div className="flex items-center gap-2 text-severity-high mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">High</span>
          </div>
          <div className="text-2xl font-bold">
            {reports.reduce((sum, r) => sum + r.summary.high, 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Issues found</p>
        </div>

        <div className="surface-card p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Target className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Risk</span>
          </div>
          <div className="text-2xl font-bold">
            {Math.round(reports.reduce((sum, r) => sum + r.summary.riskScore, 0) / reports.length)}/100
          </div>
          <p className="text-xs text-muted-foreground mt-1">Across all scans</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="surface-card p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-colors animate-fade-in">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{report.target}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(report.scanTime).toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>{report.summary.total} finding{report.summary.total !== 1 ? 's' : ''}</span>
                  {report.hasAISummary && (
                    <>
                      <span>•</span>
                      <span className="text-primary">AI Summary</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <SeverityBadge severity={report.summary.riskLevel} />
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 text-xs"
                onClick={() => setSelectedReport(report)}
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => downloadReport(report)}
              >
                <Download className="h-3 w-3" />
                JSON
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scan Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Target</p>
                  <p className="font-mono text-xs break-all">{selectedReport.target}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Scan Time</p>
                  <p className="text-xs">{new Date(selectedReport.scanTime).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Risk Score</p>
                  <p className="text-lg font-bold">{selectedReport.summary.riskScore}/100</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Risk Level</p>
                  <SeverityBadge severity={selectedReport.summary.riskLevel} />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold mb-3">Findings Breakdown</p>
                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                  <div className="surface-card p-3">
                    <p className="text-2xl font-bold text-destructive">{selectedReport.summary.critical}</p>
                    <p className="text-muted-foreground mt-1">Critical</p>
                  </div>
                  <div className="surface-card p-3">
                    <p className="text-2xl font-bold text-severity-high">{selectedReport.summary.high}</p>
                    <p className="text-muted-foreground mt-1">High</p>
                  </div>
                  <div className="surface-card p-3">
                    <p className="text-2xl font-bold text-severity-medium">{selectedReport.summary.medium}</p>
                    <p className="text-muted-foreground mt-1">Medium</p>
                  </div>
                  <div className="surface-card p-3">
                    <p className="text-2xl font-bold text-severity-low">{selectedReport.summary.low}</p>
                    <p className="text-muted-foreground mt-1">Low</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => downloadReport(selectedReport)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
