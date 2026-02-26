import { Upload, FileCode, CheckCircle, AlertTriangle, Globe, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import SeverityBadge from "@/components/SeverityBadge";

const API_URL = "http://localhost:3001/api";

interface ScanReport {
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
  findings: Array<{
    type: string;
    severity: string;
    issue: string;
    fix: string;
    line?: number;
    file?: string;
    evidence?: string;
    owasp?: string;
    exploit?: string;
  }>;
  stages: Array<{
    stage: number;
    name: string;
    status: string;
    found?: number;
  }>;
  attackPath?: Array<{
    step: string;
    exploit?: string;
    timeToExploit?: string;
  }>;
  aiSummary?: {
    summary: string;
    generatedBy: string;
    timestamp: string;
  };
}

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStage, setCurrentStage] = useState("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        setBackendOnline(response.ok);
        if (response.ok) {
          toast.success("Backend connected");
        }
      } catch (error) {
        setBackendOnline(false);
        toast.error("Backend offline. Run: npm run backend");
      }
    };
    checkBackend();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const startScan = async () => {
    if (!targetUrl && !selectedFile) {
      toast.error("Please provide a target URL or upload a file");
      return;
    }

    if (backendOnline === false) {
      toast.error("Backend is offline. Please start it with: npm run backend");
      return;
    }

    setScanning(true);
    setReport(null);
    setCurrentStage("Initializing scan...");

    try {
      const formData = new FormData();
      if (targetUrl) {
        formData.append("target", targetUrl);
      }
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      setCurrentStage("Scanning for vulnerabilities...");

      const response = await fetch(`${API_URL}/scan`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Scan failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
        toast.success(`Scan complete! Found ${data.report.summary.total} issues`);
      } else {
        throw new Error(data.error || "Scan failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Scan failed";
      
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        toast.error("Cannot connect to backend. Make sure it's running on port 3001");
        setBackendOnline(false);
      } else {
        toast.error(errorMessage);
      }
      
      console.error("Scan error:", error);
    } finally {
      setScanning(false);
      setCurrentStage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Security Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scan URLs for vulnerabilities or upload source code for analysis
        </p>
      </div>

      {/* Backend Status Indicator */}
      {backendOnline === false && (
        <div className="surface-card p-4 border-l-4 border-destructive bg-destructive/5 animate-fade-in">
          <div className="flex items-start gap-3">
            <WifiOff className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">Backend Offline</p>
              <p className="text-xs text-muted-foreground mt-1">
                The backend server is not running. Start it with:
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                npm run backend
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Or start both: <code className="bg-muted px-1 rounded">npm run start</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {backendOnline === true && (
        <div className="surface-card p-3 border-l-4 border-green-500 bg-green-500/5 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs text-muted-foreground">
              Backend connected • Ready to scan
            </p>
          </div>
        </div>
      )}

      {/* Target URL Input */}
      <div className="surface-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Target URL (optional)
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            disabled={scanning}
          />
          <p className="text-xs text-muted-foreground">
            Scans headers, directories, SSL, and rate limiting
          </p>
        </div>
      </div>

      {/* Upload zone */}
      <div className="surface-card border-dashed p-10 flex flex-col items-center gap-5">
        <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            {selectedFile ? selectedFile.name : "Upload source code (optional)"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
            <FileCode className="h-3 w-3" /> .py, .js, .ts, .jsx, .tsx, .php, .java
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".py,.js,.ts,.jsx,.tsx,.php,.java,.rb,.go,.c,.cpp,.cs"
          onChange={handleFileSelect}
          className="hidden"
          disabled={scanning}
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanning}
          >
            Select File
          </Button>
          <Button onClick={startScan} disabled={scanning || (!targetUrl && !selectedFile)} className="glow-blue">
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning…
              </>
            ) : (
              "Start Scan"
            )}
          </Button>
        </div>
      </div>

      {/* Scanning progress */}
      {scanning && (
        <div className="surface-card p-6 space-y-3 animate-fade-in">
          <p className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-severity-medium animate-pulse" />
            {currentStage}
          </p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      )}

      {/* Results */}
      {report && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary */}
          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-2 text-severity-low">
                <CheckCircle className="h-4 w-4" />
                Scan complete — {report.summary.total} vulnerabilities found
              </p>
              <SeverityBadge severity={report.summary.riskLevel} />
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center text-xs">
              <div className="surface-card p-3">
                <span className="text-xl font-bold text-destructive">{report.summary.critical}</span>
                <p className="text-muted-foreground mt-1">Critical</p>
              </div>
              <div className="surface-card p-3">
                <span className="text-xl font-bold text-severity-high">{report.summary.high}</span>
                <p className="text-muted-foreground mt-1">High</p>
              </div>
              <div className="surface-card p-3">
                <span className="text-xl font-bold text-severity-medium">{report.summary.medium}</span>
                <p className="text-muted-foreground mt-1">Medium</p>
              </div>
              <div className="surface-card p-3">
                <span className="text-xl font-bold text-severity-low">{report.summary.low}</span>
                <p className="text-muted-foreground mt-1">Low</p>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Risk Score: <span className="font-bold">{report.summary.riskScore}/100</span></p>
                <p>Scan Time: {new Date(report.scanTime).toLocaleString()}</p>
                {report.target && <p>Target: {report.target}</p>}
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {report.aiSummary && (
            <div className="surface-card p-6 space-y-3 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  AI Security Analysis
                </h3>
                <span className="text-xs text-muted-foreground">
                  {report.aiSummary.generatedBy}
                </span>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground font-sans bg-muted/30 p-4 rounded-lg">
                  {report.aiSummary.summary}
                </pre>
              </div>
            </div>
          )}

          {/* Attack Path */}
          {report.attackPath && report.attackPath.length > 0 && (
            <div className="surface-card p-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Most Likely Attack Path
              </h3>
              <div className="space-y-3">
                {report.attackPath.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-bold text-destructive">
                        {idx + 1}
                      </div>
                      {idx < report.attackPath!.length - 1 && (
                        <div className="w-0.5 flex-1 bg-destructive/20 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">{step.step}</p>
                      {step.exploit && (
                        <p className="text-xs text-muted-foreground mt-1">{step.exploit}</p>
                      )}
                      {step.timeToExploit && (
                        <p className="text-xs text-severity-high mt-1 font-semibold">
                          Time to exploit: {step.timeToExploit}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Findings */}
          {report.findings.length > 0 && (
            <div className="surface-card p-6 space-y-4">
              <h3 className="text-sm font-semibold">Vulnerabilities Found</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {report.findings.map((finding, idx) => (
                  <div key={idx} className="surface-card p-4 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SeverityBadge severity={finding.severity} />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {finding.type}
                          </span>
                        </div>
                        <p className="font-medium text-sm">{finding.issue}</p>
                        {finding.file && finding.line && (
                          <p className="text-muted-foreground mt-1">
                            {finding.file}:{finding.line}
                          </p>
                        )}
                        {finding.evidence && (
                          <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto">
                            {finding.evidence}
                          </pre>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50 space-y-1">
                      <p className="text-muted-foreground">
                        <span className="font-semibold">Fix:</span> {finding.fix}
                      </p>
                      {finding.owasp && (
                        <p className="text-muted-foreground">
                          <span className="font-semibold">OWASP:</span> {finding.owasp}
                        </p>
                      )}
                      {finding.exploit && (
                        <p className="text-muted-foreground">
                          <span className="font-semibold">Exploit:</span> {finding.exploit}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan stages */}
          {report.stages.length > 0 && (
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold mb-3">Scan Stages</h3>
              <div className="space-y-2 text-xs">
                {report.stages.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {stage.stage}. {stage.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{stage.found || 0} found</span>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
