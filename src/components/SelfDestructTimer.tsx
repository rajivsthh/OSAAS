import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const TOTAL_SECONDS = 3 * 60; // 3 minutes

export default function SelfDestructTimer() {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const pct = (seconds / TOTAL_SECONDS) * 100;
  const isUrgent = seconds < 60;

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium tabular-nums">
      <Timer className={`h-3.5 w-3.5 ${isUrgent ? "text-destructive animate-pulse-glow" : "text-muted-foreground"}`} />
      <div className="flex items-center gap-2">
        <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isUrgent ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={isUrgent ? "text-destructive" : "text-muted-foreground"}>
          {m}:{s.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
