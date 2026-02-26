import { Lock, Shield, AlertCircle, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAnalyzeClick = () => {
    if (isAuthenticated) {
      navigate("/scanner");
    } else {
      navigate("/login?redirect=/scanner");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6">
      {/* Decorative dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[20%] h-1 w-1 rounded-full bg-primary/30" />
        <div className="absolute top-40 right-[30%] h-1 w-1 rounded-full bg-primary/20" />
        <div className="absolute bottom-32 left-[40%] h-1.5 w-1.5 rounded-full bg-primary/20" />
        <div className="absolute top-60 right-[15%] h-1 w-1 rounded-full bg-muted-foreground/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl text-center">
        {/* Badge */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>End-to-end encrypted</span>
        </div>

        {/* Hero */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gradient">
          Find Vulnerabilities
          <br />
          Before Hackers Do
        </h1>
        <p className="text-base text-muted-foreground max-w-md">
          Instant security analysis in ephemeral, encrypted environments.
        </p>

        {/* Stats Bar */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4 pb-4">
          <span className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary" />
            16+ Vulnerability Checks
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="flex items-center gap-2">
            <Shield className="h-3 w-3 text-primary" />
            OWASP Top 10
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-primary" />
            Real-time Results
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button size="lg" className="glow-blue" onClick={handleAnalyzeClick}>
            Analyze Now
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/reports")}>
            View Demo Report
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 w-full max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Secret Detection */}
            <div className="surface-card p-6 rounded-lg border border-border hover:border-primary/40 transition-colors group">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Secret Detection</h3>
              <p className="text-xs text-muted-foreground">
                Identifies exposed API keys, credentials, and sensitive data in code.
              </p>
            </div>

            {/* OWASP Top 10 */}
            <div className="surface-card p-6 rounded-lg border border-border hover:border-primary/40 transition-colors group">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">OWASP Top 10 Scanning</h3>
              <p className="text-xs text-muted-foreground">
                Scans for common vulnerabilities including injection, broken auth, and more.
              </p>
            </div>

            {/* Real-time Reports */}
            <div className="surface-card p-6 rounded-lg border border-border hover:border-primary/40 transition-colors group">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Real-time Reports</h3>
              <p className="text-xs text-muted-foreground">
                Get instant vulnerability reports with detailed remediation guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-muted-foreground flex items-center gap-2 pt-8">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-severity-low animate-pulse" />
          Files auto-deleted after 3 minutes • End-to-end encrypted
        </p>
      </div>
    </div>
  );
}
