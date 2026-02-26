import { Upload, FileCode, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload files or paste code to begin analysis.</p>
      </div>

      {/* Upload zone */}
      <div className="surface-card border-dashed p-10 flex flex-col items-center gap-5">
        <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Upload your code</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
            <FileCode className="h-3 w-3" /> .py, .js, .ts, .json, .yaml
          </p>
        </div>
        <Button onClick={startScan} disabled={scanning} className="glow-blue">
          {scanning ? "Scanning…" : "Start Scan"}
        </Button>
      </div>

      {/* Scanning progress */}
      {scanning && (
        <div className="surface-card p-6 space-y-3 animate-fade-in">
          <p className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-severity-medium animate-pulse" />
            Analyzing code…
          </p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      )}

      {/* Results preview */}
      {done && (
        <div className="surface-card p-6 space-y-4 animate-fade-in">
          <p className="text-sm font-medium flex items-center gap-2 text-severity-low">
            <CheckCircle className="h-4 w-4" />
            Scan complete — 7 vulnerabilities found
          </p>
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div className="surface-card p-3">
              <span className="text-lg font-bold text-destructive">3</span>
              <p className="text-muted-foreground mt-1">Critical</p>
            </div>
            <div className="surface-card p-3">
              <span className="text-lg font-bold text-severity-high">2</span>
              <p className="text-muted-foreground mt-1">High</p>
            </div>
            <div className="surface-card p-3">
              <span className="text-lg font-bold text-severity-medium">2</span>
              <p className="text-muted-foreground mt-1">Medium</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <p className="text-[11px] text-muted-foreground">
              I confirm I have authorization to test this code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
