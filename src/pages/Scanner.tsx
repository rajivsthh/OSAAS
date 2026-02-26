import { Upload, FileCode, CheckCircle, AlertTriangle, Globe, Loader2, WifiOff, Zap, Github, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import SeverityBadge from "@/components/SeverityBadge";
import GitHubConnect from "@/components/GitHubConnect";
import { apiPostFile } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ScanReport {
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
  const [codeRemovedFromServer, setCodeRemovedFromServer] = useState(false);
  const [gitHubModalOpen, setGitHubModalOpen] = useState(false);
  const [connectedRepo, setConnectedRepo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`, { 
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

  // Listen for code removal from server notification
  useEffect(() => {
    const handleCodeRemoved = (event: CustomEvent) => {
      if (event.detail.action === "codeRemoved") {
        setSelectedFile(null);
        setTargetUrl("");
        setCodeRemovedFromServer(true);
        toast.info("✔️ Your uploaded code has been securely removed from the cloud");
      }
    };

    window.addEventListener("codeRemovedFromServer", handleCodeRemoved as EventListener);
    return () => window.removeEventListener("codeRemovedFromServer", handleCodeRemoved as EventListener);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConnectedRepo(null); // Clear GitHub repo if file is selected
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleGitHubConnect = (repoUrl: string) => {
    setConnectedRepo(repoUrl);
    setSelectedFile(null); // Clear file upload if GitHub repo is connected
    setTargetUrl(""); // Clear URL field
    toast.success(`GitHub repository connected: ${repoUrl}`);
  };

  const disconnectGitHub = () => {
    setConnectedRepo(null);
    toast.info("GitHub repository disconnected");
  };

  const startScan = async () => {
    if (!targetUrl && !selectedFile && !connectedRepo) {
      toast.error("Please provide a target URL, upload a file, or connect a GitHub repository");
      return;
    }

    if (backendOnline === false) {
      toast.error("Backend is offline. Please start it with: npm run backend");
      return;
    }

    setScanning(true);
    setReport(null);
    setCodeRemovedFromServer(false);
    setCurrentStage("Initializing scan...");

    try {
      const formData = new FormData();
      if (targetUrl) {
        formData.append("target", targetUrl);
      }
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      if (connectedRepo) {
        formData.append("githubRepo", connectedRepo);
      }

      setCurrentStage("Scanning for vulnerabilities...");

      const data = await apiPostFile("/api/scan", formData);
      
      if (data.success) {
        setReport(data.report);
        
        // Dispatch event to activate self-destruct timer in navbar
        const event = new CustomEvent("scanReportGenerated");
        window.dispatchEvent(event);
        
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-transparent to-amber-50/40 dark:from-amber-950/10 dark:via-transparent dark:to-amber-950/10">
      <div className="max-w-4xl mx-auto py-16 px-6 space-y-10">
        {/* Sandbox Environment Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 w-fit">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-widest">Sandbox Environment</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Security Scanner</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Safe vulnerability testing in an isolated sandbox environment
            </p>
          </div>
        </div>

        {/* Sandbox Info Card */}
        <div className="p-5 rounded-lg border-2 border-dashed border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 animate-pulse" />
            </div>
            <div className="text-xs space-y-1 flex-1">
              <p className="font-semibold text-amber-900 dark:text-amber-100">Running in Sandbox Mode</p>
              <p className="text-amber-800 dark:text-amber-200">
                All scans are performed in an isolated environment. No actual files are analyzed or external systems are contacted.
              </p>
            </div>
          </div>
        </div>

      {/* Backend Status Indicator */}
      {backendOnline === false && (
        <div className="p-4 rounded-lg border-2 border-destructive/50 bg-destructive/10 animate-fade-in">
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
        <div className="p-3 rounded-lg border-2 border-green-500 bg-green-500/10 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs text-muted-foreground">
              Backend connected • Sandbox environment ready
            </p>
          </div>
        </div>
      )}

      {/* Target URL Input */}
      <div className="p-6 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Sandbox Target URL</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-medium">Simulated</span>
          </label>
          <Input
            type="url"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            disabled={scanning}
            className="bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800"
          />
          <p className="text-xs text-muted-foreground">
            Simulates security checks: headers, directories, SSL, and rate limiting
          </p>
        </div>
      </div>

      {/* GitHub Connected Indicator */}
      {connectedRepo && (
        <div className="p-4 rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Github className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">Connected to GitHub</p>
                <p className="text-xs text-green-600 dark:text-green-400 truncate">{connectedRepo}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={disconnectGitHub}
              disabled={scanning}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload zone - Hidden if GitHub connected */}
      {!connectedRepo && (
        <div className="p-10 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50/50 via-transparent to-amber-100/30 dark:from-amber-950/20 dark:via-transparent dark:to-amber-900/20 flex flex-col items-center gap-5 hover:border-amber-400 dark:hover:border-amber-600 transition-colors">
          <div className="h-14 w-14 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center border-2 border-amber-200 dark:border-amber-800">
            <Upload className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "Upload source code to sandbox"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
              <FileCode className="h-3 w-3" /> Safe • Isolated • No external processing
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".py,.js,.ts,.jsx,.tsx,.php,.java,.rb,.go,.c,.cpp,.cs,.zip"
            onChange={handleFileSelect}
            className="hidden"
            disabled={scanning || !!connectedRepo}
          />
          <div className="flex gap-3 flex-wrap justify-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning || !!connectedRepo}
            >
              Select File
            </Button>
            <span className="text-xs text-muted-foreground pt-2">or</span>
            <Button
              variant="outline"
              onClick={() => setGitHubModalOpen(true)}
              disabled={scanning}
              className="gap-2"
            >
              <Github className="h-4 w-4" />
              Connect GitHub
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Choose one method: upload a local file or connect a GitHub repository (exclusive)
          </p>
        </div>
      )}

      {/* Start Scan Button */}
      {(selectedFile || connectedRepo || targetUrl) && (
        <div className="flex justify-center">
          <Button 
            onClick={startScan} 
            disabled={scanning || (!targetUrl && !selectedFile && !connectedRepo)} 
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2 px-8"
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning…
              </>
            ) : connectedRepo ? (
              "Start GitHub Scan"
            ) : (
              "Start Sandbox Scan"
            )}
          </Button>
        </div>
      )}

      {/* Scanning progress */}
      {scanning && (
        <div className="space-y-4 animate-fade-in">
          {/* Sandbox Scanning Container */}
          <div className="p-6 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 backdrop-blur-sm shadow-lg shadow-amber-500/10">
            <div className="space-y-4">
              {/* Scanning Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 rounded-full animate-pulse blur-md opacity-50" />
                    <div className="relative h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Scanning in Sandbox…</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200 font-medium">SAFE</span>
              </div>

              {/* Stage Info */}
              <div className="bg-amber-50/50 dark:bg-amber-950/40 p-3 rounded border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-mono">
                  <span className="text-amber-500">→</span> {currentStage || "Initializing scan..."}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-amber-200 dark:bg-amber-900 overflow-hidden border border-amber-300 dark:border-amber-700">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 text-right font-mono">Isolation Level: 100%</p>
              </div>

              {/* Sandbox Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Protected
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Isolated
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Safe
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {report && (
        <div className="space-y-6 animate-fade-in">
          {/* Results Container */}
          <div className="p-6 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/40 via-white dark:from-amber-950/20 dark:via-slate-950 to-amber-100/30 dark:to-amber-900/10 space-y-6">
            
          {/* Sandbox Mode Banner */}
          {report.demoMode && (
            <div className="p-4 rounded-lg border-2 border-dashed border-amber-400 dark:border-amber-600 bg-amber-100/50 dark:bg-amber-900/30 animate-fade-in">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">🎭 Sandbox Mode - Safe Demonstration</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                    {report.demoNotice || "Results are static demonstrations showing what real vulnerabilities would look like. No actual scanning was performed."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {codeRemovedFromServer && (
            <div className="p-4 rounded-lg border-2 border-green-400 dark:border-green-600 bg-green-100/50 dark:bg-green-900/30 animate-fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">Code Securely Removed</p>
                  <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                    Your uploaded code has been automatically removed from the cloud. Report is retained for your records.
                  </p>
                </div>
              </div>
            </div>
          )}

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
        </div>
      )}

      {/* GitHub Connect Modal */}
      <GitHubConnect
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
        onConnect={handleGitHubConnect}
        scanning={scanning}
      />
    </div>
    </div>
  );
}
