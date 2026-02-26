import { Upload, FileCode, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

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

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button size="lg" className="glow-blue" onClick={() => navigate("/scanner")}>
            Analyze Now
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/reports")}>
            View Demo Report
          </Button>
        </div>

        {/* Upload zone */}
        <div className="mt-4 w-full max-w-lg surface-card p-8 flex flex-col items-center gap-4 border-dashed cursor-pointer hover:border-primary/40 transition-colors group">
          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground font-medium">Drop your files here</p>
            <p className="text-xs text-muted-foreground mt-1">
              <FileCode className="inline h-3 w-3 mr-1" />
              .py, .js, .ts, .json, .yaml
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-muted-foreground flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-severity-low animate-pulse" />
          Files auto-deleted after 3 minutes • End-to-end encrypted
        </p>
      </div>
    </div>
  );
}
