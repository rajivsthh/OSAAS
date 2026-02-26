import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "primary" | "destructive" | "medium" | "low";
  progress?: number; // 0-100
}

const accentMap: Record<string, string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  medium: "text-severity-medium",
  low: "text-severity-low",
};

const barMap: Record<string, string> = {
  primary: "bg-primary",
  destructive: "bg-destructive",
  medium: "bg-severity-medium",
  low: "bg-severity-low",
};

export default function StatCard({ label, value, sub, accent = "primary", progress }: StatCardProps) {
  return (
    <div className="surface-card p-5 flex flex-col gap-3 animate-fade-in">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold ${accentMap[accent]}`}>{value}</span>
      {progress !== undefined && (
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full ${barMap[accent]}`} style={{ width: `${progress}%` }} />
        </div>
      )}
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}
